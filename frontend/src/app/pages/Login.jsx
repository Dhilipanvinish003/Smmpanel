import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:5001/api"
  : "https://admin.tikytop.com/api";

export function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

        const response = await fetch(
            `${API_BASE}/auth/login`,
        
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            }
        );

        let data = {};

        try {
            data = await response.json();
        } catch (err) {
            console.log("Invalid JSON");
        }

        if (!response.ok || !data.success) {

            toast.error(
                data.message || "Login Failed"
            );

            setLoading(false);

            return;
        }

        sessionStorage.setItem("token", data.token);

        sessionStorage.setItem(
        "user",
         JSON.stringify(data.admin)
         );

        localStorage.setItem(
            "isAuthenticated",
            "true"
        );

        toast.success("Login Successful");

        window.location.href = "/";

    } catch (error) {

        console.log(error);

        toast.error("Server Error");

    } finally {

        setLoading(false);

    }
};
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff8f8] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[100px] opacity-60 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[100px] opacity-60 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md px-4 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-2xl shadow-xl shadow-pink-500/30 mb-4 motion-safe:animate-bounce-slow">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-pink-950">Welcome Back</h1>
                    <p className="text-pink-700/70 mt-2">Manage your SMM empire with ease</p>
                </div>

                <Card className="border-pink-100 shadow-2xl shadow-pink-200/50 bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit}
                         autoComplete="off"
                         className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-pink-900 font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@smm.com"
                                        autoComplete="off"
                                        required
                                        className="pl-10 border-pink-100 focus:border-pink-500 focus:ring-pink-500 transition-all"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-pink-900 font-medium">Password</Label>
                                    <a href="#" className="text-xs text-pink-500 hover:text-pink-700 transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 border-pink-100 focus:border-pink-500 focus:ring-pink-500 transition-all"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-pink-100"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/80 px-2 text-pink-400">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 mt-6">
                                <Button variant="outline" className="h-11 border-pink-100 text-pink-950 hover:bg-pink-50 hover:border-pink-300 transition-all flex items-center justify-center gap-2">
                                    <Github size={20} /> GitHub
                                </Button>
                            </div>
                        </div>

                        <p className="text-center mt-8 text-sm text-pink-800/60">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-pink-600 font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                <p className="text-center mt-8 text-xs text-pink-400">
                    &copy; 2026 Global SMM Reseller Platform. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
