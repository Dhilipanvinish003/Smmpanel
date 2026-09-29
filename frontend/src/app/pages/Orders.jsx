import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import {
  Search,
  MoreVertical,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

const StatsCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <Card className="border-slate-200 shadow-sm">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${bgClass}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }) => {
  switch (status) {
    case "Completed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          <CheckCircle size={12} className="mr-1" /> Completed
        </Badge>
      );
    case "Processing":
    case "In Progress":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
          <RefreshCw size={12} className="mr-1 animate-spin-slow" /> {status}
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
          <Clock size={12} className="mr-1" /> Pending
        </Badge>
      );
    case "Canceled":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
          <XCircle size={12} className="mr-1" /> Canceled
        </Badge>
      );
    case "Partial":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
          <AlertCircle size={12} className="mr-1" /> Partial
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function Orders() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);


  const API_BASE = window.location.origin.includes("localhost")
    ? "http://localhost:5001/api"
    : "https://admin.tikytop.com/api";


  // Stats Calculation
  const stats = useMemo(() => {
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "Completed").length,
      processing: orders.filter((o) =>
        ["Processing", "In Progress"].includes(o.status),
      ).length,
      canceled: orders.filter((o) => o.status === "Canceled").length,
      pending: orders.filter((o) => o.status === "Pending").length,
    };
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, []);



  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`);

      const USD_TO_INR = 95.97;

      const formatted = res.data.map((o) => ({
        id: o.order_id,

        user: o.username ? o.username : "Customer",

        service: o.service?.name || `${o.platform} Service`,

        provider: o.provider_order_id ? `Provider #${o.provider_order_id}` : "Waiting Provider",

        link: o.link && o.link.trim() !== "" ? o.link : "N/A",

        quantity: o.quantity ?? 0,

        charge: o.amount ?? o.usd_amount ?? 0,

        status: o.status,

        date: new Date(o.createdAt).toLocaleString(),

        api_order_id: o.provider_order_id || o.razorpay_order_id,
        start_count: o.start_count || 0,
        remains: o.remains || 0,
        logs: []
      }));

      setOrders(formatted);

    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleSync = async () => {
    const loadingToast = toast.loading("Syncing orders with provider...");
    try {
      await axios.post(`${API_BASE}/orders/sync`);
      await fetchOrders();
      toast.success("Orders synced successfully", { id: loadingToast });
    } catch (err) {
      console.error("Sync failed:", err);
      toast.error("Failed to sync orders: " + (err.response?.data?.message || err.message), { id: loadingToast });
    }
  };

  // Filter orders;
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id?.toString().includes(searchTerm) ||
        (order.user || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.link || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesService =
        serviceFilter === "All" || order.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [orders, searchTerm, statusFilter, serviceFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, id]);
    } else {
      setSelectedOrders(selectedOrders.filter((o) => o !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
    toast.success(`Order #${id} marked as ${newStatus}`);
  };

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) return;
    if (action === "cancel") {
      if (
        confirm(
          `Are you sure you want to cancel ${selectedOrders.length} orders?`,
        )
      ) {
        setOrders(
          orders.map((o) =>
            selectedOrders.includes(o.id) ? { ...o, status: "Canceled" } : o,
          ),
        );
        toast.success(`${selectedOrders.length} orders canceled`);
        setSelectedOrders([]);
      }
    } else if (action === "complete") {
      setOrders(
        orders.map((o) =>
          selectedOrders.includes(o.id) ? { ...o, status: "Completed" } : o,
        ),
      );
      toast.success(`${selectedOrders.length} orders marked as completed`);
      setSelectedOrders([]);
    }
  };
  const handleUpdateOrder = () => {
    if (!editOrder) return;
    setOrders(orders.map((o) => (o.id === editOrder.id ? editOrder : o)));
    setIsEditOpen(false);
    toast.success("Order updated successfully");
  };

  const copyLink = (link) => {
    if (!link || link === "N/A") return;
    navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>
          <p className="text-slate-500">
            View and manage all service orders in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Exporting CSV...")}
          >
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button onClick={handleSync}>
            <RefreshCw size={16} className="mr-2" /> Sync Orders
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          title="Total Orders"
          value={stats.total}
          icon={MoreHorizontal}
          colorClass="text-slate-600"
          bgClass="bg-slate-100"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          colorClass="text-green-600"
          bgClass="bg-green-100"
        />
        <StatsCard
          title="Processing"
          value={stats.processing}
          icon={RefreshCw}
          colorClass="text-blue-600"
          bgClass="bg-blue-100"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          colorClass="text-yellow-600"
          bgClass="bg-yellow-100"
        />
        <StatsCard
          title="Canceled"
          value={stats.canceled}
          icon={XCircle}
          colorClass="text-red-600"
          bgClass="bg-red-100"
        />
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-2 lg:pb-0">
            <div className="relative min-w-[200px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                placeholder="Search ID, User, Link..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter size={14} className="mr-2 text-slate-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Services</SelectItem>
                {Array.from(new Set(orders.map((o) => o.service))).map(
                  (service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md animate-in fade-in slide-in-from-right-4">
                <span className="text-sm font-medium text-slate-600">
                  {selectedOrders.length} selected
                </span>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleBulkAction("complete")}
                >
                  <CheckCircle size={14} className="mr-1" /> Complete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleBulkAction("cancel")}
                >
                  <XCircle size={14} className="mr-1" /> Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedOrders.length === paginatedOrders.length &&
                    paginatedOrders.length > 0
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[200px]">Service</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Charge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-10 text-slate-500"
                >
                  No orders found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOrder(order.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium text-slate-500">
                    #ORD-{1000 + order.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm text-slate-900">
                      {order.user}
                    </div>

                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium truncate max-w-[180px]"
                        title={order.service}
                      >
                        {order.service}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {order.provider}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 group">
                      <span className="text-xs text-blue-600 truncate max-w-[120px]">
                        {order.link}
                      </span>
                      <button
                        onClick={() => copyLink(order.link)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {order.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-700">
                    ${order.charge}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-600"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setViewOrder(order);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye size={14} className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditOrder(order);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit size={14} className="mr-2" /> Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status !== "Completed" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "Completed")
                            }
                          >
                            <CheckCircle size={14} className="mr-2" /> Mark
                            Completed
                          </DropdownMenuItem>
                        )}
                        {order.status !== "Canceled" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "Canceled")
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle size={14} className="mr-2" /> Cancel Order
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <RotateCcw size={14} className="mr-2" /> Refill
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{" "}
            of <span className="font-medium">{filteredOrders.length}</span>{" "}
            results
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Simple logic to show first 5 pages, in real app needs smarter logic
              const p = i + 1;
              return (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(p)}
                  className={currentPage === p ? "bg-slate-900" : ""}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details #{viewOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order.
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-slate-500 text-xs uppercase">
                    User
                  </Label>
                  <p className="font-medium">{viewOrder.user}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 text-xs uppercase">
                    Status
                  </Label>
                  <div>
                    <StatusBadge status={viewOrder.status} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 text-xs uppercase">
                    Service
                  </Label>
                  <p className="text-sm">{viewOrder.service}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 text-xs uppercase">
                    Provider
                  </Label>
                  <p className="text-sm">{viewOrder.provider}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md border border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Quantity</span>
                  <span className="font-medium">{viewOrder.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Start Count</span>
                  <span className="font-medium">{viewOrder.start_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Link</span>
                  <a
                    href={viewOrder.link}
                    target="_blank"
                    className="text-blue-600 hover:underline truncate max-w-[250px]"
                  >
                    {viewOrder.link}
                  </a>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-medium">Total Charge</span>
                  <span className="font-bold text-lg">${viewOrder.charge}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-500 text-xs uppercase">
                  Order Logs
                </Label>
                <div className="border rounded-md max-h-[150px] overflow-y-auto bg-slate-50">
                  {viewOrder.logs.map((log, i) => (
                    <div
                      key={i}
                      className="text-xs p-2 border-b last:border-0 border-slate-100 flex gap-2"
                    >
                      <span className="text-slate-400 font-mono whitespace-nowrap">
                        {log.date.split(" ")[1]}
                      </span>
                      <span className="text-slate-700">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>Print Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order #{editOrder?.id}</DialogTitle>
            <DialogDescription>
              Modify order details. Be careful with these changes.
            </DialogDescription>
          </DialogHeader>

          {editOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={editOrder.link}
                  onChange={(e) =>
                    setEditOrder({ ...editOrder, link: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_count">Start Count</Label>
                  <Input
                    id="start_count"
                    type="number"
                    value={editOrder.start_count}
                    onChange={(e) =>
                      setEditOrder({
                        ...editOrder,
                        start_count: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={editOrder.quantity}
                    onChange={(e) =>
                      setEditOrder({
                        ...editOrder,
                        quantity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-md text-xs text-amber-700 border border-amber-100 flex gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>
                  Changing quantity will not automatically update the charge.
                  You may need to adjust the user's balance manually.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
