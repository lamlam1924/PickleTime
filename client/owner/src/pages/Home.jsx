import {Link} from "react-router-dom";

import {Carousel, Footer} from "@components/common";

import banner1 from "/banner-1.png";
import banner2 from "/banner-2.jpeg";
import banner3 from "/banner-3.jpeg";

const Home = () => {
    const slides = [banner1, banner2, banner3];

    return (
        <div className="  bg-base-100 text-base-content">
            <div className="hero min-h-[82vh] bg-base-200 ">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="w-full lg:w-1/2">
                        <Carousel slides={slides}/>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-5xl font-bold">Chào mừng đến với PickleTime</h1>
                        <p className="py-6">
                            Nơi bạn dễ dàng tìm kiếm, đặt sân và tận hưởng những trận đấu thể thao trọn vẹn.
                            PickleTime giúp bạn kết nối đam mê và lên lịch chơi chỉ trong vài cú nhấp chuột.
                        </p>
                        <Link to="/login" className="btn btn-accent">
                            Bắt đầu ngay
                        </Link>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Home;
