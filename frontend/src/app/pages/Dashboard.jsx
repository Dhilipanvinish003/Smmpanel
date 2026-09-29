import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Activity,
  IndianRupee,
  User
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";



const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:5001/api"
  : "https://admin.tikytop.com/api";


export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentorder, setRecentorder] = useState([]);

  const navigate = useNavigate();


  // order Data;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/dashboard`);
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    }
    fetchStats();
  }, []);



  //orders Tables data;
  useEffect(() => {
    const fetchorders = async () => {
      try {
        const response = await fetch(`${API_BASE}/orders`);
        const data = await response.json();

        const formatedata = data.map((o) => ({
          id: o.order_id,
          user: o.username ? o.username : "Customer",
          service: o.service?.name || `${o.platform} Service`,
          charge: o.amount ?? o.usd_amount ?? 0,
          status: o.status
        }));

        setRecentorder(formatedata);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchorders();
  }, []);



  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Activity size={16} /> System Healthy
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value={`₹${stats?.kpi?.total?.toLocaleString("en-IN") || 0}`}
          change="+12.5%"
          icon={<IndianRupee className="text-white" size={24} />}
          color="bg-blue-600"
        />

        <KpiCard
          title="Net Profit"
          value={`₹${stats?.kpi?.profit?.toLocaleString("en-IN") || 0}`}
          change="+8.2%"
          icon={<TrendingUp className="text-white" size={24} />}
          color="bg-green-600"
        />

        <KpiCard
          title="Total Orders"
          value={stats?.kpi.orders.toLocaleString() || 0}
          change="+23.1%"
          icon={<ShoppingCart className="text-white" size={24} />}
          color="bg-purple-600"
        />

        <KpiCard
          title="Active Users"
          value={stats?.kpi.users.toLocaleString()}
          change="+4.5%"
          icon={<Users className="text-white" size={24} />}
          color="bg-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Revenue & Profit Trends
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chart_data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Orders by Status
          </h3>
          <div className="space-y-4">
            <OrderStatusRow
              label="Completed"
              count={845}
              total={1294}
              color="bg-green-500"
            />
            <OrderStatusRow
              label="Processing"
              count={234}
              total={1294}
              color="bg-blue-500"
            />
            <OrderStatusRow
              label="Pending"
              count={120}
              total={1294}
              color="bg-yellow-500"
            />
            <OrderStatusRow
              label="Partial"
              count={45}
              total={1294}
              color="bg-purple-500"
            />
            <OrderStatusRow
              label="Failed"
              count={50}
              total={1294}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Supplier & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Orders
            </h3>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {
                  recentorder.slice(0, 5).map((order) =>
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        #ORD1000{order.id}
                      </td>
                      <td className="px-4 py-3">{order.user}</td>
                      <td className="px-4 py-3">{order.service}</td>
                      <td className="px-4 py-3">${order.charge}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {order.status}
                        </span>
                      </td>
                    </tr>

                  )}

              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Supplier Balance
          </h3>
          <div className="space-y-4">
            <SupplierBalanceRow name="SMM King" balance={450.2} status="Good" />
            <SupplierBalanceRow
              name="JustAnotherPanel"
              balance={12.5}
              status="Low"
            />
            <SupplierBalanceRow
              name="Global SMM"
              balance={890.0}
              status="Good"
            />
            <div className="pt-4 border-t border-slate-100">
              <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                Manage Suppliers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
        <p
          className={`text-xs font-medium ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
        >
          {change} from last month
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color} shadow-lg shadow-blue-500/20`}>
        {icon}
      </div>
    </div>
  );
}

function OrderStatusRow({ label, count, total, color }) {
  const percentage = (count / total) * 100;
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-slate-600">{label}</div>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
      <div className="w-12 text-sm text-slate-500 text-right">{count}</div>
    </div>
  );
}

function SupplierBalanceRow({ name, balance, status }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div>
        <div className="text-sm font-medium text-slate-900">{name}</div>
        <div className="text-xs text-slate-500">
          Balance: ${balance.toFixed(2)}
        </div>
      </div>
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${status === "Good" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
      >
        {status}
      </span>
    </div>
  );
}
