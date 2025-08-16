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
    title: {
        default: 'NydArt Advisor - AI-Powered Artwork Analysis',
        template: '%s - NydArt Advisor'
    },
    description: 'Your personal art advisor powered by AI',
    icons: {
        icon: [
            {
                url: '/Logo/Logo_icon_dark.svg',
                media: '(prefers-color-scheme: light)',
                type: 'image/svg+xml',
            },
            {
                url: '/Logo/Logo_icon_light.svg',
                media: '(prefers-color-scheme: dark)',
                type: 'image/svg+xml',
            },
        ],
        shortcut: '/Logo/Logo_icon_dark.svg',
        apple: '/Logo/Logo_icon_dark.svg',
        other: [
            {
                rel: 'mask-icon',
                url: '/Logo/Logo_icon_dark.svg',
                color: '#FF6B35',
            },
        ],
    },
    manifest: '/manifest.json',
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