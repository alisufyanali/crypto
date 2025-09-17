import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calculator, AlertCircle } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  symbol: string;
  current_stock: {
    current_price: number;
    change_amount: number;
    change_percentage: number;
    day_high: number;
    day_low: number;
    volume: number;
  } | null;
}

interface Props {
  companies: Company[];
  userBalance: number;
}

export default function CreateOrder({ companies, userBalance }: Props) {
  const [formData, setFormData] = useState({
    company_id: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price_per_share: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (formData.company_id) {
      const company = companies.find(c => c.id.toString() === formData.company_id);
      setSelectedCompany(company || null);
      
      if (company?.current_stock) {
        setFormData(prev => ({
          ...prev,
          price_per_share: company.current_stock!.current_price.toString()
        }));
      }
    }
  }, [formData.company_id, companies]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price_per_share) || 0;
    return quantity * price;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const total = calculateTotal();
    
    // Client-side validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.company_id) {
      newErrors.company_id = 'Please select a company';
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    if (!formData.price_per_share || parseFloat(formData.price_per_share) <= 0) {
      newErrors.price_per_share = 'Please enter a valid price';
    }
    
    if (formData.type === 'buy' && total > userBalance) {
      newErrors.quantity = 'Insufficient balance for this purchase';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setProcessing(false);
      return;
    }

    router.post('/orders', formData, {
      onError: (errors) => {
        setErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  return (
    <>
      <Head title="Place New Order" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center">
                <Link
                  href="/dashboard"
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Place New Order</h1>
                  <p className="text-gray-600">Buy or sell stocks on Rwanda Stock Exchange</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(userBalance)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Order Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'buy' }))}
                        className={`p-4 rounded-lg border-2 text-center transition-colors ${
                          formData.type === 'buy'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-medium">Buy</div>
                        <div className="text-xs text-gray-500">Purchase shares</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'sell' }))}
                        className={`p-4 rounded-lg border-2 text-center transition-colors ${
                          formData.type === 'sell'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-medium">Sell</div>
                        <div className="text-xs text-gray-500">Sell shares</div>
                      </button>
                    </div>
                  </div>

                  {/* Company Selection */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Company
                    </label>
                    <select
                      id="company"
                      value={formData.company_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a company...</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name} ({company.symbol}) - {company.current_stock ? formatCurrency(company.current_stock.current_price) : 'N/A'}
                        </option>
                      ))}
                    </select>
                    {errors.company_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (Shares)
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter number of shares"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Price per Share */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Share (RWF)
                    </label>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      value={formData.price_per_share}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_share: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price per share"
                    />
                    {errors.price_per_share && (
                      <p className="mt-1 text-sm text-red-600">{errors.price_per_share}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={processing}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                        formData.type === 'buy'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {processing ? 'Placing Order...' : `Place ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Order`}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary & Stock Info */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Type:</span>
                    <span className={`font-medium ${formData.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{formData.quantity || '0'} shares</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Share:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(formData.price_per_share) || 0)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  
                  {formData.type === 'buy' && calculateTotal() > userBalance && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-800 font-medium">Insufficient Balance</p>
                        <p className="text-xs text-red-600">
                          You need {formatCurrency(calculateTotal() - userBalance)} more to place this order.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Stock Info */}
              {selectedCompany && selectedCompany.current_stock && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Stock Information</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h3>
                      <p className="text-gray-600">{selectedCompany.symbol}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Price:</span>
                        <span className="font-medium">{formatCurrency(selectedCompany.current_stock.current_price)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Change:</span>
                        <span className={`font-medium ${
                          selectedCompany.current_stock.change_amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(selectedCompany.current_stock.change_amount)} ({formatPercentage(selectedCompany.current_stock.change_percentage)})
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Day High:</span>
                        <span className="font-medium">{formatCurrency(selectedCompany.current_stock.day_high)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Day Low:</span>
                        <span className="font-medium">{formatCurrency(selectedCompany.current_stock.day_low)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume:</span>
                        <span className="font-medium">{selectedCompany.current_stock.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Important Notice</h4>
                    <p className="text-xs text-blue-600 mt-1">
                      All orders require approval from our brokers before execution. You will be notified once your order is processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}