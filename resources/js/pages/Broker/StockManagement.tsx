// Stock Management Component - resources/js/pages/Broker/StockManagement.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  Edit, 
  Plus,
  RefreshCw,
  Calendar,
  Activity,
  Building,
  AlertCircle
} from 'lucide-react';

interface Company {
  id: number;
  name: string;
  symbol: string;
  sector: string;
  market_cap: number;
  shares_outstanding: number;
  is_active: boolean;
  current_stock: {
    current_price: number;
    previous_close: number;
    day_high: number;
    day_low: number;
    volume: number;
    change_amount: number;
    change_percentage: number;
    last_updated: string;
  } | null;
}

interface Props {
  companies: Company[];
  totalMarketCap: number;
  totalVolume: number;
  activeCompanies: number;
}

export default function StockManagement({ companies, totalMarketCap, totalVolume, activeCompanies }: Props) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [priceUpdateModal, setPriceUpdateModal] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [volume, setVolume] = useState('');
  const [updating, setUpdating] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-RW').format(num);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const handlePriceUpdate = (companyId: number) => {
    if (!newPrice || parseFloat(newPrice) <= 0) return;
    
    setUpdating(true);
    router.post(`/broker/companies/${companyId}/update-price`, {
      price: parseFloat(newPrice),
      volume: volume ? parseInt(volume) : 0,
    }, {
      onSuccess: () => {
        setPriceUpdateModal(null);
        setNewPrice('');
        setVolume('');
        setUpdating(false);
      },
      onError: () => {
        setUpdating(false);
      },
    });
  };

  const openPriceModal = (company: Company) => {
    setPriceUpdateModal(company.id);
    setNewPrice(company.current_stock?.current_price.toString() || '');
    setVolume('');
  };

  return (
    <>
      <Head title="Stock Management" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
                <p className="text-gray-600">Manage stock prices and company information</p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => router.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Prices
                </button>
                <Link
                  href="/broker/companies/create"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCompanies}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Market Cap</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMarketCap)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(totalVolume)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Listed Stocks</p>
                  <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Listed Companies</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Cap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company) => {
                    const stock = company.current_stock;
                    const marketCap = stock ? stock.current_price * company.shares_outstanding : company.market_cap;
                    
                    return (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Building className="h-5 w-5 text-gray-500" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{company.name}</div>
                              <div className="text-sm text-gray-500">{company.symbol} • {company.sector}</div>
                              <div className={`text-xs ${company.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                {company.is_active ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {stock ? formatCurrency(stock.current_price) : 'N/A'}
                          </div>
                          {stock && (
                            <div className="text-xs text-gray-500">
                              Prev: {formatCurrency(stock.previous_close)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          {stock ? (
                            <div className={`flex items-center ${stock.change_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change_amount >= 0 ? 
                                <TrendingUp className="w-4 h-4 mr-1" /> : 
                                <TrendingDown className="w-4 h-4 mr-1" />
                              }
                              <div>
                                <div className="text-sm font-medium">
                                  {formatCurrency(Math.abs(stock.change_amount))}
                                </div>
                                <div className="text-xs">
                                  {formatPercentage(stock.change_percentage)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {stock ? formatNumber(stock.volume) : 'N/A'}
                          </div>
                          {stock && stock.day_high !== stock.day_low && (
                            <div className="text-xs text-gray-500">
                              H: {formatCurrency(stock.day_high)} L: {formatCurrency(stock.day_low)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(marketCap)}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock ? (
                            <div>
                              <div>{new Date(stock.last_updated).toLocaleDateString('en-RW')}</div>
                              <div className="text-xs">{new Date(stock.last_updated).toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          ) : 'Never'}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openPriceModal(company)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Update Price"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/broker/companies/${company.id}/edit`}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="Edit Company"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/broker/companies/${company.id}`}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="View Details"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {companies.length === 0 && (
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No companies listed</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first company.</p>
                  <div className="mt-6">
                    <Link
                      href="/broker/companies/create"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Company
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Update Modal */}
      {priceUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Stock Price</h3>
                <button
                  onClick={() => setPriceUpdateModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {(() => {
                const company = companies.find(c => c.id === priceUpdateModal);
                return company && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-500">{company.symbol}</div>
                    {company.current_stock && (
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {formatCurrency(company.current_stock.current_price)}
                      </div>
                    )}
                  </div>
                );
              })()}
              
              <div className="mb-4">
                <label htmlFor="new-price" className="block text-sm font-medium text-gray-700 mb-2">
                  New Price (RWF)
                </label>
                <input
                  type="number"
                  id="new-price"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new price"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                  Volume (Optional)
                </label>
                <input
                  type="number"
                  id="volume"
                  min="0"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Trading volume"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Price Update Notice</h4>
                    <p className="text-xs text-yellow-600 mt-1">
                      This will update the stock price for all clients and recalculate portfolio values.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPriceUpdateModal(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePriceUpdate(priceUpdateModal)}
                  disabled={!newPrice || parseFloat(newPrice) <= 0 || updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Price'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}