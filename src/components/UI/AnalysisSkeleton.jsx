const SkeletonSection = ({ className = '' }) => (
    <div className={className}>
        <div className="h-7 w-48 bg-text/5 rounded-lg mb-4" />
        <div className="space-y-3">
            <div className="h-4 bg-text/5 rounded w-full" />
            <div className="h-4 bg-text/5 rounded w-5/6" />
            <div className="h-4 bg-text/5 rounded w-4/6" />
        </div>
    </div>
);

const AnalysisSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Style Badge */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-32 bg-text/5 rounded-full" />
            </div>

            {/* Main Analysis Grid */}
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-text/10 space-y-8">
                {/* Technical Assessment */}
                <SkeletonSection className="border-b border-text/10 pb-6" />

                {/* Composition */}
                <SkeletonSection className="border-b border-text/10 pb-6" />

                {/* Color Theory */}
                <SkeletonSection className="border-b border-text/10 pb-6" />

                {/* Style & Context */}
                <SkeletonSection className="border-b border-text/10 pb-6" />

                {/* Improvements */}
                <div className="space-y-4">
                    <div className="h-7 w-48 bg-text/5 rounded-lg" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="h-6 w-6 bg-text/5 rounded-full flex-shrink-0" />
                                <div className="h-4 bg-text/5 rounded w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Resources */}
                <div className="mt-6 bg-background-alt rounded-xl p-6 border border-text/10">
                    <div className="h-7 w-48 bg-text/5 rounded-lg mb-4" />
                    <div className="space-y-3">
                        <div className="h-4 bg-text/5 rounded w-full" />
                        <div className="h-4 bg-text/5 rounded w-5/6" />
                        <div className="h-4 bg-text/5 rounded w-4/6" />
                        <div className="h-4 bg-text/5 rounded w-5/6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisSkeleton; 