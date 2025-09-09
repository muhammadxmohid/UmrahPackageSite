import React from 'react';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/packages/${pkg._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
    >
      {pkg.images && pkg.images.length > 0 && (
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-indigo-600">{pkg.title}</h3>
        <p className="mt-2 text-gray-700">${pkg.price.toFixed(2)}</p>
        <p className="mt-1 text-gray-500">{pkg.durationDays} days</p>
      </div>
    </div>
  );
};

export default PackageCard;
