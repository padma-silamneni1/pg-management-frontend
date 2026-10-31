import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/booking/user/${userId}`);
        if (response.data.success) {
          setBookings(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handlePayment = async (bookingId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await api.post(`/booking/${bookingId}/payment/initiate`);
      if (response.data.success) {
        const transactionId = prompt('Enter transaction ID:');
        if (transactionId) {
          const completeResponse = await api.post(`/booking/${bookingId}/payment/complete?transactionId=${transactionId}`);
          if (completeResponse.data.success) {
            alert('Payment completed successfully!');
            // Refresh bookings
            const bookingsResponse = await api.get(`/booking/user/${userId}`);
            if (bookingsResponse.data.success) {
              setBookings(bookingsResponse.data.data);
            }
          }
        }
      }
    } catch (err) {
      alert('Payment failed');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      REQUESTED: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      APPROVED: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-700', icon: XCircle },
      PAYMENT_PENDING: { color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
      PAYMENT_COMPLETED: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      COMPLETED: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      CANCELLED: { color: 'bg-gray-100 text-gray-700', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.REQUESTED;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>;
  }

  if (!localStorage.getItem('userId')) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Please login to view your bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{booking.pg?.name}</h3>
                  <p className="text-gray-600">{booking.pg?.address}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{booking.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{booking.durationMonths} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-medium">{booking.isMonthlyPayment ? 'Monthly' : 'One-time'}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">₹{booking.totalAmount?.toFixed(0)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="text-xl font-bold text-gray-900">₹{booking.securityDeposit?.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {booking.status === 'APPROVED' && (
                <button
                  onClick={() => handlePayment(booking.id)}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Complete Payment
                </button>
              )}

              {booking.status === 'PAYMENT_PENDING' && (
                <button
                  onClick={() => handlePayment(booking.id)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pay Now
                </button>
              )}

              {booking.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Rejection Reason:</strong> {booking.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
