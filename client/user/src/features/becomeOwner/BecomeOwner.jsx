import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useBecomeOwner from "../../hooks/useBecomeOwner";

const BecomeOwner = () => {
  const { register, handleSubmit, errors, onSubmit, loading } =
    useBecomeOwner();
  return (
    <div className="container mx-auto mt-20  p-2">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Become a Turf Owner
      </h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <FormField
              label="Name"
              name="name"
              type="text"
              register={register}
              error={errors.name}
              
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <FormField
              label="Phone Number"
              name="phone"
              type="text"
              register={register}
              error={errors.phone}
            />
            <Button className="btn btn-primary w-full mt-6" loading={loading}>
              Submit Application
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
              <li>Điền biểu mẫu đăng ký.</li>
              <li>PickleTime xem xét và duyệt hồ sơ.</li>
              <li>Nhận email kết quả và liên kết tạo tài khoản.</li>
              <li>Bắt đầu quản lý sân của bạn ngay.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Quyền lợi của Chủ Sân</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Quản lý nhiều sân cùng lúc.</li>
              <li>Theo dõi và xử lý đặt sân.</li>
              <li>Điều chỉnh giá, thời gian, thanh toán.</li>
              <li>Liên hệ trực tiếp với khách hàng.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BecomeOwner;
