import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function PlanComparisonTable({ plans, allFeatures }) {
    return (
        <div className="bg-background-alt rounded-2xl shadow p-6 overflow-x-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Feature Comparison</h3>
            <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="text-left text-text/80 font-semibold text-base">Feature</th>
                        {plans.map(plan => (
                            <th key={plan.id} className="text-center text-text/80 font-semibold text-base">{plan.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {allFeatures.map((feature, idx) => (
                        <tr key={idx}>
                            <td className="py-2 text-text/70 text-sm">{feature}</td>
                            {plans.map(plan => (
                                <td key={plan.id} className="text-center">
                                    {plan.features.includes(feature) ? (
                                        <FaCheck className="inline text-green-500" />
                                    ) : (
                                        <FaTimes className="inline text-red-400" />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 