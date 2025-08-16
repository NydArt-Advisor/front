import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
    title: 'Register - NydArt Advisor',
    description: 'Create your NydArt Advisor account',
};

export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
} 