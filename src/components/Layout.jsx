import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, User, LayoutDashboard } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PG Management</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              
              <Link
                to="/owner/register"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith('/owner') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Owner
              </Link>
              
              <Link
                to="/customer/browse"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith('/customer') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4 mr-1" />
                Customer
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
