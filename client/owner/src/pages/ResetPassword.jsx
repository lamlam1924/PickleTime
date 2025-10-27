import React, {useState, useEffect} from 'react';
import {Link, useSearchParams, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../hooks/useAxiosInstance';
import toast from 'react-hot-toast';

const resetPasswordSchema = yup.object().shape({
    token: yup
        .string()
        .required('Vui lòng nhập mã xác thực')
        .min(1, 'Reset token is required'),
    newPassword: yup
        .string()
        .required('Vui lòng nhập mật khẩu mới')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp'),
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const tokenFromUrl = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
    });

    // Auto-fill token from URL
    useEffect(() => {
        if (tokenFromUrl) {
            setValue('token', tokenFromUrl);
        }
    }, [tokenFromUrl, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                token: data.token || tokenFromUrl,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            const result = await response.data;
            toast.success(result.message || 'Đặt lại mật khẩu thành công!');
            setSuccess(true);
        } catch (error) {
            if (error.response?.data?.message) {
                const errorMessage = error.response.data.message;

                // Show a specific message for expired token
                if (errorMessage.includes('expired')) {
                    toast.error('Liên kết đã hết hạn. Vui lòng yêu cầu liên kết mới.', {
                        duration: 5000,
                    });
                } else if (errorMessage.includes('Invalid')) {
                    toast.error('Liên kết không hợp lệ. Vui lòng thử lại.', {
                        duration: 5000,
                    });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 text-green-500">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Đặt lại mật khẩu thành công
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập bằng mật khẩu mới.
                        </p>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Đến trang đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {tokenFromUrl
                            ? 'Nhập mật khẩu mới của bạn bên dưới.'
                            : 'Nhập mã xác thực trong email và mật khẩu mới.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {!tokenFromUrl && (
                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                                    Mã xác thực
                                </label>
                                <input
                                    {...register('token')}
                                    type="text"
                                    autoComplete="off"
                                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter reset token from email"
                                />
                                {errors.token && (
                                    <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            <input
                                {...register('newPassword')}
                                type="password"
                                autoComplete="new-password"
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter new password"
                            />
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                autoComplete="new-password"
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none"
                                         viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </div>
                            ) : (
                                'Đặt lại mật khẩu'
                            )}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                Liên kết hết hạn? Gửi lại yêu cầu
                            </Link>
                        </div>
                        <div>
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
