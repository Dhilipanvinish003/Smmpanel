import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  UserPlus,
  Shield,
  Wallet,
  Ban,
  CheckCircle,
  Filter,
  Mail,
  Lock,
  User,
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

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    balance: 50.0,
    status: "Active",
    joined: "2023-10-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@agency.com",
    role: "Reseller",
    balance: 1250.0,
    status: "Active",
    joined: "2023-09-15",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@spam.net",
    role: "User",
    balance: 0.0,
    status: "Suspended",
    joined: "2023-11-20",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@vip.com",
    role: "VIP",
    balance: 540.2,
    status: "Active",
    joined: "2023-08-05",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "rob@test.com",
    role: "User",
    balance: 10.0,
    status: "Active",
    joined: "2023-12-01",
  },
];

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState("All");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
    toast.success(`User status updated to ${newStatus}`);
  };

  const handleAddBalance = (id) => {
    toast.info(`Balance adjustment for user #${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">
            Manage users, balances, and permissions.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus size={18} className="mr-2" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user manually to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3 relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input id="name" placeholder="Full Name" className="pl-9" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3 relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select defaultValue="User">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Reseller">Reseller</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => toast.success("User created successfully!")}
              >
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 max-w-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Reseller">Reseller</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">#{user.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-slate-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.role === "Reseller"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : user.role === "VIP"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-slate-700">
                  ${user.balance.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status === "Active" ? (
                      <CheckCircle size={12} className="mr-1" />
                    ) : (
                      <Ban size={12} className="mr-1" />
                    )}
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {user.joined}
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
                      <DropdownMenuItem
                        onClick={() => handleAddBalance(user.id)}
                      >
                        <Wallet size={16} className="mr-2" /> Add Balance
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield size={16} className="mr-2" /> Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, user.status)}
                        className={
                          user.status === "Active"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {user.status === "Active" ? (
                          <>
                            <Ban size={16} className="mr-2" /> Suspend User
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} className="mr-2" /> Activate
                            User
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
