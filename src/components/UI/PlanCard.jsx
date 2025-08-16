import React from 'react';

export default function PlanCard({ icon: Icon, name, description, price, highlight, color, onClick, buttonText, disabled }) {
    return (
        <div className={`flex-1 rounded-2xl p-8 shadow-md transition-all duration-300 text-center ${color} ${highlight ? "scale-105 z-10" : ""}`}>
            <div className="flex justify-center mb-4">
                {Icon && <Icon className="text-4xl" />}
            </div>
            <h2 className="text-2xl font-bold mb-1">{name}</h2>
            <p className="mb-4 text-text/70 text-base min-h-[40px]">{description}</p>
            <div className="text-4xl font-extrabold mb-2">{price}</div>
            <button
                className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-colors ${highlight ? "bg-white text-primary-coral hover:bg-primary-salmon" : "bg-primary-coral text-white hover:bg-primary-salmon"} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={onClick}
                disabled={disabled}
            >
                {buttonText}
            </button>
        </div>
    );
} 