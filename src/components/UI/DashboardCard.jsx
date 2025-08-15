import { FaPalette, FaChartLine, FaCreditCard, FaBell } from 'react-icons/fa';

const DashboardCard = ({
    title,
    value,
    subtitle,
    icon: Icon = FaPalette,
    iconColor = 'text-primary-coral',
    iconBg = 'bg-primary-coral/10',
    progress,
    progressColor = 'text-green-500',
    progressBarColor = 'bg-green-500'
}) => {
    return (
        <div className="bg-background-alt rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                    <Icon className={`text-2xl ${iconColor}`} />
                </div>
                <span className="text-sm text-text/60 font-medium">{title}</span>
            </div>
            <h3 className="text-3xl font-bold text-text mb-2 leading-tight">{value}</h3>
            <p className="text-text/60 text-sm font-medium">{subtitle}</p>
            {progress && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-text/60 font-medium">Progress</span>
                        <span className={`font-semibold ${progressColor}`}>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2.5 shadow-inner">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${progressBarColor} shadow-sm`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardCard; 