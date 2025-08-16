import PaymentLayout from '@/components/layout/PaymentLayout';
import PaymentFailedForm from '@/components/payment/PaymentFailedForm';

export const metadata = {
    title: 'Payment Failed - NydArt Advisor',
    description: 'Your payment was not successful',
};

export default function PaymentFailedPage() {
    return (
        <PaymentLayout>
            <PaymentFailedForm />
        </PaymentLayout>
    );
} 