import React, { useState, useEffect } from "react";
import { Search, MoreVertical, Filter, ArrowUpRight, IndianRupee, CreditCard, Wallet, Download, Calendar, } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select";
import axios from "axios";

export function Finance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [financeData, setFinanceData] = useState({
    totalRevenue: 0,
    netProfit: 0,
    userBalances: 0,
    pendingDeposits: 0,
  });

  const [transactions, setTransactions] = useState([]);


  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      txn.user
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "All" ||
      txn.type === typeFilter;
    return (
      matchesSearch &&
      matchesType
    );
  });


  const API_BASE = window.location.origin.includes("localhost")
    ? "http://localhost:5001/api"
    : "https://admin.tikytop.com/api";

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/dashboard`
      );

      setFinanceData(res.data.finance);
      setTransactions(
        res.data.transactions || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Financial Management
          </h1>
          <p className="text-slate-500">
            Monitor revenue, deposits, and user balances.
          </p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          <Download size={18} className="mr-2" /> Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹{financeData.totalRevenue?.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Net Profit
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹{financeData.netProfit?.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              User Balances
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹{financeData.userBalances?.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Held in user wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Deposits
            </CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹{financeData.pendingDeposits?.toFixed(2)}
            </div>
            <p className="text-xs text-amber-600 flex items-center mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Transactions
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search by ID or user..."
              className="pl-10 max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-500" />
                  <SelectValue placeholder="Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Deposit">Deposits</SelectItem>
                <SelectItem value="Order">Orders</SelectItem>
                <SelectItem value="Refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[120px]">Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-xs font-medium text-slate-500">
                    {txn.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {txn.user}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        txn.type === "Deposit"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : txn.type === "Refund"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-50 text-slate-600"
                      }
                    >
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={
                      txn.amount > 0
                        ? "text-green-600 font-medium"
                        : "text-slate-900"
                    }
                  >
                    {txn.amount > 0 ? "+" : ""}
                    ${Number(txn.amount).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="text-slate-500">{txn.method}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${txn.status?.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-700"
                          : txn.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : txn.status?.toLowerCase() === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"}`}
                    >
                      {txn.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {txn.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={16} className="text-slate-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
