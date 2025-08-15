'use client';

import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

const AuthLayout = ({ children }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-[1200px] min-h-[600px] bg-background rounded-3xl shadow-2xl flex overflow-hidden">
                {/* Left side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    {children}
                </div>

                {/* Right side - Art */}
                <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-primary-coral to-primary-slate">
                    <div className="absolute inset-0">
                        <Image
                            src="/Auth/auth_bg.png"
                            alt="Abstract art"
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            style={{ objectFit: 'cover' }}
                            priority
                            className="rounded-r-3xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout; 