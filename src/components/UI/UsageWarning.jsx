import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

const UsageWarning = ({
    type = 'warning', // 'warning' or 'error'
    title,
    message,
    actionText = 'Upgrade Plan',
    actionHref = '/subscribe'
}) => {
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-50/80' : 'bg-yellow-50/80';
    const borderColor = isError ? 'border-red-200/60' : 'border-yellow-200/60';
    const textColor = isError ? 'text-red-800' : 'text-yellow-800';
    const iconColor = isError ? 'text-red-500' : 'text-yellow-500';
    const iconBg = isError ? 'bg-red-500/10' : 'bg-yellow-500/10';
    const buttonColor = isError ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600';

    return (
        <div className={`mt-6 ${bgColor} border ${borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm`}>
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <FaBell className={`${iconColor} text-lg`} />
                </div>
                <div className="flex-1">
                    <h3 className={`font-semibold ${textColor} text-lg mb-1`}>{title}</h3>
                    <p className={`${textColor.replace('800', '700')} text-sm leading-relaxed`}>
                        {message}
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <Link
                    href={actionHref}
                    className={`inline-flex items-center px-6 py-3 ${buttonColor} text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md hover:scale-105`}
                >
                    {actionText}
                </Link>
            </div>
        </div>
    );
};

export default UsageWarning; 