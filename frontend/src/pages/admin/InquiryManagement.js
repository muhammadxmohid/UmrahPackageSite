import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const InquiryManagement = () => {
  const { token } = useContext(AuthContext);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 10;

  const fetchInquiries = async () => {
    try {
      const response = await axios.get('/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data);
      setLoading(false);
    } catch {
      setError('Failed to load inquiries.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axios.delete(`/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(prev => prev.filter(inq => inq._id !== id));
    } catch {
      alert('Failed to delete inquiry.');
    }
  };

  // Pagination calculations
  const lastIndex = currentPage * inquiriesPerPage;
  const firstIndex = lastIndex - inquiriesPerPage;
  const currentInquiries = inquiries.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(inquiries.length / inquiriesPerPage);

  const changePage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Inquiries</h3>
      {loading ? (
        <p>Loading inquiries...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Phone</th>
                  <th className="border px-3 py-2 text-left">Message</th>
                  <th className="border px-3 py-2 text-left">Package</th>
                  <th className="border px-3 py-2 text-left">Date</th>
                  <th className="border px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInquiries.map(inq => (
                  <tr key={inq._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{inq.name}</td>
                    <td className="border px-3 py-2">{inq.email}</td>
                    <td className="border px-3 py-2">{inq.phone}</td>
                    <td className="border px-3 py-2 max-w-xs break-words">{inq.message}</td>
                    <td className="border px-3 py-2">{inq.packageId?.title || 'N/A'}</td>
                    <td className="border px-3 py-2">{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changePage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1 ? 'bg-indigo-600 text-white' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InquiryManagement;
