import { useState } from 'react';
import { FaTimes, FaCreditCard, FaLock, FaShieldAlt } from 'react-icons/fa';

const PaymentModal = ({
    isOpen,
    onClose,
    selectedPlan,
    onSubmit,
    loading = false
}) => {
    const [paymentMethod, setPaymentMethod] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });

    const handleInputChange = (field, value) => {
        setPaymentMethod(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(paymentMethod);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-text/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text">Complete Subscription</h2>
                    <button
                        onClick={onClose}
                        className="text-text/60 hover:text-text p-2 rounded-lg hover:bg-background-alt transition-all duration-300"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Selected Plan Summary */}
                <div className="bg-background-alt rounded-xl p-4 mb-6 border border-text/5">
                    <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${selectedPlan.id === 'pro'
                                ? 'bg-primary-coral text-white'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            }`}>
                            <span className="text-2xl font-bold">{selectedPlan.name[0]}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-text text-lg">{selectedPlan.name}</h3>
                            <p className="text-text/70">{selectedPlan.price}/month</p>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center space-x-3 mb-6 p-3 bg-green-50/50 border border-green-200/50 rounded-xl">
                    <FaShieldAlt className="text-green-500 text-lg" />
                    <p className="text-green-700 text-sm font-medium">
                        Your payment information is secure and encrypted
                    </p>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text mb-2">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            value={paymentMethod.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-xl focus:ring-2 focus:ring-primary-coral focus:border-transparent transition-all duration-300"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text mb-2">
                            Card Number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={paymentMethod.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                className="w-full px-4 py-3 pl-12 border border-text/20 rounded-xl focus:ring-2 focus:ring-primary-coral focus:border-transparent transition-all duration-300"
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                required
                            />
                            <FaCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                value={paymentMethod.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                className="w-full px-4 py-3 border border-text/20 rounded-xl focus:ring-2 focus:ring-primary-coral focus:border-transparent transition-all duration-300"
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text mb-2">
                                CVV
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={paymentMethod.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-3 pr-12 border border-text/20 rounded-xl focus:ring-2 focus:ring-primary-coral focus:border-transparent transition-all duration-300"
                                    placeholder="123"
                                    maxLength="4"
                                    required
                                />
                                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/40" />
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-text px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary-coral hover:bg-primary-salmon text-white px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 font-semibold hover:shadow-lg hover:scale-105"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                `Subscribe for ${selectedPlan.price}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal; 