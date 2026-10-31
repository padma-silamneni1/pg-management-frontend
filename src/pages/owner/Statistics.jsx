import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { DollarSign, Users, AlertTriangle, Calendar } from 'lucide-react';

export default function OwnerStatistics() {
  const [pg, setPg] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const ownerEmail = localStorage.getItem('ownerEmail');
      if (!ownerEmail) return;

      try {
        const pgResponse = await api.get(`/pg/owner/${ownerEmail}`);
        if (pgResponse.data.success) {
          setPg(pgResponse.data.data);
          
          const statsResponse = await api.get(`/statistics/pg/${pgResponse.data.data.id}`);
          if (statsResponse.data.success) {
            setStats(statsResponse.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!pg || !stats) {
    return <div className="text-center py-12">Please register your PG first</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Statistics & Payments</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalMonthlyRevenue?.toFixed(0) || 0}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">₹{stats.pendingPayments?.toFixed(0) || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Payments</p>
              <p className="text-2xl font-bold text-red-600">₹{stats.overduePayments?.toFixed(0) || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Occupancy Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Occupied Rooms</span>
                <span className="font-medium">{stats.occupiedRooms} / {stats.totalRooms}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(stats.occupiedRooms / stats.totalRooms) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Occupied Beds</span>
                <span className="font-medium">{stats.occupiedBeds} / {stats.totalBeds}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(stats.occupiedBeds / stats.totalBeds) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Room Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.occupiedRooms}</p>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">{stats.availableRooms}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </div>
      </div>

      {stats.overdueTenants && stats.overdueTenants.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Overdue Payments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Tenant</th>
                  <th className="text-left py-3 px-4">Room/Bed</th>
                  <th className="text-left py-3 px-4">Pending Amount</th>
                  <th className="text-left py-3 px-4">Overdue Days</th>
                  <th className="text-left py-3 px-4">Phone</th>
                </tr>
              </thead>
              <tbody>
                {stats.overdueTenants.map((tenant, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{tenant.tenantName}</td>
                    <td className="py-3 px-4">
                      {tenant.roomNumber} / {tenant.bedNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-red-600">
                      ₹{tenant.pendingAmount?.toFixed(0)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                        {tenant.overdueDays} days
                      </span>
                    </td>
                    <td className="py-3 px-4">{tenant.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.overdueTenants && stats.overdueTenants.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700">No overdue payments! All tenants are up to date.</p>
        </div>
      )}
    </div>
  );
}
