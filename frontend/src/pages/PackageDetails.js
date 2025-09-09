import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`/packages/${id}`);
        setPkg(response.data);
        setLoading(false);
      } catch {
        setError('Package not found');
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading package details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!pkg) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>{pkg.title} - Umrah & Hajj Packages</title>
        <meta name="description" content={pkg.description} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">{pkg.title}</h1>
      {pkg.images && pkg.images.length > 0 && (
        <div className="mb-6 overflow-x-auto whitespace-nowrap">
          {pkg.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${pkg.title} image ${idx + 1}`}
              className="inline-block h-64 w-auto rounded mr-4"
              loading="lazy"
            />
          ))}
        </div>
      )}
      <p className="mb-4 text-gray-700">{pkg.description}</p>
      <p className="mb-2 font-semibold">Price: ${pkg.price.toFixed(2)}</p>
      <p className="mb-2 font-semibold">Duration: {pkg.durationDays} days</p>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Itinerary:</h3>
        <ul className="list-disc list-inside">
          {pkg.itinerary.map((item, index) => (
            <li key={index} className="mb-1">{item}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => navigate('/inquiry', { state: { packageId: pkg._id, packageTitle: pkg.title } })}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
      >
        Inquire About This Package
      </button>
    </div>
  );
};

export default PackageDetails;
