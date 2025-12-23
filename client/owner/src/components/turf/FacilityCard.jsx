import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FacilityCard = ({ turf }) => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  return (
      <div className="card bg-base-100 shadow-xl animate-bounce-fade-in">
        <figure>
          <img
              src={turf.mainImageUrl}
              alt={turf.facilityName}
              className="w-full h-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{turf.facilityName}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
              {(turf.SportTypes || []).map((sport, index) => (
                <span key={sport} className="badge badge-outline">
              {sport}
            </span>
            ))}
          </div>
          <p className="mt-2">
            Open: {turf.openTime} - {turf.closeTime}
          </p>
          <div className="card-actions justify-end mt-4">
            <Link
                to={isLoggedIn ? `/customer/turf/${turf.facilityId}` : `/login`}
                className="btn btn-primary"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>
  );
};

export default FacilityCard;
