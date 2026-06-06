type Props = {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
};

export function OnboardingStepper({ currentStep, totalSteps = 4, labels }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step < currentStep
                    ? "bg-[#C9A96E] text-white"
                    : step === currentStep
                    ? "bg-[#C9A96E] text-white ring-4 ring-[#C9A96E]/20"
                    : "bg-[#E8E2DB] text-[#6B6560]"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {labels?.[i] && (
                <span className="text-xs text-muted-foreground mt-1 hidden sm:block whitespace-nowrap">
                  {labels[i]}
                </span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all ${
                  step < currentStep ? "bg-[#C9A96E]" : "bg-[#E8E2DB]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
