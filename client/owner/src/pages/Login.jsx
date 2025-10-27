import useLoginForm from "@hooks/useLoginForm";
import { Link } from "react-router-dom";

import { Button, FormField } from "@components/common";
import GoogleLoginButton from "@components/common/GoogleLoginButton";

const Login = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useLoginForm();

  return (
    <div className="flex items-center justify-center  min-h-screen max-md:p-4 bg-base-200 p-4 ">
      <div className="card w-full border  lg:w-96 bg-base-100 shadow-xl ">
        <div className="card-body ">
          <h2 className="card-title justify-center">Đăng nhập</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="link link-hover text-sm">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="form-control mt-6">
              <Button type="submit" className="btn-primary" loading={loading}>
                Đăng nhập
              </Button>
            </div>
          </form>
          
          <div className="divider">HOẶC</div>
          
          <GoogleLoginButton />
          
          <div className="text-center mt-4">
            <Link to="/signup" className="link link-hover">
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
