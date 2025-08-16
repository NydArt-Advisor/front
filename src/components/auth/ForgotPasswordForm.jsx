import { useState } from "react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import ThemeButton from '@/components/UI/ThemeButton';
import Image from "next/image";
import AuthService from "@/services/auth.service";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { isDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await AuthService.forgotPassword(email);
            setSuccess("If an account with that email exists, password reset instructions have been sent. Please check your spam/junk folder if you don't see the email in your inbox.");
        } catch (err) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Image
                        src={isDarkMode ? "/Logo/Long_logo_dark.svg" : "/Logo/Long_logo_light.svg"}
                        alt="NYDART Logo"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                    />
                </div>
                <ThemeButton />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-text">Forgot Password</h1>
            <p className="text-text/60 mb-8">Enter your email address to receive password reset instructions.</p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />
                <div className="mt-auto">
                    <Button
                        type="submit"
                        className="w-full bg-primary-coral hover:bg-primary-salmon text-white"
                        loading={loading}
                    >
                        Send Reset Email
                    </Button>
                    <p className="text-center text-sm text-text/60 mt-6">
                        Remembered your password?{' '}
                        <Link
                            href="/auth/login"
                            className="text-text hover:text-primary-coral transition-colors font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm; 