import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Logo from '../components/Logo';

// Where the Expense Ledger frontend is running.
// Dev: the ledger's own `npm run dev` (Vite default: http://localhost:5173)
// Prod: wherever you deploy the ledger's frontend (Vercel/Netlify/etc.) —
// set VITE_LEDGER_URL in client/.env to that URL before building.
const LEDGER_URL = import.meta.env.VITE_LEDGER_URL || "http://localhost:5173";

const ProductPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <SEO
        title="Expense Ledger — Track Spending, Budgets & Investments"
        description="A free expense tracker with budgets, investment tracking, loan/EMI calculators, and goal planning."
        path="/product"
      />

      {/* Slim top bar so it's obviously part of the site, not a dead end */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <Logo className='h-8 w-auto' />
        </Link>
        <span className="text-sm text-slate-500">Expense Ledger</span>
        <Link
          to="/"
          className="px-4 py-1.5 text-sm border rounded-full text-slate-700 hover:bg-slate-50 transition"
        >
          ← Back to home
        </Link>
      </div>

      {/* The ledger app runs in its own isolated document — it has its own
          fonts/theme/routing/auth, so embedding as an iframe avoids any
          style or router conflicts with the rest of this site. */}
      <iframe
        src={LEDGER_URL}
        title="Expense Ledger"
        className="flex-1 w-full border-none"
      />
    </div>
  );
};

export default ProductPage;
