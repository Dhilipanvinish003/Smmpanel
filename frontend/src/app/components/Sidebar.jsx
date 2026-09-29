import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Layers,
  ShoppingCart,
  Wallet,
  Settings,
  LifeBuoy,
  LogOut,
  ShieldCheck,
  DollarSign,
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Truck, label: "Suppliers", path: "/suppliers" },
  { icon: DollarSign, label: "Price Set", path: "/priceset" },
  { icon: Layers, label: "Services", path: "/services" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: Wallet, label: "Financial", path: "/financial" },
  { icon: LifeBuoy, label: "Support", path: "/support" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Cracker = ({ x, y }) => {
  const colors = [
    "#FF69B4",
    "#FF1493",
    "#C71585",
    "#DB7093",
    "#FFB6C1",
    "#FFFFFF",
  ];
  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 20 + Math.random() * 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.8 }}
            animate={{
              x: tx,
              y: ty,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: `0 0 4px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

export function Sidebar() {
  const navigate = useNavigate();
  const [crackers, setCrackers] = useState([]);
  const nextId = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const dist = Math.hypot(
      e.clientX - lastPos.current.x,
      e.clientY - lastPos.current.y,
    );
    if (dist > 30) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = nextId.current++;
      setCrackers((prev) => [...prev.slice(-10), { id, x, y }]);
      lastPos.current = { x: e.clientX, y: e.clientY };

      setTimeout(() => {
        setCrackers((prev) => prev.filter((c) => c.id !== id));
      }, 600);
    }
  };

 const handleSignOut = () => {

  sessionStorage.removeItem("isAuthenticated");

  sessionStorage.removeItem("user");

  sessionStorage.removeItem("token");

  sessionStorage.clear();

  toast.info("Signed out successfully");

  navigate("/login");

};

let user = {
  name: "Super Admin",
  email: "Tikytop@gmail.com",
};

try {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  if (storedUser) {
    user = {
      name: storedUser.name || "Super Admin",
      email: storedUser.email || "Tikytop@gmail.com",
    };
  }
} catch (error) {
  console.log("User parse error");
}
  return (
    <div
      className="w-64 h-screen bg-[#ffe4e1] text-slate-800 flex flex-col fixed left-0 top-0 border-r border-pink-200 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {crackers.map((cracker) => (
          <Cracker key={cracker.id} x={cracker.x} y={cracker.y} />
        ))}
      </AnimatePresence>

      <div className="p-6 border-b border-pink-200 flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight text-pink-950">
            SMM Admin
          </h2>
          <p className="text-xs text-pink-700">Pro Reseller Panel</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 relative z-10">
        <div className="px-3 mb-2 text-xs font-semibold text-pink-800/60 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none",
                isActive
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/25"
                  : "text-pink-900/70 hover:text-pink-950 hover:bg-white/60",
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-pink-200 relative z-10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/50 mb-3 border border-pink-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-pink-950 truncate">
              {user.name}
            </p>
            <p className="text-xs text-pink-700/80 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-pink-700/80 hover:text-red-500 transition-colors group cursor-pointer"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

