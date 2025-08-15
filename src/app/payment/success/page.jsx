import PaymentLayout from '@/components/layout/PaymentLayout';
import PaymentSuccessForm from '@/components/payment/PaymentSuccessForm';

export const metadata = {
    title: 'Payment Successful - NydArt Advisor',
    description: 'Your payment was successful',
};

export default function PaymentSuccessPage() {
    return (
        <PaymentLayout>
            <PaymentSuccessForm />
        </PaymentLayout>
    );
} 