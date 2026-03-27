import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ShipmentStepperProps {
  currentStep: number;
  steps: Step[];
}

export function ShipmentStepper({ currentStep, steps }: ShipmentStepperProps) {
  return (
    <div className="bg-white border-b border-[#D7DEE6]">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step.number < currentStep
                      ? 'bg-[#2E7D5B] text-white'
                      : step.number === currentStep
                      ? 'bg-[#163A5F] text-white ring-4 ring-[#5B8DB8]/30'
                      : 'bg-[#E8EEF3] text-[#5B6773]'
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-bold ${
                      step.number <= currentStep
                        ? 'text-[#163A5F]'
                        : 'text-[#5B6773]'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-[#5B6773] mt-0.5 hidden md:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all ${
                    step.number < currentStep
                      ? 'bg-[#2E7D5B]'
                      : 'bg-[#D7DEE6]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
