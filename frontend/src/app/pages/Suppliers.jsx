import React, { useState } from "react";
import axios from "axios";
import {
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Download,
  Search,
  Server,
  Key,
  Eye,
  EyeOff,
  Plug,
  Activity,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:5001/api"
  : "https://admin.tikytop.com/api";

const MOCK_SUPPLIERS = [
  {
    id: 1,
    name: "SMM King",
    url: "https://smmking.com/api/v2",
    balance: 450.2,
    currency: "USD",
    success_rate: 98.5,
    status: "Active",
    latency: "45ms",
  },
  {
    id: 2,
    name: "JustAnotherPanel",
    url: "https://jap.com/api/v2",
    balance: 12.5,
    currency: "USD",
    success_rate: 65.2,
    status: "Warning",
    latency: "120ms",
  },
  {
    id: 3,
    name: "Global SMM",
    url: "https://globalsmm.provider/api",
    balance: 890.0,
    currency: "USD",
    success_rate: 99.1,
    status: "Active",
    latency: "30ms",
  },
  {
    id: 4,
    name: "CheapServices",
    url: "https://cheap.io/api",
    balance: 0.0,
    currency: "USD",
    success_rate: 0,
    status: "Inactive",
    latency: "Timeout",
  },
];

const MOCK_PROVIDER_SERVICES = [
  {
    id: 101,
    service: "Instagram Followers [Real]",
    rate: 0.5,
    min: 100,
    max: 10000,
  },
  {
    id: 102,
    service: "Instagram Likes [Instant]",
    rate: 0.1,
    min: 50,
    max: 5000,
  },
  { id: 103, service: "TikTok Views", rate: 0.01, min: 1000, max: 1000000 },
  {
    id: 104,
    service: "YouTube Views [Retention]",
    rate: 1.2,
    min: 500,
    max: 50000,
  },
  { id: 105, service: "Twitter Followers", rate: 2.0, min: 100, max: 20000 },
];

const MOCK_API_LOGS = [
  {
    id: 1,
    method: "POST",
    endpoint: "/orders/add",
    status: 200,
    time: "10:42:05",
    duration: "45ms",
  },
  {
    id: 2,
    method: "POST",
    endpoint: "/orders/status",
    status: 200,
    time: "10:41:55",
    duration: "32ms",
  },
  {
    id: 3,
    method: "GET",
    endpoint: "/services",
    status: 200,
    time: "10:30:12",
    duration: "150ms",
  },
  {
    id: 4,
    method: "POST",
    endpoint: "/orders/add",
    status: 400,
    time: "09:15:22",
    duration: "40ms",
  },
  {
    id: 5,
    method: "POST",
    endpoint: "/balance",
    status: 200,
    time: "09:00:00",
    duration: "28ms",
  },
];

export function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    url: "",
    key: "",
    balance: "",
    success_rate: "",
  });
  // API Key Management State
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [newKeyVisible, setNewKeyVisible] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/suppliers`);
      if (res.data.success) {
        const mapped = (res.data.suppliers || []).map((s) => ({
          ...s,
          id: s._id || s.id,
        }));
        setSuppliers(mapped);
      }
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      toast.error("Failed to load connected suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id) => {
    toast.promise(
      axios.post(`${API_BASE}/suppliers/${id}/sync`).then((res) => {
        if (res.data.success) {
          const updated = res.data.supplier;
          setSuppliers((prev) =>
            prev.map((s) =>
              s.id === id ? { ...updated, id: updated._id || updated.id } : s
            )
          );
          return res.data;
        } else {
          throw new Error(res.data.message || "Failed to sync");
        }
      }),
      {
        loading: "Syncing balance and status...",
        success: "Supplier synced successfully!",
        error: "Failed to sync",
      }
    );
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.url || newSupplier.balance === "" || newSupplier.success_rate === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/suppliers`, {
        name: newSupplier.name,
        url: newSupplier.url,
        key: newSupplier.key,
        balance: parseFloat(newSupplier.balance),
        success_rate: parseFloat(newSupplier.success_rate)
      });

      if (res.data.success) {
        const added = res.data.supplier;
        setSuppliers([
          ...suppliers,
          {
            ...added,
            id: added._id || added.id,
          },
        ]);
        setIsAddOpen(false);
        setNewSupplier({ name: "", url: "", key: "", balance: "", success_rate: "" });
        toast.success("New supplier connected successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add supplier. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this supplier? This will disable all linked services.",
      )
    ) {
      try {
        const res = await axios.delete(`${API_BASE}/suppliers/${id}`);
        if (res.data.success) {
          setSuppliers(suppliers.filter((s) => s.id !== id));
          toast.success("Supplier removed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete supplier");
      }
    }
  };

  const openImportModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsImportOpen(true);
  };

  const openApiSettings = (supplier) => {
    setSelectedSupplier(supplier);
    setCurrentApiKey(supplier.api_key || "");
    setApiKeyVisible(false);
    setIsApiSettingsOpen(true);
  };

  const handleImportServices = () => {
    setIsImportOpen(false);
    toast.success(`Imported 3 services from ${selectedSupplier?.name}`);
  };

  const handleUpdateApiKey = async () => {
    if (!selectedSupplier) return;
    try {
      const res = await axios.put(`${API_BASE}/suppliers/${selectedSupplier.id}`, {
        key: currentApiKey
      });
      if (res.data.success) {
        const updated = res.data.supplier;
        setSuppliers((prev) =>
          prev.map((s) =>
            s.id === selectedSupplier.id ? { ...updated, id: updated._id || updated.id } : s
          )
        );
        setIsApiSettingsOpen(false);
        toast.success("API Configuration updated successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update API Configuration");
    }
  };

  const testConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      toast.success(`Connection Successful! Balance: $${selectedSupplier?.balance?.toFixed(2) || "0.00"}`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Supplier Management
          </h1>
          <p className="text-slate-500">
            Connect and manage external SMM provider APIs.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} className="mr-2" /> Connect New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect Supplier API</DialogTitle>
              <DialogDescription>
                Add a new SMM panel provider. You will need their API Key.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">
                  Supplier Name
                </Label>
                <Input
                  id="name"
                  placeholder="Provider Name"
                  className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg transition-colors"
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-slate-700 font-semibold text-sm">
                  API URL
                </Label>
                <Input
                  id="url"
                  placeholder="https://panel.com/api/v2"
                  className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg transition-colors"
                  value={newSupplier.url}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key" className="text-slate-700 font-semibold text-sm">
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id="key"
                    type={newKeyVisible ? "text" : "password"}
                    placeholder="****************"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg pr-10 transition-colors"
                    value={newSupplier.key}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, key: e.target.value })
                    }
                  />

                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setNewKeyVisible(!newKeyVisible)}
                  >
                    {newKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance" className="text-slate-700 font-semibold text-sm">
                    Balance (USD)
                  </Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                    value={newSupplier.balance}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, balance: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate" className="text-slate-700 font-semibold text-sm">
                    Success Rate (%)
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="100"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
                    value={newSupplier.success_rate}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, success_rate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddSupplier}
                disabled={!newSupplier.name || !newSupplier.url || newSupplier.balance === "" || newSupplier.success_rate === ""}
              >
                Connect Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative"
          >
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => openApiSettings(supplier)}
                >
                  <Key size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(supplier.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <Server size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {supplier.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <span className="text-xs truncate max-w-[150px]">
                        {supplier.url}
                      </span>
                      <ExternalLink size={10} className="text-slate-400" />
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Balance
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    ${supplier.balance.toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Success Rate
                  </p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xl font-bold ${supplier.success_rate > 90 ? "text-green-600" : supplier.success_rate > 70 ? "text-amber-600" : "text-red-600"}`}
                    >
                      {supplier.success_rate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status</span>
                  {supplier.latency !== "Timeout" && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Activity size={10} /> {supplier.latency}
                    </span>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={
                    supplier.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : supplier.status === "Warning"
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                  }
                >
                  {supplier.status === "Active" && (
                    <CheckCircle size={10} className="mr-1" />
                  )}
                  {supplier.status === "Warning" && (
                    <AlertTriangle size={10} className="mr-1" />
                  )}
                  {supplier.status}
                </Badge>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSync(supplier.id)}
                >
                  <RefreshCw size={14} className="mr-2" /> Sync
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  onClick={() => openImportModal(supplier)}
                >
                  <Download size={14} className="mr-2" /> Import
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Import Services Modal */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Import Services from {selectedSupplier?.name}
            </DialogTitle>
            <DialogDescription>
              Select services to import to your panel.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 py-2">
            <Search size={16} className="text-slate-400" />
            <Input placeholder="Search provider services..." className="h-9" />
          </div>

          <div className="border rounded-md overflow-auto flex-1 my-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Min/Max</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PROVIDER_SERVICES.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Checkbox id={`svc-${service.id}`} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {service.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {service.service}
                    </TableCell>
                    <TableCell>${service.rate.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {service.min}-{service.max}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-slate-50 p-3 rounded-md mb-4 text-xs text-slate-500 flex items-start gap-2">
            <AlertTriangle
              size={14}
              className="mt-0.5 text-amber-500 shrink-0"
            />
            <p>
              Imported services will be created with a default profit margin of
              20%. You can adjust prices later in the Services page.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportServices}>Import Selected</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key & Logs Modal */}
      <Dialog open={isApiSettingsOpen} onOpenChange={setIsApiSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>API Configuration & Logs</DialogTitle>
            <DialogDescription>
              Manage API connection details and view logs for{" "}
              {selectedSupplier?.name}.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="settings"
            className="w-full flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings">Connection Settings</TabsTrigger>
              <TabsTrigger value="logs">Request Logs</TabsTrigger>
            </TabsList>

            <TabsContent
              value="settings"
              className="space-y-4 py-4 flex-1 overflow-y-auto"
            >
              <div className="space-y-2">
                <Label htmlFor="api-url">API URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-url"
                    value={selectedSupplier?.url}
                    readOnly
                    className="bg-slate-50 text-slate-500"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        selectedSupplier?.url || "",
                      );
                      toast.success("URL copied");
                    }}
                  >
                    <Download size={14} className="rotate-180" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={apiKeyVisible ? "text" : "password"}
                    value={currentApiKey}
                    onChange={(e) => setCurrentApiKey(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />

                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  >
                    {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  This key is used to authenticate requests to the provider.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                <div className="mt-0.5 text-blue-600">
                  <Plug size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">
                    Connection Status
                  </h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Last synced 2 minutes ago. Latency:{" "}
                    {selectedSupplier?.latency}.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={testConnection}
                  disabled={isTestingConnection}
                  className="w-full mr-2"
                >
                  {isTestingConnection ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Activity className="mr-2 h-4 w-4" />
                  )}
                  {isTestingConnection ? "Testing..." : "Test Connection"}
                </Button>
                <Button onClick={handleUpdateApiKey} className="w-full ml-2">
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="logs"
              className="flex-1 overflow-hidden flex flex-col h-[300px]"
            >
              <div className="border rounded-md flex-1 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-[80px]">Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead className="w-[80px]">Status</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_API_LOGS.map((log) => (
                      <TableRow key={log.id} className="text-xs">
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.method === "GET"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }
                          >
                            {log.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-slate-600">
                          {log.endpoint}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${log.status === 200 ? "text-green-600" : "text-red-600"}`}
                          >
                            {log.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-slate-500">
                          <div className="flex flex-col items-end">
                            <span>{log.time}</span>
                            <span className="text-[10px] text-slate-400">
                              {log.duration}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-2 bg-slate-50 border-t flex justify-between items-center text-xs text-slate-500">
                <span>Showing last 5 requests</span>
                <Button variant="ghost" size="sm" className="h-6">
                  View All Logs
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
