import React, { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  CheckCircle,
  XCircle,
  Send,
  MoreVertical,
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
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

// Mock Data
const MOCK_TICKETS = [
  {
    id: 2401,
    user: "John Doe",
    subject: "Order #85432 not started",
    message:
      "Hi, I placed this order 2 hours ago and it is still pending. Can you check?",
    status: "Open",
    priority: "High",
    date: "2023-10-25 15:30",
    last_reply: "User",
  },
  {
    id: 2402,
    user: "Sarah Williams",
    subject: "Refill request for ID 85400",
    message: "Drops are happening, please refill.",
    status: "Answered",
    priority: "Medium",
    date: "2023-10-25 12:15",
    last_reply: "Admin",
  },
  {
    id: 2403,
    user: "Mike Johnson",
    subject: "Payment not showing up",
    message: "I deposited $50 via Crypto but my balance is still $0.",
    status: "Open",
    priority: "High",
    date: "2023-10-25 16:45",
    last_reply: "User",
  },
  {
    id: 2404,
    user: "Jane Smith",
    subject: "Question about services",
    message: "Do you offer non-drop followers for LinkedIn?",
    status: "Closed",
    priority: "Low",
    date: "2023-10-24 09:20",
    last_reply: "Admin",
  },
  {
    id: 2405,
    user: "Robert Brown",
    subject: "API Connection Error",
    message: "My API calls are returning 403 Forbidden.",
    status: "Open",
    priority: "Medium",
    date: "2023-10-25 10:00",
    last_reply: "User",
  },
];

export function Support() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [replyText, setReplyText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toString().includes(searchTerm) ||
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCloseTicket = (id) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: "Closed" } : t)),
    );
    toast.success(`Ticket #${id} closed`);
  };

  const handleReply = () => {
    if (!selectedTicket) return;
    setTickets(
      tickets.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, status: "Answered", last_reply: "Admin" }
          : t,
      ),
    );
    setReplyText("");
    toast.success("Reply sent successfully");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            <MessageSquare size={12} className="mr-1" /> Open
          </Badge>
        );
      case "Answered":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            <CheckCircle size={12} className="mr-1" /> Answered
          </Badge>
        );
      case "Closed":
        return (
          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200">
            <XCircle size={12} className="mr-1" /> Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50"
          >
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge
            variant="outline"
            className="text-amber-600 border-amber-200 bg-amber-50"
          >
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge
            variant="outline"
            className="text-slate-600 border-slate-200 bg-slate-50"
          >
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-500">Manage user inquiries and issues.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter size={16} className="mr-2" /> Bulk Actions
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search tickets..."
            className="pl-10 max-w-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Answered">Answered</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[300px]">Subject</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => setSelectedTicket(ticket)}
              >
                <TableCell className="font-mono text-slate-500">
                  #{ticket.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">
                    {ticket.subject}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-[280px]">
                    {ticket.message}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                      {ticket.user.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{ticket.user}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell className="text-sm text-slate-500">
                  <div className="flex flex-col">
                    <span>{ticket.date}</span>
                    <span className="text-xs">by {ticket.last_reply}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={16} className="text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <MessageSquare size={16} className="mr-2" /> View &
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCloseTicket(ticket.id)}
                      >
                        <CheckCircle size={16} className="mr-2" /> Mark Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reply Modal */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between mr-4">
              <DialogTitle>Ticket #{selectedTicket?.id}</DialogTitle>
              {selectedTicket && getStatusBadge(selectedTicket.status)}
            </div>
            <DialogDescription className="text-slate-900 font-medium pt-2">
              {selectedTicket?.subject}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-slate-500" />
                <span className="font-semibold text-sm">
                  {selectedTicket?.user}
                </span>
                <span className="text-xs text-slate-400 ml-auto">
                  {selectedTicket?.date}
                </span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {selectedTicket?.message}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Your Reply
              </label>
              <Textarea
                placeholder="Type your response here..."
                className="min-h-[120px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between w-full">
            <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedTicket) handleCloseTicket(selectedTicket.id);
                  setSelectedTicket(null);
                }}
              >
                Close Ticket
              </Button>
              <Button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} className="mr-2" /> Send Reply
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
