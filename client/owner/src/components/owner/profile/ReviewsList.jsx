import React from 'react';
import { Star, User, Building2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ReviewsList = ({ reviews }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-warning' : 'text-base-content/20'}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'duyệt') return 'badge-success';
    if (statusLower === 'pending' || statusLower === 'chờ duyệt') return 'badge-warning';
    if (statusLower === 'rejected' || statusLower === 'từ chối') return 'badge-error';
    return 'badge-ghost';
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center py-12">
            <Star size={64} className="mx-auto mb-4 text-base-content/20" />
            <h3 className="text-xl font-semibold mb-2">Chưa có đánh giá nào</h3>
            <p className="text-base-content/60">Chưa có khách hàng nào đánh giá cơ sở của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Đánh giá từ khách hàng ({reviews.length})</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <div key={review.reviewId} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Avatar */}
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <User size={24} />
                    </div>
                  </div>

                  {/* Review Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{review.customerName}</h3>
                      {renderStars(review.rating)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                      <Building2 size={14} />
                      <span>{review.facilityName}</span>
                      <span>•</span>
                      <Calendar size={14} />
                      <span>{format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                    </div>

                    {review.comment && (
                      <p className="text-base-content/80 mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`badge ${getStatusBadge(review.status)}`}>
                  {review.status}
                </div>
              </div>

              {/* Rating Bar */}
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all"
                    style={{ width: `${(review.rating / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-warning min-w-[3rem] text-right">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">📊 Thống kê đánh giá</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-warning" fill="currentColor" />
                    <span className="text-sm font-semibold">{star} sao</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-base-content/60">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
