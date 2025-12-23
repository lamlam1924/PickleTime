import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import banner1 from "/banner-1.png"
import banner2 from "/banner-2.jpeg"
import banner3 from "/banner-3.jpeg"
import Footer from "@components/common/Footer.jsx";
import useFacilityData from "@hooks/useFacilityData.jsx";
import Carousel from "@components/common/Carousel.jsx";
import FacilityCardSkeleton from "@components/ui/FacilityCardSkeleton.jsx";
import FacilityCard from "@components/turf/FacilityCard.jsx";

const Home = () => {
    const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
    const {turfs, loading} = useFacilityData();
    const slides = [banner1, banner2, banner3];


    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="hero min-h-[70vh] bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse animate-slide-in-right">
                    <div className="w-full lg:w-1/2">
                        <Carousel slides={slides}/>
                    </div>
                    <div className="w-full lg:w-1/2 animate-zoom-in">
                        <h1 className="text-5xl font-bold ">Chào mừng đến với PickleTime</h1>
                        <p className="py-6">
                            PickleTime – nền tảng đặt sân Pickleball online nhanh gọn, tiện lợi.
                            Chỉ vài cú click, bạn đã có ngay sân chơi lý tưởng để thoả sức đam mê cùng bạn bè.
                        </p>
                        <Link
                            to={"/login"}
                            className="btn btn-accent"
                        >
                            Bắt đầu ngay
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto  p-4 animate-slide-in-left">
                <h2 className="text-3xl font-bold mb-6">Sân nổi bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({length: 3}).map((_, index) => (
                            <FacilityCardSkeleton key={`skeleton-${index}`}/>
                        ))
                        : turfs
                            .slice(0, 3)
                            .map((turf) => <FacilityCard key={turf.facilityId} turf={turf}/>)}
                </div>
                <div className="text-center mt-8">
                    <Link
                        to={isLoggedIn ? "/customer/search" : "/login"}
                        className="btn btn-primary"
                    >
                        Xem thêm
                    </Link>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Home;
