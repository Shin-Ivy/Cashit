"use client";

import { useState, useCallback } from "react";
import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Tag,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

type TransactionType = "income" | "expense";

interface AddTransactionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const INCOME_CATEGORIES: readonly string[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
  "Other Income",
] as const;

const EXPENSE_CATEGORIES: readonly string[] = [
  "Food",
  "Transport",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Other Expense",
] as const;

export default function AddTransactionModal({
  isOpen,
  onClose,
}: AddTransactionModalProps): React.JSX.Element | null {
  const [txnType, setTxnType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories =
    txnType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      // Allow only digits
      const raw = e.target.value.replace(/\D/g, "");
      setAmount(raw);
    },
    []
  );

  const formatDisplayAmount = (raw: string): string => {
    if (raw === "") return "";
    return new Intl.NumberFormat("id-ID").format(Number(raw));
  };

  const handleSave = useCallback((): void => {
    if (amount === "" || amount === "0" || category === "") return;

    // Show success animation
    setShowSuccess(true);

    setTimeout(() => {
      // Reset form
      setAmount("");
      setCategory("");
      setDescription("");
      setTxnType("expense");
      setShowSuccess(false);
      onClose();
    }, 1200);
  }, [amount, category, onClose]);

  const handleClose = useCallback((): void => {
    if (showSuccess) return;
    setAmount("");
    setCategory("");
    setDescription("");
    setTxnType("expense");
    setIsCategoryOpen(false);
    onClose();
  }, [showSuccess, onClose]);

  const handleTypeSwitch = useCallback(
    (type: TransactionType): void => {
      setTxnType(type);
      // Reset category when switching type since categories differ
      setCategory("");
    },
    []
  );

  if (!isOpen) return null;

  const isFormValid = amount !== "" && amount !== "0" && category !== "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-base/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface-2/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-card overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                txnType === "income"
                  ? "bg-mint/10"
                  : "bg-expense/10"
              }`}
            >
              {txnType === "income" ? (
                <ArrowDownLeft className="w-4 h-4 text-mint" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-expense" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-on-base">
              Add Transaction
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={showSuccess}
            className="w-7 h-7 rounded-lg bg-surface hover:bg-border/50 flex items-center justify-center text-muted hover:text-on-base transition-all disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {showSuccess ? (
            /* ── Success State ───────────────────────────────── */
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 rounded-full bg-mint/10 flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="w-8 h-8 text-mint" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-mint">
                  Transaction Saved!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Your {txnType} has been recorded successfully.
                </p>
              </div>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────────── */
            <div className="flex flex-col gap-5">
              {/* Income / Expense Toggle */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-400">
                  Transaction Type
                </label>
                <div className="flex gap-2 p-1 bg-surface border border-border rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTypeSwitch("income")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      txnType === "income"
                        ? "bg-mint/15 text-mint shadow-glow-mint"
                        : "text-gray-400 hover:text-gray-100"
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSwitch("expense")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      txnType === "expense"
                        ? "bg-expense/15 text-expense"
                        : "text-gray-400 hover:text-gray-100"
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Expense
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="txn-amount"
                  className="text-xs font-medium text-gray-400"
                >
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                    Rp
                  </span>
                  <input
                    id="txn-amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={formatDisplayAmount(amount)}
                    onChange={handleAmountChange}
                    className="w-full h-12 bg-surface border border-border text-gray-100 rounded-xl pl-16 pr-4 text-lg font-semibold focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/30 transition-all placeholder:text-muted/40"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="txn-description"
                  className="text-xs font-medium text-gray-400"
                >
                  Description
                  <span className="text-muted/60 ml-1">(optional)</span>
                </label>
                <input
                  id="txn-description"
                  type="text"
                  placeholder="e.g., Lunch at restaurant"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                  className="w-full h-10 bg-surface border border-border text-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/30 transition-all placeholder:text-muted/40"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs font-medium text-gray-400">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((v) => !v)}
                  className={`w-full h-10 bg-surface border rounded-xl px-4 text-sm flex items-center justify-between transition-all ${
                    category !== ""
                      ? "border-border text-gray-100"
                      : "border-border text-muted/60"
                  } focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/30`}
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-muted" />
                    {category !== "" ? category : "Select a category"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isCategoryOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-10 bg-surface-2 border border-border rounded-xl shadow-card max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          category === cat
                            ? txnType === "income"
                              ? "bg-mint/10 text-mint"
                              : "bg-expense/10 text-expense"
                            : "text-gray-100 hover:bg-surface hover:text-on-base"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-10 bg-surface border border-border text-gray-400 font-semibold text-sm rounded-xl hover:bg-surface-2 hover:text-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className={`flex-1 h-10 font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    txnType === "income"
                      ? "bg-gradient-to-r from-mint to-mint/80 text-base shadow-glow-mint"
                      : "bg-gradient-to-r from-expense to-expense/80 text-white"
                  }`}
                >
                  Save {txnType === "income" ? "Income" : "Expense"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
