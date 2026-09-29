import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Suppliers } from "./pages/Suppliers";
import { Services } from "./pages/Services";
import { Orders } from "./pages/Orders";
import { Finance } from "./pages/Finance";
import { Support } from "./pages/Support";
import { Settings } from "./pages/Settings";
import { PriceSet } from "./pages/priceset";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const RocketExplosion = ({ x, y }) => {
  const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
  ];
  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: x, top: y }}
    >
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const velocity = 60 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{
              x: tx,
              y: ty,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

function ProtectedRoute() {
 const token = sessionStorage.getItem("token");
  return token
    ? <Layout />
    : <Navigate to="/login" replace />;
}

function Layout() {
  const [explosions, setExplosions] = useState([]);
  const [nextId, setNextId] = useState(0);

  const handleGlobalClick = (e) => {
    const target = e.target;
    const clickable = target.closest(
      'button, a, [role="button"], .cursor-pointer',
    );
    if (clickable) {
      const x = e.clientX;
      const y = e.clientY;
      const id = nextId;
      setNextId((prev) => prev + 1);
      setExplosions((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setExplosions((prev) => prev.filter((e) => e.id !== id));
      }, 1000);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 overflow-hidden"
     onClick={handleGlobalClick}
    >
      <AnimatePresence>
        {explosions.map((explosion) => (
          <RocketExplosion key={explosion.id} x={explosion.x} y={explosion.y} />
        ))}
      </AnimatePresence>

      <Sidebar />
      <div className="flex-1 ml-64 p-6 overflow-x-hidden">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/priceset" element={<PriceSet />} />
          <Route path="/financial" element={<Finance />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

