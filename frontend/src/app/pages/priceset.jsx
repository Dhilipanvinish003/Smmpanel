import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Download,
  Save,
  Layers,
  Instagram,
  Youtube,
  Music,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  XCircle,
  HelpCircle,
  Trash2,
  Edit
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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:5001/api"
  : "https://admin.tikytop.com/api";

export function PriceSet() {
  const [view, setView] = useState("list"); // "list" or "add"
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    instagramCount: 0,
    youtubeCount: 0,
    tiktokCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [packagesModalItem, setPackagesModalItem] = useState(null);





  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Dynamic platforms and services
  const [availablePlatforms, setAvailablePlatforms] = useState([
    "Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "Spotify", "Telegram"
  ]);
  const [availableServices, setAvailableServices] = useState([
    "Likes", "Followers", "Views", "Subscribers", "Comments", "Shares", "Page Likes"
  ]);

  // New Price Form State
  const [form, setForm] = useState({
    platform: "",
    service: "",
    pricingType: "package",
    baseQuantity: "",
    price: "",
    packages: [
      {
        quantity: "",
        price: ""
      }
    ]
  });

  // States for adding new platform/service
  const [showNewPlatformInput, setShowNewPlatformInput] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");
  const [showNewServiceInput, setShowNewServiceInput] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  useEffect(() => {
    fetchPrices();
    fetchPlatformsAndServices();
  }, [platformFilter]);

  const fetchPlatformsAndServices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/platforms/services/all`);
      if (res.data.success) {
        if (res.data.platforms?.length > 0) {
          setAvailablePlatforms(res.data.platforms);
        }
        if (res.data.services?.length > 0) {
          setAvailableServices(res.data.services);
        }
      }
    } catch (err) {
      console.error("Failed to fetch platforms/services:", err);
    }
  };

  const fetchPrices = async () => {

    try {

      setLoading(true);

      const platformQuery =
        platformFilter !== "All Platforms"
          ? `platform=${platformFilter}`
          : "";

      const res = await axios.get(
        `${API_BASE}/priceset?${platformQuery}`
      );

      if (res.data.success) {
        const nextPrices = res.data.prices || [];
        setPrices(nextPrices);

        // Keep the page useful while an older backend is being deployed.
        const activePrices = nextPrices.filter(
          (price) => String(price.status || "Active").toLowerCase() === "active"
        );
        const fallbackStats = {
          totalServices: nextPrices.length,
          instagramCount: activePrices.filter(
            (price) => String(price.platform).toLowerCase() === "instagram"
          ).length,
          youtubeCount: activePrices.filter(
            (price) => String(price.platform).toLowerCase() === "youtube"
          ).length,
          tiktokCount: activePrices.filter(
            (price) => String(price.platform).toLowerCase() === "tiktok"
          ).length
        };

        setStats(res.data.stats || fallbackStats);

      }

    } catch (err) {

      console.error("Failed to fetch prices:", err);

      toast.error("Failed to load pricing data.");

    } finally {

      setLoading(false);

    }

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
        setForm({ ...form, platform: newPlatformName });
        setNewPlatformName("");
        setShowNewPlatformInput(false);
        toast.success(`Platform "${newPlatformName}" added successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to add platform");
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast.error("Service name cannot be empty");
      return;
    }
    if (availableServices.includes(newServiceName)) {
      toast.error("This service already exists");
      return;
    }

    setAvailableServices([...availableServices, newServiceName]);
    setForm({ ...form, service: newServiceName });
    setNewServiceName("");
    setShowNewServiceInput(false);
    toast.success(`Service "${newServiceName}" added successfully!`);
  };

  // Filter prices on search term
  const filteredPrices = useMemo(() => {
    return prices.filter((price) => {
      const matchSearch =
        price.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (price.category && price.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [prices, searchTerm]);

  // Pagination details
  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage) || 1;
  const paginatedPrices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPrices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPrices, currentPage]);

  const handleInputChange = (id, field, value) => {
    setPrices(prev =>
      prev.map(p => (p._id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveInline = async (item) => {
    try {
      const res = await axios.put(`${API_BASE}/priceset/${item._id}`, {
        packages: item.packages,
        minOrder: Number(item.minOrder),
        maxOrder: Number(item.maxOrder),
        status: item.status
      });
      if (res.data.success) {
        toast.success(`Successfully updated ${item.platform} ${item.service} price!`);
        fetchPrices();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to update pricing");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price item?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/priceset/${id}`);
      if (res.data.success) {
        toast.success("Price item deleted successfully.");
        fetchPrices();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete price item.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.platform || !form.service) {
      toast.error("Please fill required fields");
      return;
    }

    if (
      form.pricingType === "custom" &&
      (!form.baseQuantity || !form.price)
    ) {
      toast.error("Please enter quantity and price");
      return;
    }

    if (form.pricingType === "package") {
      if (form.packages.length === 0) {
        toast.error("Add at least one package");
        return;
      }
      const emptyPkg = form.packages.some(p => !p.quantity || !p.price);
      if (emptyPkg) {
        toast.error("Fill quantity and price for all packages");
        return;
      }
    }

    try {
      const payload = {
        platform: form.platform,
        service: form.service,
        category: form.category,
        status: form.status || "Active",
        pricingType: form.pricingType || "package",
        packages: form.packages,
        minOrder: form.minOrder,
        maxOrder: form.maxOrder,
        description: form.description,
        note: form.note
      };

      const res = await axios.post(`${API_BASE}/priceset`, payload);
      if (res.data.success) {
        toast.success("New price added successfully!");
        setForm({
          platform: "",
          service: "",
          category: "",
          status: "Active",
          pricingType: "package",
          baseQuantity: "",
          price: "",

          minOrder: "",
          maxOrder: "",
          description: "",
          note: "",
          packages: [
            { quantity: "", price: "" }]
        });
        setView("list");
        fetchPrices();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save pricing");
    }
  };

  const exportToCSV = () => {
    const headers = ["Platform", "Service", "Base Quantity", "Price (USD)", "Unit Price (USD)", "Status"];
    const rows = filteredPrices.map(p => [
      p.platform,
      p.service,
      p.baseQuantity,
      p.price,
      (p.price / p.baseQuantity).toFixed(4),
      p.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "prices_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  if (view === "add") {
    return (
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:underline" onClick={() => setView("list")}>Price Set</span>
            <span>&gt;</span>
            <span className="text-pink-600 font-medium">Add New Price</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Price</h1>
        </div>

        {/* Main Card Form */}
        <Card className="border-slate-200 shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30 text-white">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Pricing</h3>
                <p className="text-sm text-slate-500">Create a new pricing for platform and service.</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Platform <span className="text-red-500">*</span></label>
                  {showNewPlatformInput ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Platform name"
                        value={newPlatformName}
                        onChange={(e) => setNewPlatformName(e.target.value)}
                        className="bg-slate-50 border-slate-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddPlatform}
                        className="bg-pink-600 hover:bg-pink-700"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => { setShowNewPlatformInput(false); setNewPlatformName(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={form.platform}
                        onValueChange={(val) => {
                          if (val === "__add_new__") {
                            setShowNewPlatformInput(true);
                          } else {
                            setForm({ ...form, platform: val });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePlatforms.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                          <SelectItem value="__add_new__" className="border-t">
                            + Add New Platform
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Service <span className="text-red-500">*</span></label>
                  {showNewServiceInput ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Service name"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="bg-slate-50 border-slate-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddService}
                        className="bg-pink-600 hover:bg-pink-700"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => { setShowNewServiceInput(false); setNewServiceName(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={form.service}
                        onValueChange={(val) => {
                          if (val === "__add_new__") {
                            setShowNewServiceInput(true);
                          } else {
                            setForm({ ...form, service: val });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                          <SelectItem value="__add_new__" className="border-t">
                            + Add New Service
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Category</label>
                  <Select
                    value={form.category}
                    onValueChange={(val) => setForm({ ...form, category: val })}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High Quality">High Quality</SelectItem>
                      <SelectItem value="Real">Real</SelectItem>
                      <SelectItem value="Targeted">Targeted</SelectItem>
                      <SelectItem value="Organic">Organic</SelectItem>
                      <SelectItem value="Bot">Bot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Status <span className="text-red-500">*</span></label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => setForm({ ...form, status: val })}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2 */}

              {form.pricingType === "package" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Package Pricing
                    </h3>
                    <Button type="button" onClick={() => {
                      setForm({
                        ...form, packages: [...form.packages,
                        { quantity: "", price: "" }
                        ]
                      });

                    }}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      + Add Package
                    </Button>

                  </div>

                  {form.packages.map((pkg, index) => {
                    const isCustomColor = !["Green", "Orange", "Red", "Blue", "Purple", "Pink", "Yellow", ""].includes(pkg.badgeColor || "");
                    return (
                      <div
                        key={index}
                        className="space-y-4 border p-4 rounded-xl relative bg-slate-50/50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm text-slate-700">Package #{index + 1}</span>
                          {form.packages.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                const updatedPackages = form.packages.filter((_, i) => i !== index);
                                setForm({ ...form, packages: updatedPackages });
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 size={15} />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Quantity</label>
                            <Input
                              type="number"
                              placeholder="100"
                              value={pkg.quantity}
                              onChange={(e) => {
                                const updatedPackages = [...form.packages];
                                updatedPackages[index].quantity = e.target.value;
                                setForm({ ...form, packages: updatedPackages });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Price ($)</label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="2"
                              value={pkg.price}
                              onChange={(e) => {
                                const updatedPackages = [...form.packages];
                                updatedPackages[index].price = e.target.value;
                                setForm({ ...form, packages: updatedPackages });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Display Order</label>
                            <Input
                              type="number"
                              placeholder="100"
                              value={pkg.displayOrder || ""}
                              onChange={(e) => {
                                const updatedPackages = [...form.packages];
                                updatedPackages[index].displayOrder = e.target.value;
                                setForm({ ...form, packages: updatedPackages });
                              }}
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-8">
                            <input
                              type="checkbox"
                              id={`pkg-highlight-${index}`}
                              checked={!!pkg.highlight}
                              onChange={(e) => {
                                const updatedPackages = [...form.packages];
                                updatedPackages[index].highlight = e.target.checked;
                                setForm({ ...form, packages: updatedPackages });
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <label htmlFor={`pkg-highlight-${index}`} className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                              Highlight Package
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Offer Text</label>
                            <Input
                              placeholder="Save $3, 20% Discount..."
                              value={pkg.offerText || ""}
                              onChange={(e) => {
                                const updatedPackages = [...form.packages];
                                updatedPackages[index].offerText = e.target.value;
                                setForm({ ...form, packages: updatedPackages });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Badge</label>
                            <Select
                              value={pkg.badge || "None"}
                              onValueChange={(val) => {
                                const updatedPackages = [...form.packages];
                                updatedPackages[index].badge = val === "None" ? "" : val;
                                setForm({ ...form, packages: updatedPackages });
                              }}
                            >
                              <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10">
                                <SelectValue placeholder="None" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Best Selling">Best Selling</SelectItem>
                                <SelectItem value="Most Popular">Most Popular</SelectItem>
                                <SelectItem value="Recommended">Recommended</SelectItem>
                                <SelectItem value="Bulk Price">Bulk Price</SelectItem>
                                <SelectItem value="Hot Deal">Hot Deal</SelectItem>
                                <SelectItem value="Limited Offer">Limited Offer</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                                <SelectItem value="Editor's Choice">Editor's Choice</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Badge Color</label>
                            <Select
                              value={isCustomColor ? "Custom" : (pkg.badgeColor || "Blue")}
                              onValueChange={(val) => {
                                const updatedPackages = [...form.packages];
                                if (val === "Custom") {
                                  updatedPackages[index].badgeColor = "#FF007F";
                                } else {
                                  updatedPackages[index].badgeColor = val;
                                }
                                setForm({ ...form, packages: updatedPackages });
                              }}
                            >
                              <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10">
                                <SelectValue placeholder="Blue" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Green">Green</SelectItem>
                                <SelectItem value="Orange">Orange</SelectItem>
                                <SelectItem value="Red">Red</SelectItem>
                                <SelectItem value="Blue">Blue</SelectItem>
                                <SelectItem value="Purple">Purple</SelectItem>
                                <SelectItem value="Pink">Pink</SelectItem>
                                <SelectItem value="Yellow">Yellow</SelectItem>
                                <SelectItem value="Custom">Custom (Hex/Text)</SelectItem>
                              </SelectContent>
                            </Select>
                            {isCustomColor && (
                              <Input
                                type="text"
                                placeholder="#FF007F"
                                value={pkg.badgeColor || ""}
                                onChange={(e) => {
                                  const updatedPackages = [...form.packages];
                                  updatedPackages[index].badgeColor = e.target.value;
                                  setForm({ ...form, packages: updatedPackages });
                                }}
                                className="mt-1"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

              )}

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span>Description</span>
                    <span className="text-slate-400 font-normal">{form.description?.length || 0}/200</span>
                  </div>
                  <Textarea
                    placeholder="Enter description (optional)"
                    maxLength={200}
                    rows={4}
                    className="bg-slate-50 border-slate-200 resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span>Note (Internal)</span>
                    <span className="text-slate-400 font-normal">{form.note?.length || 0}/200</span>
                  </div>
                  <Textarea
                    placeholder="Enter internal note (optional)"
                    maxLength={200}
                    rows={4}
                    className="bg-slate-50 border-slate-200 resize-none"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-2 h-auto text-sm"
                  onClick={() => setView("list")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 h-auto text-sm flex items-center gap-2 shadow-md shadow-pink-500/25"
                >
                  <Save size={16} />
                  Save Price
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper to render platform icon
  const renderPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-600" />;
      case "tiktok":
        return <Music className="w-4 h-4 text-slate-900" />;
      default:
        return <Layers className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Price Set</h1>
          <p className="text-slate-500">Manage all platform pricing dynamically.</p>
        </div>
        <Button
          onClick={() => setView("add")}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-pink-500/25"
        >
          <Plus size={18} /> Add New Price
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Services</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalServices}</h3>
              <p className="text-xs text-slate-400">All platform services</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 text-pink-500 shadow-sm border border-pink-100">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instagram</p>
              <h3 className="text-3xl font-bold text-slate-900 text-pink-600">{stats.instagramCount}</h3>
              <p className="text-xs text-slate-400">Active services</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 text-pink-500 shadow-sm border border-pink-100">
              <Instagram className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">YouTube</p>
              <h3 className="text-3xl font-bold text-slate-900 text-red-600">{stats.youtubeCount}</h3>
              <p className="text-xs text-slate-400">Active services</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 text-red-500 shadow-sm border border-red-100">
              <Youtube className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">TikTok</p>
              <h3 className="text-3xl font-bold text-slate-900 text-slate-800">{stats.tiktokCount}</h3>
              <p className="text-xs text-slate-400">Active services</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 text-slate-800 shadow-sm border border-slate-200">
              <Music className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters, Search & Export */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search pricing..."
              className="pl-10 bg-slate-50 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={platformFilter}
            onValueChange={(val) => {
              setPlatformFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Platforms">All Platforms</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Spotify">Spotify</SelectItem>
              <SelectItem value="Telegram">Telegram</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={exportToCSV}
          className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading platform pricing...</div>
        ) : paginatedPrices.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No pricing entries found.</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Platform</TableHead>
                <TableHead className="font-semibold text-slate-700">Service</TableHead>
                <TableHead className="font-semibold text-slate-700">Packages</TableHead>
                <TableHead className="font-semibold text-slate-700">Min Order</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">

              {paginatedPrices.map((item) => (

                <TableRow
                  key={item._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >

                  {/* PLATFORM */}

                  <TableCell>

                    <div className="flex items-center gap-2 font-medium text-slate-900">

                      {renderPlatformIcon(item.platform)}

                      <span>{item.platform}</span>

                    </div>

                  </TableCell>

                  {/* SERVICE */}

                  <TableCell className="text-slate-700 font-medium">

                    {item.service}

                  </TableCell>

                  {/* PACKAGES - compact chips */}

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[260px]">
                      {item.packages?.slice(0, 4).map((pkg, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 whitespace-nowrap"
                        >
                          <span className="text-slate-500">{Number(pkg.quantity).toLocaleString()}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-green-700 font-semibold">${pkg.price}</span>
                        </span>
                      ))}
                      {item.packages?.length > 4 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-200">
                          +{item.packages.length - 4} more
                        </span>
                      )}
                      <button
                        onClick={() => setPackagesModalItem({ ...item })}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold border border-purple-200 hover:bg-purple-100 transition-colors"
                      >
                        ✏ Edit
                      </button>
                    </div>
                  </TableCell>

                  {/* MIN ORDER */}

                  <TableCell>

                    <Input
                      type="number"

                      className="h-8 py-1 px-2 border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold font-mono max-w-[100px]"

                      value={item.minOrder || ""}

                      onChange={(e) =>

                        handleInputChange(
                          item._id,
                          "minOrder",
                          e.target.value
                        )

                      }

                    />

                  </TableCell>

                  {/* STATUS */}

                  <TableCell>

                    <Select
                      value={item.status}

                      onValueChange={(val) =>
                        handleInputChange(
                          item._id,
                          "status",
                          val
                        )
                      }
                    >

                      <SelectTrigger className="w-[110px] h-8 border-slate-200">

                        <SelectValue />

                      </SelectTrigger>

                      <SelectContent>

                        <SelectItem value="Active">

                          <span className="flex items-center gap-1.5 text-green-600 font-semibold">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            Active

                          </span>

                        </SelectItem>

                        <SelectItem value="Inactive">

                          <span className="flex items-center gap-1.5 text-slate-500 font-semibold">

                            <span className="w-2 h-2 rounded-full bg-slate-400" />

                            Inactive

                          </span>

                        </SelectItem>

                      </SelectContent>

                    </Select>

                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell>

                    <div className="flex justify-center items-center gap-2">

                      <Button
                        onClick={() => setEditingItem({ ...item })}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium h-8 py-1 px-3 text-xs flex items-center gap-1.5 shadow-sm shadow-purple-500/25"
                      >
                        <Edit size={13} />
                        Promo
                      </Button>

                      <Button

                        onClick={async () => {

                          try {

                            const res =
                              await axios.put(

                                `${API_BASE}/priceset/${item._id}`,

                                {

                                  packages:
                                    item.packages,

                                  minOrder:
                                    Number(item.minOrder),

                                  maxOrder:
                                    Number(item.maxOrder),

                                  status:
                                    item.status

                                }

                              );

                            if (res.data.success) {

                              toast.success(
                                "Packages updated successfully!"
                              );

                              fetchPrices();

                            }

                          } catch (err) {

                            console.log(err);

                            toast.error(
                              err.response?.data?.message || err.message || "Failed to update packages"
                            );

                          }

                        }}

                        className="bg-pink-600 hover:bg-pink-700 text-white font-medium h-8 py-1 px-3 text-xs flex items-center gap-1.5 shadow-sm shadow-pink-500/25"
                      >

                        <Save size={13} />

                        Save

                      </Button>

                      <Button
                        variant="ghost"

                        onClick={() =>
                          handleDelete(item._id)
                        }

                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >

                        <Trash2 size={15} />

                      </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>
          </Table>
        )}

        {/* Pagination bar */}
        {!loading && paginatedPrices.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredPrices.length)}</span> of{" "}
              <span className="font-semibold">{filteredPrices.length}</span> entries
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-slate-300 text-slate-600"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <Button
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 ${currentPage === idx + 1 ? "bg-pink-600 text-white hover:bg-pink-700" : "border-slate-300 text-slate-600"}`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-slate-300 text-slate-600"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Packages Quick-Edit Modal ── */}
      {packagesModalItem && (
        <Dialog open={!!packagesModalItem} onOpenChange={() => setPackagesModalItem(null)}>
          <DialogContent className="max-w-lg bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl">
            <DialogHeader className="border-b pb-3 mb-4">
              <DialogTitle className="text-lg font-bold text-slate-900">
                Edit Packages — {packagesModalItem.platform} · {packagesModalItem.service}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
                <span>Quantity</span>
                <span>Price ($)</span>
                <span></span>
              </div>

              {packagesModalItem.packages?.map((pkg, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <Input
                    type="number"
                    value={pkg.quantity}
                    placeholder="Qty"
                    className="h-9 text-sm"
                    onChange={(e) => {
                      const updated = [...packagesModalItem.packages];
                      updated[i] = { ...updated[i], quantity: e.target.value };
                      setPackagesModalItem({ ...packagesModalItem, packages: updated });
                    }}
                  />
                  <Input
                    type="number"
                    value={pkg.price}
                    placeholder="Price"
                    className="h-9 text-sm"
                    onChange={(e) => {
                      const updated = [...packagesModalItem.packages];
                      updated[i] = { ...updated[i], price: e.target.value };
                      setPackagesModalItem({ ...packagesModalItem, packages: updated });
                    }}
                  />
                  <button
                    onClick={() => {
                      const updated = packagesModalItem.packages.filter((_, idx) => idx !== i);
                      setPackagesModalItem({ ...packagesModalItem, packages: updated });
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setPackagesModalItem({
                    ...packagesModalItem,
                    packages: [...(packagesModalItem.packages || []), { quantity: "", price: "" }]
                  })
                }
                className="w-full flex items-center justify-center gap-1 py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                <span className="text-lg leading-none">+</span> Add Package
              </button>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
              <Button
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                onClick={async () => {
                  try {
                    const res = await axios.put(`${API_BASE}/priceset/${packagesModalItem._id}`, {
                      packages: packagesModalItem.packages,
                      minOrder: Number(packagesModalItem.minOrder),
                      maxOrder: Number(packagesModalItem.maxOrder),
                      status: packagesModalItem.status
                    });
                    if (res.data.success) {
                      toast.success("Packages saved successfully!");
                      fetchPrices();
                      setPackagesModalItem(null);
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Failed to save packages");
                  }
                }}
              >
                Save Packages
              </Button>
              <Button
                variant="outline"
                className="border-slate-200"
                onClick={() => setPackagesModalItem(null)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Detailed Package/Promo Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Manage Packages & Promo: {editingItem.platform} - {editingItem.service}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-slate-800">Packages List</h4>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      ...editingItem,
                      packages: [
                        ...(editingItem.packages || []),
                        { quantity: "", price: "", offerText: "", badge: "", badgeColor: "Blue", highlight: false, displayOrder: "" }
                      ]
                    });
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold flex items-center gap-2 h-9 text-xs"
                >
                  <Plus size={14} /> Add Package
                </Button>
              </div>

              {(!editingItem.packages || editingItem.packages.length === 0) ? (
                <div className="p-8 text-center text-slate-500 border border-dashed rounded-2xl bg-slate-50">
                  No packages defined. Add a package to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {editingItem.packages.map((pkg, idx) => {
                    const isCustomColor = !["Green", "Orange", "Red", "Blue", "Purple", "Pink", "Yellow", ""].includes(pkg.badgeColor || "");
                    return (
                      <div
                        key={idx}
                        className="space-y-4 border p-4 rounded-xl relative bg-slate-50/50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm text-slate-700">Package #{idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              const updated = editingItem.packages.filter((_, i) => i !== idx);
                              setEditingItem({ ...editingItem, packages: updated });
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Quantity</label>
                            <Input
                              type="number"
                              placeholder="100"
                              value={pkg.quantity}
                              onChange={(e) => {
                                const updated = [...editingItem.packages];
                                updated[idx].quantity = e.target.value;
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Price ($)</label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="2"
                              value={pkg.price}
                              onChange={(e) => {
                                const updated = [...editingItem.packages];
                                updated[idx].price = e.target.value;
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Display Order</label>
                            <Input
                              type="number"
                              placeholder="100"
                              value={pkg.displayOrder || ""}
                              onChange={(e) => {
                                const updated = [...editingItem.packages];
                                updated[idx].displayOrder = e.target.value;
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-8">
                            <input
                              type="checkbox"
                              id={`edit-pkg-highlight-${idx}`}
                              checked={!!pkg.highlight}
                              onChange={(e) => {
                                const updated = [...editingItem.packages];
                                updated[idx].highlight = e.target.checked;
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <label htmlFor={`edit-pkg-highlight-${idx}`} className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                              Highlight Package
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Offer Text</label>
                            <Input
                              placeholder="Save $3, 20% Discount..."
                              value={pkg.offerText || ""}
                              onChange={(e) => {
                                const updated = [...editingItem.packages];
                                updated[idx].offerText = e.target.value;
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Badge</label>
                            <Select
                              value={pkg.badge || "None"}
                              onValueChange={(val) => {
                                const updated = [...editingItem.packages];
                                updated[idx].badge = val === "None" ? "" : val;
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                            >
                              <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10">
                                <SelectValue placeholder="None" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Best Selling">Best Selling</SelectItem>
                                <SelectItem value="Most Popular">Most Popular</SelectItem>
                                <SelectItem value="Recommended">Recommended</SelectItem>
                                <SelectItem value="Bulk Price">Bulk Price</SelectItem>
                                <SelectItem value="Hot Deal">Hot Deal</SelectItem>
                                <SelectItem value="Limited Offer">Limited Offer</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                                <SelectItem value="Editor's Choice">Editor's Choice</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Badge Color</label>
                            <Select
                              value={isCustomColor ? "Custom" : (pkg.badgeColor || "Blue")}
                              onValueChange={(val) => {
                                const updated = [...editingItem.packages];
                                if (val === "Custom") {
                                  updated[idx].badgeColor = "#FF007F";
                                } else {
                                  updated[idx].badgeColor = val;
                                }
                                setEditingItem({ ...editingItem, packages: updated });
                              }}
                            >
                              <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10">
                                <SelectValue placeholder="Blue" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Green">Green</SelectItem>
                                <SelectItem value="Orange">Orange</SelectItem>
                                <SelectItem value="Red">Red</SelectItem>
                                <SelectItem value="Blue">Blue</SelectItem>
                                <SelectItem value="Purple">Purple</SelectItem>
                                <SelectItem value="Pink">Pink</SelectItem>
                                <SelectItem value="Yellow">Yellow</SelectItem>
                                <SelectItem value="Custom">Custom (Hex/Text)</SelectItem>
                              </SelectContent>
                            </Select>
                            {isCustomColor && (
                              <Input
                                type="text"
                                placeholder="#FF007F"
                                value={pkg.badgeColor || ""}
                                onChange={(e) => {
                                  const updated = [...editingItem.packages];
                                  updated[idx].badgeColor = e.target.value;
                                  setEditingItem({ ...editingItem, packages: updated });
                                }}
                                className="mt-1"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await axios.put(`${API_BASE}/priceset/${editingItem._id}`, {
                        packages: editingItem.packages,
                        minOrder: Number(editingItem.minOrder),
                        maxOrder: Number(editingItem.maxOrder),
                        status: editingItem.status
                      });
                      if (res.data.success) {
                        toast.success("Packages & Promo configurations updated successfully!");
                        setEditingItem(null);
                        fetchPrices();
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error(err.response?.data?.message || err.message || "Failed to save configurations");
                    }
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Save Configurations
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
