import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Shield, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PG Management System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A comprehensive platform for PG owners to manage their properties and for customers to find and book accommodation.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">For PG Owners</h2>
          </div>
          <ul className="space-y-3 text-gray-600 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Register your PG with complete details
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Manage rooms and beds
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Track tenant information
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Monitor payment history
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              View statistics and overdue payments
            </li>
          </ul>
          <Link
            to="/owner/register"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register Your PG
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">For Customers</h2>
          </div>
          <ul className="space-y-3 text-gray-600 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Browse PGs by location
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              View detailed PG information
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Check available beds
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Request booking online
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Choose monthly payment option
            </li>
          </ul>
          <Link
            to="/customer/browse"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Find a PG
          </Link>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold">Easy Payment Flow</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">1</div>
            <div>Request Booking</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">2</div>
            <div>Owner Approval</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">3</div>
            <div>Make Payment</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">4</div>
            <div>Booking Confirmed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
