import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
    title: 'Login - NydArt Advisor',
    description: 'Sign in to your NydArt Advisor account',
};

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
} 