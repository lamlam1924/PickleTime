import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Reviews from "../reviews/Reviews";
import FacilityDetailsSkeleton from "../ui/FacilityDetailsSkeleton";
import { 
    MapPin, Clock, Star, Phone, Mail, Home, Users, 
    Droplet, Sun, Moon, Calendar, CheckCircle, X, Image as ImageIcon
} from "lucide-react";
import useFacilityById from "../../hooks/useFacilityById.jsx";

const FacilityDetails = () => {
    const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
    const { id } = useParams();
    const { facility: turf, loading } = useFacilityById(id);
    const navigate = useNavigate();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [selectedCourtImage, setSelectedCourtImage] = useState(null);
    const [selectedCourtImages, setSelectedCourtImages] = useState([]);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const images = turf?.facilityImages || [];
    const mainImage = images.find(img => img.isMainImage) || images[0] || { imageUrl: "/banner-1.png" };
    const amenitiesList = turf?.amenities || [];

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1 || loading) return;

        const interval = setInterval(() => {
            setSelectedImageIndex((prevIndex) => 
                (prevIndex + 1) % images.length
            );
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, images.length, loading]);

    if (loading) {
        return <FacilityDetailsSkeleton />;
    }

    if (!turf) {
        return (
            <div className="alert alert-warning shadow-lg">
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <span>Facility not found</span>
                </div>
            </div>
        );
    }

    const handleReservation = () => {
        if (isLoggedIn) {
            navigate(`/customer/turf/${id}/booking`);
        } else {
            navigate(`/login`);
        }
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
        setIsAutoPlaying(false); // Pause auto-play when user manually selects
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setIsAutoPlaying(false);
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) => 
            (prevIndex + 1) % images.length
        );
        setIsAutoPlaying(false);
    };

    const handleOpenCourtImage = (courtImages) => {
        setSelectedCourtImages(courtImages);
        setModalImageIndex(0);
    };

    const handleCloseCourtModal = () => {
        setSelectedCourtImages([]);
        setModalImageIndex(0);
    };

    const handleModalPrevImage = () => {
        setModalImageIndex((prev) => 
            prev === 0 ? selectedCourtImages.length - 1 : prev - 1
        );
    };

    const handleModalNextImage = () => {
        setModalImageIndex((prev) => 
            (prev + 1) % selectedCourtImages.length
        );
    };

    // Group courts by courtId and collect all images
    const groupedCourts = turf?.courts?.reduce((acc, court) => {
        if (!acc[court.courtId]) {
            acc[court.courtId] = {
                ...court,
                images: []
            };
        }
        if (court.courtImage) {
            acc[court.courtId].images.push(court.courtImage);
        }
        return acc;
    }, {}) || {};

    const uniqueCourts = Object.values(groupedCourts);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Image Gallery Section */}
            <div className="mb-8 animate-slide-in-left">
                <div 
                    className="relative h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Images with fade transition */}
                    {images.map((img, index) => (
                        <div
                            key={img.imageId}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                                index === selectedImageIndex ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <img
                                src={img.imageUrl}
                                alt={turf.facilityName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    
                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <button
                                onClick={handlePrevImage}
                                className="btn btn-circle"
                            >
                                ❮
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="btn btn-circle"
                            >
                                ❯
                            </button>
                        </div>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h1 className="text-4xl font-bold text-white mb-2">{turf.facilityName}</h1>
                        <div className="flex items-center space-x-2 text-white/90">
                            <MapPin className="w-5 h-5" />
                            <p className="text-lg">{turf.address}, {turf.ward}, {turf.district}, {turf.province}</p>
                        </div>
                    </div>
                </div>

                {/* Image Thumbnails */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                        {images.map((img, index) => (
                            <div
                                key={img.imageId}
                                onClick={() => handleThumbnailClick(index)}
                                className={`cursor-pointer rounded-lg overflow-hidden h-20 ${
                                    selectedImageIndex === index ? 'ring-4 ring-primary' : 'opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={`${turf.facilityName} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rating & Status */}
                    <div className="card bg-base-100 shadow-xl p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-3">
                                <Star className="w-8 h-8 text-warning fill-warning" />
                                <div>
                                    <p className="text-3xl font-bold">
                                        {turf.averageRating ? turf.averageRating.toFixed(1) : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {turf.totalRatings || 0} đánh giá
                                    </p>
                                </div>
                            </div>
                            <div className="badge badge-success badge-lg gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {turf.statusName || 'Active'}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {turf.description && (
                        <div className="card bg-base-100 shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Mô tả</h2>
                            <p className="text-gray-600 leading-relaxed">{turf.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {amenitiesList.length > 0 && (
                        <div className="card bg-base-100 shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Tiện ích</h2>
                            <div className="flex flex-wrap gap-2">
                                {amenitiesList.map((amenity) => (
                                    <div key={amenity.amenityId} className="badge badge-primary badge-lg gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        {amenity.amenityName}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Courts */}
                    {uniqueCourts.length > 0 && (
                        <div className="card bg-base-100 shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Các sân ({uniqueCourts.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                {uniqueCourts.map((court) => (
                                    <div key={court.courtId} className="border border-base-300 rounded-lg overflow-hidden hover:shadow-md transition h-full flex flex-col">
                                        {/* Court Image - Always show */}
                                        <div 
                                            className={`relative h-48 bg-gray-200 flex-shrink-0 ${court.images.length > 0 ? 'cursor-pointer group' : ''}`}
                                            onClick={() => court.images.length > 0 && handleOpenCourtImage(court.images)}
                                        >
                                            <img
                                                src={court.images.length > 0 ? court.images[0].imageUrl : '/banner-1.png'}
                                                alt={court.courtName}
                                                className="w-full h-full object-cover"
                                            />
                                            {court.images.length > 0 && (
                                                <>
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                                                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                                                    </div>
                                                    {/* Image counter badge */}
                                                    {court.images.length > 1 && (
                                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                                            {court.images.length} ảnh
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 flex-grow">
                                            <h3 className="font-bold text-lg mb-2">{court.courtName}</h3>
                                            <div className="space-y-1 text-sm">
                                                <p className="flex items-center gap-2">
                                                    <span className="badge badge-sm">{court.typeName}</span>
                                                    <span className="badge badge-sm badge-outline">{court.surfaceName}</span>
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    {court.isIndoor && (
                                                        <span className="badge badge-sm gap-1">
                                                            <Home className="w-3 h-3" /> Trong nhà
                                                        </span>
                                                    )}
                                                    {court.hasLighting && (
                                                        <span className="badge badge-sm gap-1">
                                                            <Sun className="w-3 h-3" /> Có đèn
                                                        </span>
                                                    )}
                                                </div>
                                                {court.description && (
                                                    <p className="text-gray-500 mt-2">{court.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Operating Hours */}
                    {turf.operatingHours && turf.operatingHours.length > 0 && (
                        <div className="card bg-base-100 shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Calendar className="w-6 h-6" />
                                Giờ hoạt động
                            </h2>
                            <div className="space-y-2">
                                {turf.operatingHours.map((hour, index) => (
                                    <div key={`operating-hour-${hour.dayOfWeek}-${index}`} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                                        <span className="font-medium">{getDayName(hour.dayOfWeek)}</span>
                                        {hour.isClosed ? (
                                            <span className="text-error">Đóng cửa</span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {hour.openTime} - {hour.closeTime}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Right Side */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="card bg-base-100 shadow-xl p-6 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
                        <div className="space-y-4">
                            <InfoItem
                                icon={<Clock />}
                                label="Giờ mở cửa"
                                value={`${turf.openTime} - ${turf.closeTime}`}
                            />
                            {turf.phone && (
                                <InfoItem
                                    icon={<Phone />}
                                    label="Số điện thoại"
                                    value={turf.phone}
                                />
                            )}
                            {turf.email && (
                                <InfoItem
                                    icon={<Mail />}
                                    label="Email"
                                    value={turf.email}
                                />
                            )}
                            <InfoItem
                                icon={<MapPin />}
                                label="Địa chỉ"
                                value={`${turf.address}, ${turf.ward}, ${turf.district}, ${turf.province}`}
                            />
                        </div>

                        <button
                            className="btn btn-primary btn-lg w-full mt-6"
                            onClick={handleReservation}
                        >
                            Đặt sân ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
                <Reviews turfId={id} />
            </div>

            {/* Court Image Modal */}
            {selectedCourtImages.length > 0 && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                    onClick={handleCloseCourtModal}
                >
                    <div className="relative max-w-4xl w-full">
                        {/* Close Button */}
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
                            onClick={handleCloseCourtModal}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Image Container with fixed max dimensions */}
                        <div 
                            className="relative bg-black rounded-lg overflow-hidden max-h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedCourtImages[modalImageIndex].imageUrl}
                                alt="Court"
                                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                            />

                            {/* Navigation Buttons */}
                            {selectedCourtImages.length > 1 && (
                                <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleModalPrevImage();
                                        }}
                                        className="btn btn-circle btn-sm bg-white/80 hover:bg-white"
                                    >
                                        ❮
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleModalNextImage();
                                        }}
                                        className="btn btn-circle btn-sm bg-white/80 hover:bg-white"
                                    >
                                        ❯
                                    </button>
                                </div>
                            )}

                            {/* Image Counter */}
                            {selectedCourtImages.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                    {modalImageIndex + 1} / {selectedCourtImages.length}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {selectedCourtImages[modalImageIndex].description && (
                            <p className="text-white text-center mt-4 text-sm">
                                {selectedCourtImages[modalImageIndex].description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="bg-primary bg-opacity-10 p-3 rounded-full flex-shrink-0">
            {React.cloneElement(icon, { className: "w-5 h-5 text-primary" })}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-base font-medium break-words">{value}</p>
        </div>
    </div>
);

const getDayName = (dayOfWeek) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[dayOfWeek] || dayOfWeek;
};

export default FacilityDetails;
