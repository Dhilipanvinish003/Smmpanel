import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";

export function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!formData.agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        setLoading(true);

        // Simulate registration
        setTimeout(() => {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user", JSON.stringify({ email: formData.email, name: formData.fullName }));
            toast.success(`Welcome, ${formData.fullName}! Your account has been created.`);
            setLoading(false);
            navigate("/");
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff8f8] relative overflow-hidden py-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[100px] opacity-60 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[100px] opacity-60 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg px-4 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-2xl shadow-xl shadow-pink-500/30 mb-4">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-pink-950">Join the Platform</h1>
                    <p className="text-pink-700/70 mt-2">Start your journey as an SMM reseller</p>
                </div>

                <Card className="border-pink-100 shadow-2xl shadow-pink-200/50 bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-pink-900 font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        className="pl-10 border-pink-100 focus:border-pink-500 focus:ring-pink-500 transition-all"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-pink-900 font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="pl-10 border-pink-100 focus:border-pink-500 focus:ring-pink-500 transition-all"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-pink-900 font-medium">Password</Label>
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
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-pink-900 font-medium">Confirm</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="pl-10 border-pink-100 focus:border-pink-500 focus:ring-pink-500 transition-all"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 pt-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    className="mt-1 border-pink-200 data-[state=checked]:bg-pink-500"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                                />
                                <label
                                    htmlFor="agreeToTerms"
                                    className="text-xs text-pink-700 leading-tight cursor-pointer"
                                >
                                    I agree to the <span className="font-bold text-pink-950">Terms of Service</span> and <span className="font-bold text-pink-950">Privacy Policy</span>.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 group mt-4"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center space-y-4">
                            <div className="flex items-center justify-center gap-4 text-xs text-pink-400">
                                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> Enterprise Security</span>
                                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> Cloud Backup</span>
                            </div>
                        </div>

                        <p className="text-center mt-8 text-sm text-pink-800/60">
                            Already have an account?{" "}
                            <Link to="/login" className="text-pink-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                <p className="text-center mt-8 text-xs text-pink-400">
                    &copy; 2026 Global SMM Reseller Platform. Secure and private.
                </p>
            </motion.div>
        </div>
    );
}
