const AnalysisSkeleton = () => {
    return (
        <div className="space-y-6 bg-white rounded-2xl p-6 shadow-lg animate-pulse">
            {/* Art Style */}
            <div>
                <div className="h-7 w-32 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Analysis */}
            <div>
                <div className="h-7 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Improvements */}
            <div>
                <div className="h-7 w-48 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Technical Aspects */}
            <div>
                <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-gray-200 rounded"
                        />
                    ))}
                </div>
            </div>

            {/* Learning Resources */}
            <div>
                <div className="h-7 w-44 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
};

export default AnalysisSkeleton; 