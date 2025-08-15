"use client";

import Image from "next/image";
import ThemeButton from "@/components/ui/ThemeButton";
import { useTheme } from "@/context/ThemeContext";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLayout from '@/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
    const { isDarkMode } = useTheme();
    return (
        <AuthLayout>
            <ForgotPasswordForm />
        </AuthLayout>
    );
} 