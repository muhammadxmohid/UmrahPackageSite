import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useLocation } from 'react-router-dom';

const InquiryForm = () => {
  const location = useLocation();
  const preselectedPackageId = location.state?.packageId || '';
  const preselectedPackageTitle = location.state?.packageTitle || '';

  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    packageId: preselectedPackageId,
  });
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/packages');
        setPackages(response.data);
        setLoadingPackages(false);
      } catch {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!validateEmail(formData.email)) return 'Invalid email address';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.message.trim()) return 'Message is required';
    if (!formData.packageId) return 'Please select a package';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setSubmitStatus({ success: false, message: error });
      return;
    }
    try {
      await axios.post('/inquiries', formData);
      setSubmitStatus({ success: true, message: 'Inquiry submitted successfully' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        packageId: '',
      });
    } catch {
      setSubmitStatus({ success: false, message: 'Failed to submit inquiry' });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Inquiry Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="packageId" className="block font-semibold mb-1">Package</label>
          {loadingPackages ? (
            <p>Loading packages...</p>
          ) : (
            <select
              id="packageId"
              name="packageId"
              value={formData.packageId}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="" disabled>Select a package</option>
              {preselectedPackageId && (
                <option value={preselectedPackageId}>{preselectedPackageTitle}</option>
              )}
              {packages
                .filter(pkg => pkg._id !== preselectedPackageId)
                .map(pkg => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.title}
                  </option>
                ))
              }
            </select>
          )}
        </div>
        <div>
          <label htmlFor="message" className="block font-semibold mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Submit Inquiry
        </button>
      </form>
      {submitStatus.message && (
        <p
          className={`mt-4 ${
            submitStatus.success ? 'text-green-600' : 'text-red-600'
          }`}
          role="alert"
        >
          {submitStatus.message}
        </p>
      )}
    </div>
  );
};

export default InquiryForm;
