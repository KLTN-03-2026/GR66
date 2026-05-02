"use client";

import React from "react";

type Props = {
  currentStep: number;
  steps: string[];
};

export default function Progress({ currentStep, steps }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between relative">

        {/* Line background */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 z-0" />

        {/* Progress line */}
        <div
          className="absolute top-4 left-0 h-1 bg-green-500 z-0 transition-all duration-300"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center z-10 w-1/3">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                ${
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-yellow-400 border-yellow-400 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500"
                }`}
              >
                {isDone ? "✔" : index + 1}
              </div>

              <span
                className={`mt-2 text-sm ${
                  isCurrent ? "text-black font-semibold" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}