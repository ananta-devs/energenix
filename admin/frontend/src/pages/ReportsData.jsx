// components/DataDisplay/ReportsData.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, Users, Package, IndianRupee, PieChart, } from 'lucide-react';
import { dataService } from '../utils/dataService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import SalesChart from '../components/Charts/SalesChart'; // Import SalesChart
import GemstonePieChart from '../components/Charts/GemstonePieChart'; // Import GemstonePieChart

const ReportsData = () => {
  const [reports, setReports] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [activeReport, setActiveReport] = useState('sales');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      const [reportsData, analyticsData] = await Promise.all([
        dataService.getReports(),
        dataService.getAnalytics()
      ]);
      setReports(reportsData);
      setAnalytics(analyticsData);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load reports data.'); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    let data = [];
    let filename = '';
    let columns = [];

    switch (activeReport) {
      case 'sales':
        data = analytics.monthlySales || [];
        filename = 'sales_report';
        columns = [
          { key: 'month', label: 'Month' },
          { key: 'sales', label: 'Sales (₹)' },
          { key: 'orders', label: 'Orders' },
          { key: 'customers', label: 'Customers' }
        ];
        break;
      case 'inventory':
        // You would need to fetch inventory data here
        data = [];
        filename = 'inventory_report';
        break;
      case 'customers':
        // You would need to fetch customers data here
        data = [];
        filename = 'customers_report';
        break;
      default:
        return;
    }

    if (type === 'csv') {
      exportToCSV(data, filename);
    } else if (type === 'pdf') {
      exportToPDF(data, filename, columns);
    }
  };

  const reportCards = [
    {
      id: 'sales',
      title: 'Sales Summary',
      value: `₹${reports.salesSummary?.totalRevenue?.toLocaleString() || '0'}`,
      change: reports.salesSummary?.monthOverMonthGrowth || 0,
      description: 'Total revenue and growth metrics',
      icon: IndianRupee,
      color: 'bg-green-500'
    },
    {
      id: 'customers',
      title: 'Customer Insights',
      value: reports.customerInsights?.totalCustomers?.toLocaleString() || '0',
      change: ((reports.customerInsights?.repeatCustomers || 0) / (reports.customerInsights?.totalCustomers || 1)) * 100,
      description: 'Customer acquisition and retention',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  if (loading && !error) { // Only show global loading if no error
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Display a general error message if data loading failed
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-red-500">
        <h3 className="text-lg font-semibold mb-4">Error</h3>
        <p>{error}</p>
        <button
          onClick={loadReportsData}
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare data for GemstonePieChart
  const formattedCategoryRevenue = analytics.categoryRevenue?.map(item => ({
    category: item.category,
    revenue: item.revenue,
    color: item.color,
  })) || [];


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Reports & Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => exportReport('csv')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {reportCards.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeReport === report.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {report.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reportCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          
          return (
            <div 
              key={card.id}
              className={`bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-200 ${
                activeReport === card.id ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveReport(card.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                    {card.value}
                  </p>
                  <div className={`flex items-center mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp size={14} className={isPositive ? '' : 'rotate-180'} />
                    <span className="text-sm font-medium ml-1">
                      {isPositive ? '+' : ''}{card.change.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color} ml-3 shrink-0`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Report Content */}
      <div className="space-y-6">
        {activeReport === 'sales' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{reports.salesSummary?.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {reports.salesSummary?.totalOrders || '0'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{reports.salesSummary?.averageOrderValue || '0'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {reports.salesSummary?.conversionRate || '0'}%
                </p>
              </div>
            </div>
            {/* Sales Chart Integration */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SalesChart data={analytics.monthlySales} loading={loading} error={error} />
              <GemstonePieChart data={formattedCategoryRevenue} loading={loading} error={error} />
            </div>
          </div>
        )}

        {activeReport === 'customers' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Analytics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {reports.customerInsights?.totalCustomers || '0'}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">New Customers</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {reports.customerInsights?.newCustomers || '0'}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Repeat Customers</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                  {reports.customerInsights?.repeatCustomers || '0'}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Retention Rate</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {reports.customerInsights?.customerRetentionRate || '0'}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Sales Table */}
      {activeReport === 'sales' && analytics.monthlySales && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Sales Data</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Month</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Sales</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Customers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.monthlySales.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{month.month}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{month.sales.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {month.orders}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {month.customers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsData;