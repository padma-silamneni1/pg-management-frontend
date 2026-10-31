import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Building2, Bed, Plus, X } from 'lucide-react';

export default function OwnerRooms() {
  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    floorNumber: 1,
    roomNumber: '',
    capacity: 1,
    roomType: 'SHARING',
    amenities: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const ownerEmail = localStorage.getItem('ownerEmail');
      if (!ownerEmail) return;

      try {
        const pgResponse = await api.get(`/pg/owner/${ownerEmail}`);
        if (pgResponse.data.success) {
          setPg(pgResponse.data.data);
          
          const roomsResponse = await api.get(`/pg/${pgResponse.data.data.id}/rooms`);
          if (roomsResponse.data.success) {
            setRooms(roomsResponse.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/pg/${pg.id}/rooms`, newRoom);
      if (response.data.success) {
        setRooms([...rooms, response.data.data]);
        setShowAddRoom(false);
        setNewRoom({
          floorNumber: 1,
          roomNumber: '',
          capacity: 1,
          roomType: 'SHARING',
          amenities: ''
        });
      }
    } catch (err) {
      console.error('Failed to add room');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!pg) {
    return <div className="text-center py-12">Please register your PG first</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
        <button
          onClick={() => setShowAddRoom(!showAddRoom)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      {showAddRoom && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add New Room</h2>
            <button onClick={() => setShowAddRoom(false)}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleAddRoom} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor Number</label>
              <input
                type="number"
                min="1"
                value={newRoom.floorNumber}
                onChange={(e) => setNewRoom({ ...newRoom, floorNumber: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
              <input
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., R1-101"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (Beds)</label>
              <input
                type="number"
                min="1"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="SHARING">Sharing</option>
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="TRIPLE">Triple</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <input
                type="text"
                value={newRoom.amenities}
                onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="WiFi, AC, etc."
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold">{room.roomNumber}</h3>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${room.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {room.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Floor:</span>
                <span className="font-medium">{room.floorNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{room.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{room.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupied:</span>
                <span className="font-medium">{room.occupiedBeds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">{room.availableBeds}</span>
              </div>
            </div>

            {room.amenities && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600">Amenities: {room.amenities}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No rooms added yet</p>
        </div>
      )}
    </div>
  );
}
