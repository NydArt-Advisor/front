import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Link from "next/link";
import AuthService from "@/services/auth.service";

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await AuthService.resetPassword(token, password);
            setSuccess("Your password has been reset. You can now log in.");
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md min-h-[600px] flex flex-col">
            <h1 className="text-3xl font-bold mb-2 text-text">Reset Password</h1>
            <p className="text-text/60 mb-8">Enter your new password below.</p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <Input
                    label="New Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                />
                <div className="mt-auto">
                    <Button
                        type="submit"
                        className="w-full bg-primary-coral hover:bg-primary-salmon text-white"
                        loading={loading}
                        disabled={!!success}
                    >
                        Reset Password
                    </Button>
                    <p className="text-center text-sm text-text/60 mt-6">
                        Back to{' '}
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

export default ResetPasswordForm; 