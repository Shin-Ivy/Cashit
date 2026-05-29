"use client";

import { useState, useCallback } from "react";
import { X, Smartphone, Loader2, CheckCircle2, Wallet } from "lucide-react";

type LinkingStep = "idle" | "verifying" | "syncing" | "success";

interface LinkedWallet {
  readonly provider: string;
  readonly phone: string;
  readonly balance: number;
}

interface LinkEWalletModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onLink: (wallet: LinkedWallet) => void;
}

const EWALLET_PROVIDERS: readonly { name: string; color: string }[] = [
  { name: "GoPay", color: "bg-mint/20 text-mint" },
  { name: "OVO", color: "bg-purple-500/20 text-purple-400" },
  { name: "DANA", color: "bg-blue/20 text-blue" },
  { name: "ShopeePay", color: "bg-orange-500/20 text-orange-400" },
] as const;

export default function LinkEWalletModal({
  isOpen,
  onClose,
  onLink,
}: LinkEWalletModalProps): React.JSX.Element | null {
  const [phone, setPhone] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [step, setStep] = useState<LinkingStep>("idle");

  const handleLink = useCallback(async (): Promise<void> => {
    if (phone.length < 10 || selectedProvider === "") return;

    // Step 1: Verifying phone
    setStep("verifying");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Syncing balances
    setStep("syncing");
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Step 3: Success — generate mock balance
    const mockBalance = Math.floor(Math.random() * 2000000) + 150000;
    setStep("success");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    onLink({
      provider: selectedProvider,
      phone,
      balance: mockBalance,
    });

    // Reset
    setPhone("");
    setSelectedProvider("");
    setStep("idle");
    onClose();
  }, [phone, selectedProvider, onLink, onClose]);

  const handleClose = useCallback((): void => {
    if (step !== "idle" && step !== "success") return; // Prevent close during linking
    setPhone("");
    setSelectedProvider("");
    setStep("idle");
    onClose();
  }, [step, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-base/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface-2 border border-border rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue" />
            </div>
            <h3 className="text-sm font-semibold text-on-base">Link E-Wallet</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={step !== "idle" && step !== "success"}
            className="w-7 h-7 rounded-lg bg-surface hover:bg-border/50 flex items-center justify-center text-muted hover:text-on-base transition-all disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === "idle" ? (
            <div className="flex flex-col gap-4">
              {/* Provider selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted">
                  Select Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EWALLET_PROVIDERS.map((provider) => (
                    <button
                      key={provider.name}
                      type="button"
                      onClick={() => setSelectedProvider(provider.name)}
                      className={`
                        px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border
                        ${selectedProvider === provider.name
                          ? `${provider.color} border-current scale-[1.02]`
                          : "bg-surface border-border text-muted hover:text-on-base hover:border-border"
                        }
                      `}
                    >
                      {provider.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ewallet-phone"
                  className="text-xs font-medium text-muted"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    id="ewallet-phone"
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 bg-surface border border-border text-on-base rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/30 transition-all placeholder:text-muted/60"
                  />
                </div>
              </div>

              {/* Link button */}
              <button
                type="button"
                onClick={handleLink}
                disabled={phone.length < 10 || selectedProvider === ""}
                className="w-full h-10 bg-gradient-to-r from-blue to-mint text-base font-bold text-sm rounded-xl transition-all shadow-glow-blue active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Link E-Wallet
              </button>

              <p className="text-[10px] text-muted/60 text-center">
                This is a simulated Open Finance connection for demonstration.
              </p>
            </div>
          ) : (
            /* Linking progress states */
            <div className="flex flex-col items-center gap-4 py-6">
              {step === "verifying" && (
                <>
                  <Loader2 className="w-10 h-10 text-blue animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-on-base">
                      Verifying phone number…
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Connecting to {selectedProvider} API
                    </p>
                  </div>
                </>
              )}

              {step === "syncing" && (
                <>
                  <Loader2 className="w-10 h-10 text-mint animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-on-base">
                      Syncing balances…
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Fetching wallet data from {selectedProvider}
                    </p>
                  </div>
                </>
              )}

              {step === "success" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-mint/10 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-mint" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-mint">
                      Successfully linked!
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {selectedProvider} • {phone}
                    </p>
                  </div>
                </>
              )}

              {/* Progress bar */}
              <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    step === "verifying"
                      ? "w-1/3 bg-blue"
                      : step === "syncing"
                        ? "w-2/3 bg-mint"
                        : "w-full bg-mint"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
