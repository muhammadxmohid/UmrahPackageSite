import React, { useState } from 'react';
import PackageManagement from './admin/PackageManagement';
import InquiryManagement from './admin/InquiryManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('packages');

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Admin Panel</h2>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'packages'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('packages')}
          >
            Package Management
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inquiries'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('inquiries')}
          >
            Inquiry Management
          </button>
        </nav>
      </div>
      {activeTab === 'packages' && <PackageManagement />}
      {activeTab === 'inquiries' && <InquiryManagement />}
    </div>
  );
};

export default AdminPanel;
