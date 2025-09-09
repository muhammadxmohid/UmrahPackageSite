import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const initialFormState = {
  title: '',
  description: '',
  price: '',
  durationDays: '',
  itineraryText: '',
  imagesText: '',
};

const PackageManagement = () => {
  const { token } = useContext(AuthContext);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/packages');
      setPackages(response.data);
      setLoading(false);
    } catch {
      setError('Failed to load packages.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleEdit = pkg => {
    setEditingId(pkg._id);
    setForm({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      durationDays: pkg.durationDays.toString(),
      itineraryText: pkg.itinerary.join('\n'),
      imagesText: (pkg.images || []).join('\n'),
    });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await axios.delete(`/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(prev => prev.filter(pkg => pkg._id !== id));
      if (editingId === id) resetForm();
    } catch {
      alert('Failed to delete package.');
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) return 'Valid price is required';
    if (!form.durationDays || isNaN(form.durationDays) || Number(form.durationDays) < 1) return 'Valid duration is required';
    if (!form.itineraryText.trim()) return 'Itinerary is required';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      itinerary: form.itineraryText.split('\n').map(line => line.trim()).filter(line => line),
      images: form.imagesText.split('\n').map(line => line.trim()).filter(line => line),
    };
    try {
      let response;
      if (editingId) {
        response = await axios.put(`/packages/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(prev => prev.map(pkg => (pkg._id === editingId ? response.data : pkg)));
        setSubmitSuccess('Package updated successfully');
      } else {
        response = await axios.post('/packages', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(prev => [response.data, ...prev]);
        setSubmitSuccess('Package created successfully');
      }
      resetForm();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit package');
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mb-6">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-semibold mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="price" className="block font-semibold mb-1">Price (USD)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="durationDays" className="block font-semibold mb-1">Duration (Days)</label>
            <input
              id="durationDays"
              name="durationDays"
              type="number"
              min="1"
              value={form.durationDays}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="itineraryText" className="block font-semibold mb-1">Itinerary (one step per line)</label>
          <textarea
            id="itineraryText"
            name="itineraryText"
            value={form.itineraryText}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="imagesText" className="block font-semibold mb-1">Images URLs (one per line)</label>
          <textarea
            id="imagesText"
            name="imagesText"
            value={form.imagesText}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded p-2"
            placeholder="https://example.com/image1.jpg"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            {editingId ? 'Update Package' : 'Add Package'}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
        {submitError && <p className="text-red-600">{submitError}</p>}
        {submitSuccess && <p className="text-green-600">{submitSuccess}</p>}
      </form>

      <h3 className="text-2xl font-semibold mb-4">Existing Packages</h3>
      {loading ? (
        <p>Loading packages...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {packages.map(pkg => (
            <div key={pkg._id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-indigo-600">{pkg.title}</h4>
                <p>${pkg.price.toFixed(2)} - {pkg.durationDays} days</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageManagement;
