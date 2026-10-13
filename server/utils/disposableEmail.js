// Throw-away / temporary mailbox providers. Used to stop people farming free ATS checks
// with endless fake accounts. Matches the domain and any sub-domain of it.
// Add more without a code change via env: BLOCKED_EMAIL_DOMAINS="a.com,b.net"
const BUILT_IN = [
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamail.de',
  'sharklasers.com', 'grr.la', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '20minutemail.com', 'minutemail.com',
  'temp-mail.org', 'temp-mail.io', 'temp-mail.ru', 'tempmail.com', 'tempmail.net', 'tempmail.dev', 'tempmailo.com', 'tempail.com',
  'tempinbox.com', 'tempr.email', 'tmpmail.org', 'tmpmail.net', 'tmail.ws', 'emltmp.com',
  'throwawaymail.com', 'throwaway.email', 'trashmail.com', 'trashmail.net', 'trashmail.de', 'trashmail.org', 'trash-mail.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.org', 'nospam.ze.tc',
  'getnada.com', 'nada.email', 'maildrop.cc', 'dispostable.com', 'fakeinbox.com', 'fakemail.net', 'mailnesia.com', 'mintemail.com',
  'mohmal.com', 'emailondeck.com', 'spamgourmet.com', 'mytemp.email', 'burnermail.io', 'inboxkitten.com', 'mailcatch.com',
  'moakt.com', 'moakt.cc', 'discard.email', 'discardmail.com', 'discardmail.de', '33mail.com', 'anonbox.net', 'spambox.us',
  'mailforspam.com', 'harakirimail.com', 'getairmail.com', 'dropmail.me', 'mail.tm', 'mailpoof.com', 'luxusmail.org',
  '1secmail.com', '1secmail.org', '1secmail.net', 'esiix.com', 'wwjmp.com', 'xojxe.com', 'yoggm.com',
  'mailtemp.info', 'tempmailaddress.com', 'tempmailer.com', 'temporary-mail.net', 'instant-mail.de', 'owlymail.com',
  'mvrht.net', 'dayrep.com', 'cuvox.de', 'rhyta.com', 'einrot.com', 'fleckens.hu', 'gustr.com', 'superrito.com', 'teleworm.us', 'armyspy.com',
  'byom.de', 'mail-temporaire.fr', 'receiveee.com', 'crazymailing.com', 'linshiyouxiang.net', 'fexpost.com', 'fexbox.org',
];

const extra = String(process.env.BLOCKED_EMAIL_DOMAINS || '')
  .split(',').map((d) => d.trim().toLowerCase()).filter(Boolean);

const BLOCKED = new Set([...BUILT_IN, ...extra]);

export const isDisposableEmail = (email) => {
  const domain = String(email || '').trim().toLowerCase().split('@')[1];
  if (!domain) return false;
  const parts = domain.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    if (BLOCKED.has(parts.slice(i).join('.'))) return true;
  }
  return false;
};
