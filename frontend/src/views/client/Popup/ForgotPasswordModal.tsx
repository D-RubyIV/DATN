import React, { useState } from 'react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); 
            setSuccessMessage('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn!');
        } catch (err) {
            setError('Không thể gửi yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        onClick={onClose}
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="#c6c7c7"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-5">
                        <div className="text-center">
                            <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                                Quên Mật Khẩu
                            </p>
                            <p className="mt-2 text-sm leading-4 text-slate-600">
                                Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full mt-4">
                            <label htmlFor="email" className="sr-only">
                                Địa chỉ email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white mt-4"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Gửi yêu cầu'}
                            </button>
                        </form>

                        {error && <p className="mt-2 text-red-500">{error}</p>}
                        {successMessage && <p className="mt-2 text-green-500">{successMessage}</p>}

                        <div className="mt-6 text-center text-sm text-slate-600">
                            <button
                                onClick={onClose}
                                className="font-medium text-[#4285f4]"
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
