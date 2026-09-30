"use client";

import { useState } from "react";

type StepRailListProps = {
  steps: string[];
};

export function StepRailList({ steps }: StepRailListProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative" data-testid="step-rail">
      <div
        className="absolute left-0 top-2 bottom-2 hidden w-1 rounded-full bg-border md:block"
        aria-hidden
      />
      <ol className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => setActiveStep(index)}
                className={`flex w-full gap-4 rounded-md border-l-4 border-transparent px-3 py-3 text-left transition-colors md:pl-6 ${
                  isActive ? "step-rail-active border-accent" : "hover:bg-card"
                }`}
                data-step-index={index}
                data-step-active={isActive ? "true" : "false"}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-sm font-semibold ${
                    isActive ? "bg-accent text-primary-foreground" : "bg-card border border-border text-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <p className="text-base leading-relaxed text-foreground">{step}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
