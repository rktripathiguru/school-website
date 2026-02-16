"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, individual, bulk
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admissions/list");
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAdmissions(data.admissions || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error("Failed to fetch admissions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmissions = admissions.filter(admission => {
    const matchesFilter = filter === "all" || 
      (filter === "individual" && admission.data_source === 'form') ||
      (filter === "bulk" && admission.data_source === 'excel');
    
    const matchesSearch = searchTerm === "" || 
      admission.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.application_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.student_class?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceBadge = (data_source, source_label) => {
    if (data_source === 'excel') {
      return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{source_label || 'Excel Upload'}</span>;
    } else if (data_source === 'form') {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{source_label || 'Individual Form'}</span>;
    }
    return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{source_label || 'Unknown'}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admissions data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Admissions</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAdmissions}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admission Applications</h1>
          <p className="text-gray-600">View and manage all student admission applications</p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => router.push("/admin")}
                className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/admin/gallery")}
                className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Gallery
              </button>
              <button
                className="py-2 px-4 border-b-2 border-blue-500 text-blue-600"
              >
                Admissions
              </button>
              <button
                onClick={() => router.push("/admin/bulk-admissions")}
                className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Bulk Upload
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, application ID, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Source</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="individual">Individual Forms</option>
                <option value="bulk">Excel Uploads</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.form_submissions || 0}
            </div>
            <div className="text-sm text-gray-600">Individual Forms</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {stats.excel_uploads || 0}
            </div>
            <div className="text-sm text-gray-600">Excel Uploads</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending || 0}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Applications ({filteredAdmissions.length})
            </h2>
          </div>
          
          {filteredAdmissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || filter !== "all" 
                  ? "No applications match your search criteria."
                  : "No admission applications found."}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmissions.map((admission) => (
                    <tr key={admission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {admission.application_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admission.student_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admission.student_class || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSourceBadge(admission.data_source, admission.source_label)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(admission.status)}`}>
                          {admission.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admission.created_at ? new Date(admission.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
