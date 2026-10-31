import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Building2, MapPin, Bed, DollarSign, Phone, Mail, ArrowLeft, Calendar } from 'lucide-react';

export default function CustomerPgDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    durationMonths: 1,
    isMonthlyPayment: false,
    roomId: null,
    bedId: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pgResponse = await api.get(`/pg/${id}`);
        if (pgResponse.data.success) {
          setPg(pgResponse.data.data);
          
          const roomsResponse = await api.get(`/pg/${id}/rooms/available`);
          if (roomsResponse.data.success) {
            setRooms(roomsResponse.data.data);
          }
          
          const bedsResponse = await api.get(`/pg/${id}/beds/available`);
          if (bedsResponse.data.success) {
            setAvailableBeds(bedsResponse.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load PG details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to book a bed');
      return;
    }

    try {
      const response = await api.post('/booking/request', {
        pgId: pg.id,
        roomId: bookingForm.roomId,
        bedId: bookingForm.bedId,
        startDate: bookingForm.startDate,
        durationMonths: bookingForm.durationMonths,
        isMonthlyPayment: bookingForm.isMonthlyPayment
      });

      if (response.data.success) {
        alert('Booking request submitted successfully!');
        setShowBookingModal(false);
        navigate('/customer/bookings');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert('Failed to submit booking request');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!pg) {
    return <div className="text-center py-12">PG not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/customer/browse')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pg.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{pg.address}, {pg.city}, {pg.state} - {pg.pincode}</span>
            </div>
          </div>
          {pg.availableBeds > 0 ? (
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              No Beds Available
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Rooms</p>
                <p className="text-xl font-bold">{pg.totalRooms}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <Bed className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Available Beds</p>
                <p className="text-xl font-bold">{pg.availableBeds}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Rent Per Bed</p>
                <p className="text-xl font-bold">₹{pg.rentPerBed}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Floors</p>
                <p className="text-xl font-bold">{pg.numberOfFloors}</p>
              </div>
            </div>
          </div>
        </div>

        {pg.amenities && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Amenities</h2>
            <p className="text-gray-600">{pg.amenities}</p>
          </div>
        )}

        {pg.description && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{pg.description}</p>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Owner Contact</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{pg.ownerEmail}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{pg.ownerPhone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Rooms</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-600">No rooms available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-4">
                <h3 className="font-bold text-gray-900">{room.roomNumber}</h3>
                <p className="text-sm text-gray-600">Floor: {room.floorNumber}</p>
                <p className="text-sm text-gray-600">Type: {room.roomType}</p>
                <p className="text-sm text-gray-600">Available: {room.availableBeds}/{room.capacity}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Book a Bed</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bookingForm.durationMonths}
                  onChange={(e) => setBookingForm({ ...bookingForm, durationMonths: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="monthlyPayment"
                  checked={bookingForm.isMonthlyPayment}
                  onChange={(e) => setBookingForm({ ...bookingForm, isMonthlyPayment: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="monthlyPayment" className="text-sm text-gray-700">
                  Pay monthly (for long-term stays)
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
