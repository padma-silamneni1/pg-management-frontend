import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Building2, MapPin, Bed, DollarSign, Search } from 'lucide-react';

export default function CustomerBrowse() {
  const [pgs, setPgs] = useState([]);
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const response = await api.get('/pg/search?location=');
        if (response.data.success) {
          setPgs(response.data.data);
          setFilteredPgs(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load PGs');
      } finally {
        setLoading(false);
      }
    };

    fetchPgs();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredPgs(pgs);
      return;
    }

    try {
      const response = await api.get(`/pg/search?location=${searchTerm}`);
      if (response.data.success) {
        setFilteredPgs(response.data.data);
      }
    } catch (err) {
      console.error('Search failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading PGs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Find Your PG</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, state, or pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {filteredPgs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No PGs found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPgs.map((pg) => (
            <div key={pg.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pg.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pg.city}, {pg.state}</span>
                    </div>
                  </div>
                  {pg.availableBeds > 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {pg.availableBeds} beds
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Full
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{pg.totalRooms} rooms, {pg.totalBeds} beds</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bed className="h-4 w-4 mr-2" />
                    <span>{pg.numberOfFloors} floors</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="font-medium text-lg">₹{pg.rentPerBed}/month</span>
                  </div>
                </div>

                {pg.amenities && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                    <p className="text-sm text-gray-700">{pg.amenities}</p>
                  </div>
                )}

                {pg.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {pg.description}
                  </p>
                )}

                <Link
                  to={`/customer/pg/${pg.id}`}
                  className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
