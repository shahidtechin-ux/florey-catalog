"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    newEnquiries: 0,
    pendingApps: 0,
    recentApps: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🟢 NAYA: Yahan title set hoga pakke taur par!
    document.title = "Admin Dashboard | Shajjad Electronics";

    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success) {
          setDashboardData({
            totalProducts: data.data.totalProducts || 0,
            totalCategories: data.data.totalCategories || 0,
            newEnquiries: data.data.newEnquiries || 0,
            pendingApps: data.data.pendingApps || 0,
            recentApps: data.data.recentApps || []
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Products", value: dashboardData.totalProducts, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Categories", value: dashboardData.totalCategories, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "text-purple-600", bg: "bg-purple-100" },
    { title: "New Enquiries", value: dashboardData.newEnquiries, icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", color: "text-green-600", bg: "bg-green-100" },
    { title: "Pending Applications", value: dashboardData.pendingApps, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your products, enquiries and website.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 ${stat.bg} ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
              <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 sm:mt-1">
                {isLoading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  stat.value
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Applications</h2>
          <Link href="/admin/distributors" className="text-red-600 text-xs sm:text-sm font-bold hover:text-red-700">View All &rarr;</Link>
        </div>
        
        {isLoading ? (
           <div className="py-20 flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           </div>
        ) : dashboardData.recentApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-4 font-semibold">Applicant</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold">Business</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold">Date</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboardData.recentApps.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{app.fullName}</p>
                      <p className="text-xs text-gray-500">{app.applicationId || 'New App'}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{app.companyName}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs sm:text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                        app.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status === 'Pending' ? 'NEW' : app.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <Link href="/admin/distributors" className="text-red-600 font-bold text-xs sm:text-sm hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-gray-100">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-sm">
              When customers or partners apply for distributorship, their applications will securely appear right here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}