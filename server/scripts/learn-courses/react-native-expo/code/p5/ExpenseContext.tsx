import { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CATEGORIES = ["Food", "Travel", "Bills", "Fun", "Other"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Expense = { id: string; title: string; cents: number; category: Category };

type State = { items: Expense[]; loaded: boolean };
type Action =
  | { type: "load"; items: Expense[] }
  | { type: "add"; item: Expense }
  | { type: "remove"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return { items: action.items, loaded: true };
    case "add":
      return { ...state, items: [action.item, ...state.items] };
    case "remove":
      return { ...state, items: state.items.filter((e) => e.id !== action.id) };
  }
}

const KEY = "expenses.v1";
type Ctx = { state: State; dispatch: React.Dispatch<Action> };
const ExpenseContext = createContext<Ctx | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], loaded: false });

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => dispatch({ type: "load", items: raw ? JSON.parse(raw) : [] }))
      .catch(() => dispatch({ type: "load", items: [] }));
  }, []);

  useEffect(() => {
    if (state.loaded) AsyncStorage.setItem(KEY, JSON.stringify(state.items));
  }, [state]);

  return <ExpenseContext.Provider value={{ state, dispatch }}>{children}</ExpenseContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
  return ctx;
}
