'use client';

import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

const PaymentLayout = ({ children }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-[600px] bg-background rounded-3xl shadow-2xl p-8">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Image
                        src={isDarkMode ? '/Logo/Long_logo_dark.svg' : '/Logo/Long_logo_light.svg'}
                        alt="NYDART Logo"
                        width={150}
                        height={50}
                        className="h-12 w-auto mx-auto"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PaymentLayout; 