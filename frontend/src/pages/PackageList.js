import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import PackageCard from '../components/PackageCard';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/packages');
        setPackages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load packages.');
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading packages...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Available Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <PackageCard key={pkg._id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackageList;
