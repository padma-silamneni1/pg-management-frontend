import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Building2, Users, Bed, DollarSign, AlertCircle } from 'lucide-react';

export default function OwnerDashboard() {
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPg = async () => {
      const ownerEmail = localStorage.getItem('ownerEmail');
      if (!ownerEmail) {
        setError('Please register your PG first');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/pg/owner/${ownerEmail}`);
        if (response.data.success) {
          setPg(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to load PG details');
      } finally {
        setLoading(false);
      }
    };

    fetchPg();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          to="/owner/register"
          className="text-blue-600 hover:underline"
        >
          Register your PG
        </Link>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No PG found</p>
        <Link
          to="/owner/register"
          className="text-blue-600 hover:underline"
        >
          Register your PG
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        <span className="text-sm text-gray-500">{pg.name}</span>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{pg.totalRooms}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold text-gray-900">{pg.totalBeds}</p>
            </div>
            <Bed className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Beds</p>
              <p className="text-2xl font-bold text-gray-900">{pg.availableBeds}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rent Per Bed</p>
              <p className="text-2xl font-bold text-gray-900">₹{pg.rentPerBed}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">PG Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">{pg.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">City</p>
            <p className="font-medium">{pg.city}, {pg.state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pincode</p>
            <p className="font-medium">{pg.pincode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Floors</p>
            <p className="font-medium">{pg.numberOfFloors}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Amenities</p>
            <p className="font-medium">{pg.amenities || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/owner/rooms"
          className="bg-blue-600 text-white rounded-lg shadow p-6 hover:bg-blue-700 transition"
        >
          <div className="flex items-center">
            <Building2 className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">Manage Rooms</p>
              <p className="text-sm text-blue-100">View and manage your rooms</p>
            </div>
          </div>
        </Link>

        <Link
          to="/owner/statistics"
          className="bg-green-600 text-white rounded-lg shadow p-6 hover:bg-green-700 transition"
        >
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">Statistics</p>
              <p className="text-sm text-green-100">View payment statistics</p>
            </div>
          </div>
        </Link>

        <div className="bg-purple-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">Pending Bookings</p>
              <p className="text-sm text-purple-100">Check booking requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
