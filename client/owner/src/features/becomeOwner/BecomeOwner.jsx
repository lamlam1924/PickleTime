import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useBecomeOwner from "../../hooks/useBecomeOwner";

const BecomeOwner = () => {
    const {register, handleSubmit, errors, onSubmit, loading} =
        useBecomeOwner();
    return (
        <div className="container mx-auto mt-20  p-2">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Đăng ký trở thành Chủ sân
            </h1>
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
                        <FormField
                            label="Họ và tên"
                            name="FullName"
                            type="text"
                            register={register}
                            error={errors.FullName}

                        />
                        <FormField
                            label="Email"
                            name="Email"
                            type="email"
                            register={register}
                            error={errors.Email}
                        />
                        <FormField
                            label="Số điện thoại"
                            name="Phone"
                            type="text"
                            register={register}
                            error={errors.Phone}
                        />
                        <Button type="submit"
                                onClick={() => console.log("[Button] Đã nhấn nút Gửi đăng ký")}
                                className="btn btn-primary w-full mt-6"
                                loading={loading}>
                            Gửi đăng ký
                        </Button>
                    </form>
                </div>

                {/* content section */}
                <div className=" ">
                    <div className="shadow-md border p-6 rounded-lg h-full">
                        <h2 className="text-2xl font-semibold mb-4">Trở thành Chủ Sân</h2>
                        <p className="mb-4">
                            Tham gia PickleTime với vai trò <strong>Chủ Sân Pickleball</strong> –
                            quản lý cơ sở thể thao của bạn dễ dàng và chuyên nghiệp.
                        </p>

                        <h3 className="text-lg font-semibold mb-2">Quy trình đăng ký</h3>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Điền và gửi biểu mẫu đăng ký trực tuyến.</li>
                            <li>PickleTime sẽ xem xét và xác minh thông tin.</li>
                            <li>Nhận email thông báo kết quả và liên kết kích hoạt tài khoản.</li>
                            <li>Bắt đầu quản lý sân của bạn trên hệ thống.</li>
                        </ul>

                        <h3 className="text-lg font-semibold mb-2">Quyền lợi của Chủ Sân</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Quản lý nhiều sân chỉ trong một giao diện thống nhất.</li>
                            <li>Theo dõi và xử lý yêu cầu đặt sân nhanh chóng.</li>
                            <li>Chủ động điều chỉnh giá, khung giờ và hình thức thanh toán.</li>
                            <li>Kết nối trực tiếp với khách hàng để nâng cao trải nghiệm dịch vụ.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BecomeOwner;
