const DashboardHeader = ({ title, subtitle, children }) => {
    return (
        <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-text mb-3 leading-tight bg-gradient-to-r from-text to-text/80 bg-clip-text">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-text/70 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {subtitle}
                </p>
            )}
            {children}
        </div>
    );
};

export default DashboardHeader; 