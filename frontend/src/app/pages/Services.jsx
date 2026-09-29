import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  MoreVertical,
  Plus,
  Filter,
  CheckCircle,
  Ban,
  Trash2,
  Edit,
  ArrowRightLeft,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ProviderServiceSelect } from "../components/ProviderServiceSelect";
const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:5001/api"
  : "https://admin.tikytop.com/api";


export function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [services, setServices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerServices, setProviderServices] = useState([]);

  // Dynamic platforms
  const [availablePlatforms, setAvailablePlatforms] = useState([
    "Instagram", "TikTok", "YouTube", "Facebook", "Twitter"
  ]);

  // Add new service form state
  const [newServiceForm, setNewServiceForm] = useState({
    name: "",
    platform: "",
    provider: "",
    provider_service_id: "",
    rate: "",
    price: "",
    min: "",
    max: "",
    contentType: "post",
  });

  const [showNewPlatformInput, setShowNewPlatformInput] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");

  // Edit service state
  const [editingService, setEditingService] = useState(null);
  const [editServiceForm, setEditServiceForm] = useState({
    name: "",
    type: "",
    provider: "",
    rate: "",
    price: "",
    min: "",
    max: "",
    status: "",
    contentType: "post",
  });

  useEffect(() => {
    fetchServices();
    fetchPlatforms();
    fetchSuppliers();
  }, []);


  // Fetch Services

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/services`);
      if (res.data.success) {
        setServices((res.data.services || []).map(s => ({
          ...s,
          id: s._id || s.id
        })));
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Suppliers

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/suppliers`);
      if (res.data.success) {
        setSuppliers(res.data.suppliers || []);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchProviderServices = async (providerName) => {

  try {

    const supplier = suppliers.find(
      (s) => s.name === providerName
    );

    if (!supplier) return;

    const res = await axios.post(
      `${API_BASE}/suppliers/${supplier._id}/import-services`
    );

    if (res.data.success) {

      setProviderServices(
        res.data.services || []
      );

    }

  } catch (err) {

    console.log(err);

    toast.error(
      "Failed to fetch provider services"
    );

  }

};

  // Fetch Plateform 

  const fetchPlatforms = async () => {
    try {
      const res = await axios.get(`${API_BASE}/platforms`);
      if (res.data.success && res.data.platforms?.length > 0) {
        setAvailablePlatforms(res.data.platforms);
      }
    } catch (err) {
      console.error("Failed to fetch platforms:", err);
    }
  };


  // Handle search

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPlatform = async () => {
    if (!newPlatformName.trim()) {
      toast.error("Platform name cannot be empty");
      return;
    }
    if (availablePlatforms.includes(newPlatformName)) {
      toast.error("This platform already exists");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/platforms`, {
        name: newPlatformName
      });

      if (res.data.success) {
        setAvailablePlatforms([...availablePlatforms, newPlatformName]);
        setNewServiceForm({ ...newServiceForm, platform: newPlatformName });
        setNewPlatformName("");
        setShowNewPlatformInput(false);
        toast.success(`Platform "${newPlatformName}" added!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add platform");
    }
  };

  const handleAddService = async () => {
    if (!newServiceForm.name || !newServiceForm.platform || !newServiceForm.provider || !newServiceForm.rate || !newServiceForm.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/services`, {
        name: newServiceForm.name,
        type: newServiceForm.platform,
        provider: newServiceForm.provider,
        provider_service_id: Number(newServiceForm.provider_service_id),
        rate: parseFloat(newServiceForm.rate),
        price: parseFloat(newServiceForm.price),
        min: parseInt(newServiceForm.min) || 10,
        max: parseInt(newServiceForm.max) || 10000,
        status: "Active",
        contentType: newServiceForm.contentType
      });

      if (res.data.success) {
        const added = res.data.service;
        setServices([
          ...services,
          {
            ...added,
            id: added._id || added.id
          }
        ]);
        setNewServiceForm({
          name: "",
          platform: "",
          provider: "",
          provider_service_id: "",
          rate: "",
          price: "",
          min: "",
          max: "",
          contentType: "post",
        });
        toast.success("Service added successfully!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Create Service Error:", msg, err.response?.data);
      toast.error(msg || "Failed to add service");
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || service.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
    try {
      const res = await axios.put(`${API_BASE}/services/${id}`, {
        status: newStatus
      });
      if (res.data.success) {
        setServices(
          services.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
        );
        toast.success(`Service status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update service status");
    }
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setEditServiceForm({
      name: service.name || "",
      type: service.type || "",
      provider: service.provider || "",
      rate: service.rate || "",
      price: service.price || "",
      min: service.min || "",
      max: service.max || "",
      status: service.status || "Active",
      contentType: service.contentType || "post",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;
    try {
      const res = await axios.put(`${API_BASE}/services/${editingService.id}`, {
        name: editServiceForm.name,
        type: editServiceForm.type,
        provider: editServiceForm.provider,
        rate: parseFloat(editServiceForm.rate),
        price: parseFloat(editServiceForm.price),
        min: parseInt(editServiceForm.min) || 10,
        max: parseInt(editServiceForm.max) || 10000,
        status: editServiceForm.status,
        contentType: editServiceForm.contentType,
      });
      if (res.data.success) {
        setServices(
          services.map((s) =>
            s.id === editingService.id ? { ...s, ...res.data.service } : s
          )
        );
        setEditingService(null);
        toast.success("Service updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update service");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/services/${id}`);
      if (res.data.success) {
        setServices(services.filter((s) => s.id !== id));
        toast.success("Service deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Service Management
          </h1>
          <p className="text-slate-500">
            Configure services, pricing, and providers.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} className="mr-2" /> Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service with platform and pricing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4 min-w-0">

              <div className="space-y-2 min-w-0">

                <Label className="text-slate-700 font-semibold text-sm">
                  Provider Service
                </Label>
                <ProviderServiceSelect
                  services={providerServices}
                  value={newServiceForm.provider_service_id}
                  onSelect={(selected) => {
                    setNewServiceForm({
                      ...newServiceForm,
                      provider_service_id: String(selected.provider_service_id),
                      name: selected.name,
                      platform: selected.type,
                      provider: selected.provider,
                      rate: String(selected.rate),
                      min: String(selected.min),
                      max: String(selected.max),
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-700 font-semibold text-sm">
                    Platform
                  </Label>
                  <div>
                    {showNewPlatformInput ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="New platform"
                          value={newPlatformName}
                          onChange={(e) => setNewPlatformName(e.target.value)}
                          className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddPlatform}
                          className="bg-blue-600 hover:bg-blue-700 font-semibold"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => { setShowNewPlatformInput(false); setNewPlatformName(""); }}
                          className="border-slate-300"
                        >
                          X
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={newServiceForm.platform}
                        onValueChange={(val) => {
                          if (val === "__add_new__") {
                            setShowNewPlatformInput(true);
                          } else {
                            setNewServiceForm({ ...newServiceForm, platform: val });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePlatforms.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                          <SelectItem value="__add_new__" className="border-t">
                            + Add New Platform
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider" className="text-slate-700 font-semibold text-sm">
                    Provider
                  </Label>
                  <Select value={newServiceForm.provider} onValueChange={(val) => {
                    setNewServiceForm
                      ({ ...newServiceForm, provider: val }); fetchProviderServices(val);
                  }}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup._id || sup.id} value={sup.name}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate" className="text-slate-700 font-semibold text-sm">
                    Provider Rate ($)
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                    value={newServiceForm.rate}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, rate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-700 font-semibold text-sm">
                    Selling Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                    value={newServiceForm.price}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">
                  Content Type
                </Label>
                <Select
                  value={newServiceForm.contentType}
                  onValueChange={(val) => setNewServiceForm({ ...newServiceForm, contentType: val })}
                >
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="highlight">Highlight</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="channel">Channel</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min" className="text-slate-700 font-semibold text-sm">
                    Min Order
                  </Label>
                  <Input
                    id="min"
                    type="number"
                    placeholder="10"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                    value={newServiceForm.min}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max" className="text-slate-700 font-semibold text-sm">
                    Max Order
                  </Label>
                  <Input
                    id="max"
                    type="number"
                    placeholder="10000"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                    value={newServiceForm.max}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, max: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddService}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => { if (!open) setEditingService(null); }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service details and content type.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Service Name</Label>
                <Input
                  value={editServiceForm.name}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Platform</Label>
                <Input
                  value={editServiceForm.type}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, type: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Provider</Label>
                <Input
                  value={editServiceForm.provider}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, provider: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Content Type</Label>
                <Select
                  value={editServiceForm.contentType}
                  onValueChange={(val) => setEditServiceForm({ ...editServiceForm, contentType: val })}
                >
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="highlight">Highlight</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="channel">Channel</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Provider Rate ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editServiceForm.rate}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, rate: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Selling Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editServiceForm.price}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, price: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Min Order</Label>
                <Input
                  type="number"
                  value={editServiceForm.min}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, min: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold text-sm">Max Order</Label>
                <Input
                  type="number"
                  value={editServiceForm.max}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, max: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold text-sm">Status</Label>
              <Select
                value={editServiceForm.status}
                onValueChange={(val) => setEditServiceForm({ ...editServiceForm, status: val })}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingService(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search services..."
            className="pl-10 max-w-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {availablePlatforms.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

       <div className="bg-white rounded-lg border border-slate-200 shadow-sm w-full overflow-hidden">
         <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Service Name</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Cost / Price</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Min/Max</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => {
              const profit = service.price - service.rate;
              const profitMargin = ((profit / service.rate) * 100).toFixed(0);
              return (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">#{service.provider_service_id}</TableCell>
                  <TableCell  className="max-w-[350px]">
                  <div className="flex items-center gap-2 overflow-hidden">      
                   <span className="font-medium text-slate-900 ">
                      {service.name}
                      </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 px-1.5 font-normal bg-slate-100 text-slate-500 border-slate-200"
                        >
                          {service.type}
                        </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {service.contentType || "post"}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {service.provider}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">
                        ${service.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${service.rate.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 font-mono"
                    >
                      +${profit.toFixed(2)} ({profitMargin}%)
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {service.min.toLocaleString()} -{" "}
                    {service.max.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${service.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {service.status === "Active" ? (
                        <CheckCircle size={12} className="mr-1" />
                      ) : (
                        <Ban size={12} className="mr-1" />
                      )}
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} className="text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenEdit(service)}>
                          <Edit size={16} className="mr-2" /> Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowRightLeft size={16} className="mr-2" /> Change
                          Provider
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(service.id, service.status)
                          }
                        >
                          {service.status === "Active" ? (
                            <>
                              <Ban size={16} className="mr-2" /> Disable
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} className="mr-2" /> Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
