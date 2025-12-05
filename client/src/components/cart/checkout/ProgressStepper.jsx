import React from 'react';
import { MapPin, CreditCard, Package, Check } from 'lucide-react';

export default function ProgressStepper({ step }) {
    const steps = [
        { icon: MapPin, label: "Shipping", number: 1 },
        { icon: CreditCard, label: "Payment", number: 2 },
        { icon: Package, label: "Review", number: 3 },
    ];

    const iconSize = 40; // w-10 = 40px
    const halfIconSize = iconSize / 2; // 20px
    const lineHeight = 4; // h-1 = 4px
    const lineTopPosition = halfIconSize - (lineHeight / 2); // Center line vertically with icon

    return (
        <div className="bg-white rounded-2xl shadow-lg p-3">
            <div className="flex items-center justify-between relative">
                {/* Progress line positioned absolutely */}
                <div className="absolute top-0 left-0 w-full">
                    <div 
                        className="absolute h-1 bg-gray-200 rounded transition-all duration-300"
                        style={{
                            left: `${halfIconSize}px`,
                            right: `${halfIconSize}px`,
                            top: `${lineTopPosition}px`,
                        }}
                    ></div>
                    
                    {/* Filled progress line */}
                    <div 
                        className="absolute h-1 bg-green-500 rounded transition-all duration-300"
                        style={{
                            left: `${halfIconSize}px`,
                            width: step > 1 ? `${((step - 1) / (steps.length - 1)) * 100}%` : '0%',
                            top: `${lineTopPosition}px`,
                        }}
                    ></div>
                </div>

                {steps.map((s, i) => {
                    const StepIcon = s.icon;
                    const isActive = step === s.number;
                    const isCompleted = step > s.number;

                    return (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-2 relative z-10">
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
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}