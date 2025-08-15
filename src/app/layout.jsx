import { Fredoka, Yeseva_One } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/context/ThemeContext';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';

const fredoka = Fredoka({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-fredoka',
    display: 'swap',
});

const yeseva = Yeseva_One({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-yeseva',
    display: 'swap',
});

export const metadata = {
    title: 'NydArt Advisor',
    description: 'Your personal art advisor powered by AI',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fredoka.variable} ${yeseva.variable}`}>
                <ThemeProvider>
                    <AuthProvider>
                        <ClientLayout>
                            {children}
                        </ClientLayout>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
} 