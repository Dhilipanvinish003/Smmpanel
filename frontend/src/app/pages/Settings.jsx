import React, { useState } from "react";
import { Save, Globe, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";

export function Settings() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500">Configure global platform settings.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save size={18} className="mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="notifications">Notify</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>
                Basic settings for your SMM panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="SMM Panel Pro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency Symbol</Label>
                  <Input id="currency" defaultValue="$" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    defaultValue="support@smmpanel.com"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="maintenance" className="font-medium">
                    Maintenance Mode
                  </Label>
                  <span className="text-xs text-slate-500">
                    Enable to show a maintenance page to users.
                  </span>
                </div>
                <Switch id="maintenance" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Upload your logo and favicon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                  <Globe size={24} className="text-slate-400" />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>
                Configure accepted payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between space-x-4 border p-4 rounded-lg">
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-50 rounded text-blue-700">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">PayPal</h4>
                    <p className="text-xs text-slate-500">
                      Accept payments via PayPal.
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between space-x-4 border p-4 rounded-lg">
                <div className="flex gap-3">
                  <div className="p-2 bg-indigo-50 rounded text-indigo-700">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Stripe</h4>
                    <p className="text-xs text-slate-500">
                      Accept credit cards via Stripe.
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between space-x-4 border p-4 rounded-lg">
                <div className="flex gap-3">
                  <div className="p-2 bg-orange-50 rounded text-orange-700">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Coinbase Commerce</h4>
                    <p className="text-xs text-slate-500">
                      Accept cryptocurrency payments.
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Settings */}
        <TabsContent value="providers" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Global settings for API providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-Sync Services</Label>
                <p className="text-sm text-slate-500 mb-2">
                  Automatically update prices and service details from
                  providers.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Order Overflow</Label>
                <p className="text-sm text-slate-500 mb-2">
                  If a provider fails, automatically try the next cheapest
                  provider.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm font-medium">Disabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure when admins and users receive emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex-1">New User Registration</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">New Order Placed</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">New Support Ticket</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">Provider Balance Low</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Security</CardTitle>
              <CardDescription>Protect the admin panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-slate-500">
                    Require 2FA for all admin logins.
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Allowed IP Addresses</Label>
                <Input placeholder="192.168.1.1, 10.0.0.1" />
                <p className="text-xs text-slate-500">
                  Leave empty to allow all IPs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
