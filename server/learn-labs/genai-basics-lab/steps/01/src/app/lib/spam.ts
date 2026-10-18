// Two ways to catch scam job messages.
//  1. Rules: a person writes the rules. Clear and predictable, but only catches what the writer thought of.
//  2. Learning: the computer counts which words appear in scam and normal messages in the examples,
//     then uses those counts to judge a new message. It can notice patterns nobody wrote down.

export type Example = { text: string; spam: boolean };

export const startExamples: Example[] = [
  { text: 'Pay a registration fee of 2000 rupees to confirm your job offer today', spam: true },
  { text: 'Earn 5000 per day from home, guaranteed income, no experience needed', spam: true },
  { text: 'Urgent! Last chance, limited seats, send your bank account details now', spam: true },
  { text: 'You are selected. Share your OTP and Aadhaar number to receive the joining letter', spam: true },
  { text: 'Congratulations winner, claim your free laptop and job, pay the courier charge', spam: true },
  { text: 'Work from home and earn lakhs weekly, just pay a small security deposit first', spam: true },
  { text: 'Hurry, earn money fast with this simple task, guaranteed payment, join now', spam: true },
  { text: 'We would like to invite you for an interview on Monday at 10 am at our Pune office', spam: false },
  { text: 'Thank you for applying for the accountant role. Our team will review your resume', spam: false },
  { text: 'Please bring your certificates and one photo ID for the walk-in drive on Friday', spam: false },
  { text: 'Your application for warehouse supervisor has been shortlisted. Please confirm a time', spam: false },
  { text: 'The salary range for this role is 25000 to 30000 per month plus provident fund', spam: false },
  { text: 'Reminder: your video interview with the hiring manager starts tomorrow at 3 pm', spam: false },
  { text: 'We have received your resume and will contact you if your profile matches', spam: false },
];

const words = (text: string) => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

// ---------- 1. Rules ----------
export type Rule = { name: string; test: (text: string) => boolean };

export const RULES: Rule[] = [
  { name: 'asks you to pay first', test: (t) => /(registration|security|training|courier)\s+(fee|deposit|charge)|pay\s.*\b(fee|deposit)\b/i.test(t) },
  { name: 'promises easy money', test: (t) => /earn\s+\d+.*(per day|a day|daily|weekly)|guaranteed\s+(job|income|payment)/i.test(t) },
  { name: 'asks for private details', test: (t) => /\b(otp|aadhaar|bank account|card number|password)\b/i.test(t) },
  { name: 'pushes you to hurry', test: (t) => /\b(urgent|hurry|last chance|limited seats|act now)\b/i.test(t) },
];

export function ruleVerdict(text: string) {
  const hits = RULES.filter((r) => r.test(text)).map((r) => r.name);
  return { spam: hits.length > 0, hits };
}

// ---------- 2. Learning (naive Bayes) ----------
export class NaiveBayes {
  private counts = { spam: new Map<string, number>(), ham: new Map<string, number>() };
  private docs = { spam: 0, ham: 0 };
  private total = { spam: 0, ham: 0 };
  private vocab = new Set<string>();

  constructor(examples: Example[]) {
    for (const ex of examples) {
      const c = ex.spam ? 'spam' : 'ham';
      this.docs[c]++;
      for (const w of new Set(words(ex.text))) {
        this.counts[c].set(w, (this.counts[c].get(w) ?? 0) + 1);
        this.total[c]++;
        this.vocab.add(w);
      }
    }
  }

  // How much one word pushes towards spam (positive) or normal (negative), as a log ratio.
  weight(word: string) {
    const v = this.vocab.size || 1;
    const pSpam = ((this.counts.spam.get(word) ?? 0) + 1) / (this.total.spam + v); // +1 so unseen words never give zero
    const pHam = ((this.counts.ham.get(word) ?? 0) + 1) / (this.total.ham + v);
    return Math.log(pSpam / pHam);
  }

  classify(text: string) {
    const n = this.docs.spam + this.docs.ham;
    if (!n || !this.docs.spam || !this.docs.ham) return { spam: false, probSpam: 0.5, top: [] as { word: string; weight: number }[] };
    const uniq = [...new Set(words(text))].filter((w) => this.vocab.has(w));
    const prior = Math.log((this.docs.spam + 1) / (this.docs.ham + 1));
    const parts = uniq.map((word) => ({ word, weight: this.weight(word) }));
    const logOdds = prior + parts.reduce((s, p) => s + p.weight, 0);
    const probSpam = 1 / (1 + Math.exp(-logOdds)); // turn log-odds into a probability between 0 and 1
    const top = parts.filter((p) => Math.abs(p.weight) > 0.2).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)).slice(0, 6);
    return { spam: probSpam >= 0.5, probSpam, top };
  }
}
