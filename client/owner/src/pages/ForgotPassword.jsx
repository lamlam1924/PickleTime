import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../hooks/useAxiosInstance';
import toast from 'react-hot-toast';

const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .required('Vui lòng nhập email của bạn')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm,
            'Email không hợp lệ'
        ),
});

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
    });

    const email = watch('email');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/auth/request-password-reset', {
                email: data.email
            });

            const result = await response.data;
            toast.success(result.message);
            setEmailSent(true);
        } catch (error) {
            if (error.response) {
                toast.error(error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
            } else {
                toast.error('Lỗi kết nối mạng. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
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
                            Check Your Email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
                            <span className="font-medium text-indigo-600">{email}</span>
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Didn't receive the email?
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Kiểm tra thư mục Spam hoặc Quảng cáo.</li>
                                        <li>Đảm bảo bạn đã nhập đúng địa chỉ email.</li>
                                        <li>Liên kết sẽ hết hạn sau 24 giờ.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setEmailSent(false)}
                            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                        >
                            Thử với email khác
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-gray-600 hover:text-gray-500"
                        >
                            Quay lại đăng nhập
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
                        Quên mật khẩu?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Địa chỉ email
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            autoComplete="email"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
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
                                    Đang gửi...
                                </div>
                            ) : (
                                'Gửi liên kết đặt lại mật khẩu'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

