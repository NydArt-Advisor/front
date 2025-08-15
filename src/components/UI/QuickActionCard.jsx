import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const QuickActionCard = ({
    href,
    title,
    description,
    icon: Icon,
    iconColor = 'text-primary-coral',
    iconBg = 'bg-primary-coral/10'
}) => {
    return (
        <Link
            href={href}
            className="bg-background-alt rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-text/5 hover:border-text/10 group hover:-translate-y-1"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center group-hover:bg-primary-coral/20 transition-all duration-300 shadow-sm group-hover:scale-105`}>
                    <Icon className={`text-2xl ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <FaArrowRight className="text-text/40 group-hover:text-primary-coral transition-all duration-300 group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-primary-coral transition-colors duration-300">{title}</h3>
            <p className="text-text/60 text-sm leading-relaxed">{description}</p>
        </Link>
    );
};

export default QuickActionCard; 