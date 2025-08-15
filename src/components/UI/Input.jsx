'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = React.forwardRef(({
    className,
    type = 'text',
    error,
    label,
    required,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    className={clsx(
                        "w-full px-4 py-2 rounded-lg border bg-background text-text placeholder:text-text/40 transition-colors duration-200",
                        "focus:outline-none focus:ring-2",
                        {
                            "border-text/10 focus:border-primary-coral focus:ring-primary-coral/20": !error,
                            "border-red-300 focus:border-red-500 focus:ring-red-200": error,
                            "pr-12": isPassword, // Add padding for the eye icon
                        },
                        className
                    )}
                    ref={ref}
                    autoComplete={
                        type === 'email' ? 'email' :
                            (type === 'password' && (props.name === 'password' || props.name === 'currentPassword')) ? 'current-password' :
                                (type === 'password' && (props.name === 'newPassword' || props.name === 'confirmPassword')) ? 'new-password' :
                                    (props.name === 'username' ? 'username' : undefined)
                    }
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-text/60 transition-colors duration-200 focus:outline-none focus:text-text/80"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <FaEyeSlash className="w-4 h-4" />
                        ) : (
                            <FaEye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input; 