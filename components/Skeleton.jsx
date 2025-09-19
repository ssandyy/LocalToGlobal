



const Skeleton = ({ isLoading, children, className = '', style = {} }) => {
    if (isLoading) {
        return (
            <div
                className={`relative overflow-hidden bg-slate-100 rounded-md ${className}`}
                style={style}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-200 to-transparent animate-shimmer" />

                {/* Invisible content to maintain dimensions */}
                <div className="opacity-0">
                    {children}
                </div>
            </div>
        );
    }

    return children;
};

export default Skeleton;