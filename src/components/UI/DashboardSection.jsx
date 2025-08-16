const DashboardSection = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-background-alt rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10 ${className}`}>
            {title && <h2 className="text-xl font-semibold text-text mb-6 text-center lg:text-left">{title}</h2>}
            {children}
        </div>
    );
};

export default DashboardSection; 