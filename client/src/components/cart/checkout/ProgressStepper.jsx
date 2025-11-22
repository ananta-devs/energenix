import React from 'react';
import { MapPin, CreditCard, Package, Check } from 'lucide-react';

export default function ProgressStepper({ step }) {
    const steps = [
        { icon: MapPin, label: "Shipping", number: 1 },
        { icon: CreditCard, label: "Payment", number: 2 },
        { icon: Package, label: "Review", number: 3 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-3">
            <div className="flex items-center justify-between">
                {steps.map((s, i) => {
                    const StepIcon = s.icon;
                    const isActive = step === s.number;
                    const isCompleted = step > s.number;

                    return (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCompleted
                                            ? "bg-green-500 text-white shadow-lg scale-110"
                                            : isActive
                                            ? "bg-purple-600 text-white shadow-lg scale-110"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <StepIcon className="w-6 h-6" />
                                    )}
                                </div>
                                <span
                                    className={`text-sm font-medium ${
                                        isActive || isCompleted
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }`}
                                    >
                                    {s.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                                        step > s.number
                                            ? "bg-green-500"
                                            : "bg-gray-200"
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}