import { FaCheck, FaTimes, FaCrown, FaStar, FaRocket } from 'react-icons/fa';

const PricingCard = ({
    plan,
    isPopular = false,
    onSubscribe,
    loading = false
}) => {
    const getPlanIcon = (planId) => {
        switch (planId) {
            case 'free':
                return FaStar;
            case 'pro':
                return FaRocket;
            case 'super-pro':
                return FaCrown;
            default:
                return FaStar;
        }
    };

    const getPlanColor = (planId) => {
        switch (planId) {
            case 'free':
                return 'bg-gray-100 text-gray-600';
            case 'pro':
                return 'bg-primary-coral text-white';
            case 'super-pro':
                return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const PlanIcon = getPlanIcon(plan.id);
    const planColor = getPlanColor(plan.id);

    return (
        <div className={`
            relative rounded-2xl p-8 transition-all duration-300 border border-text/5 hover:border-text/10
            ${isPopular
                ? 'ring-2 ring-primary-coral bg-background shadow-xl scale-105'
                : 'bg-background-alt hover:shadow-lg shadow-sm'
            }
        `}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-coral text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${planColor}`}>
                    <PlanIcon className="text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                <div className="mb-4">
                    <span className="text-5xl font-bold text-text">{plan.price}</span>
                    <span className="text-text/60 text-lg">/{plan.period}</span>
                </div>
                <p className="text-text/70 mb-4 text-lg">
                    {plan.requests} AI art analyses per month
                </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-text mb-4 text-center">What's included:</h4>
                {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <FaCheck className="text-green-500 flex-shrink-0 text-lg" />
                        <span className="text-text/80 text-sm leading-relaxed">{feature}</span>
                    </div>
                ))}
                {Array.isArray(plan.limitations) && plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <FaTimes className="text-red-500 flex-shrink-0 text-lg" />
                        <span className="text-text/60 text-sm leading-relaxed">{limitation}</span>
                    </div>
                ))}
            </div>

            {/* Subscribe Button */}
            <button
                onClick={() => onSubscribe(plan.id)}
                disabled={loading}
                className={`
                    w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 text-lg
                    ${plan.id === 'free'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isPopular
                            ? 'bg-primary-coral hover:bg-primary-salmon text-white hover:shadow-lg hover:scale-105'
                            : 'bg-background border-2 border-primary-coral text-primary-coral hover:bg-primary-coral hover:text-white hover:shadow-lg hover:scale-105'
                    }
                `}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mr-3"></div>
                        Processing...
                    </div>
                ) : plan.id === 'free' ? (
                    'Get Started Free'
                ) : (
                    'Subscribe Now'
                )}
            </button>
        </div>
    );
};

export default PricingCard; 