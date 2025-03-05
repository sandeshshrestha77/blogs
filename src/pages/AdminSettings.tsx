
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // General site settings
  const [siteName, setSiteName] = useState("My Blog");
  const [siteDescription, setSiteDescription] = useState("A blog about technology, design, and more.");
  
  // User settings
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  
  // Default post settings
  const [defaultCategory, setDefaultCategory] = useState("Technology");
  const [seoDescription, setSeoDescription] = useState("This is a default SEO description for new posts.");
  
  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally save these settings to Supabase or another backend
      // For now we'll just show a success toast
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
            <SettingsIcon className="mr-2 h-6 w-6 text-[#2271b1]" />
            Settings
          </h1>
          <p className="text-gray-600">
            Configure your blog settings
          </p>
        </div>
        
        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Settings Card */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure the general settings for your blog</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName" 
                      value={siteName} 
                      onChange={(e) => setSiteName(e.target.value)} 
                      placeholder="My Blog" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea 
                      id="siteDescription" 
                      value={siteDescription} 
                      onChange={(e) => setSiteDescription(e.target.value)} 
                      placeholder="A brief description of your blog"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle>Default Post Settings</CardTitle>
                  <CardDescription>Configure defaults for new blog posts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCategory">Default Category</Label>
                    <Input 
                      id="defaultCategory" 
                      value={defaultCategory} 
                      onChange={(e) => setDefaultCategory(e.target.value)} 
                      placeholder="Technology"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">Default SEO Description</Label>
                    <Textarea 
                      id="seoDescription" 
                      value={seoDescription} 
                      onChange={(e) => setSeoDescription(e.target.value)} 
                      placeholder="Default SEO description for new posts"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Profile Settings Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)} 
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="your.email@example.com"
                      disabled
                    />
                    <p className="text-xs text-gray-500">Email address cannot be changed</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Notification Settings Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotif">Email Notifications</Label>
                      <p className="text-xs text-gray-500">Receive email notifications</p>
                    </div>
                    <Switch 
                      id="emailNotif"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="commentNotif">Comment Notifications</Label>
                      <p className="text-xs text-gray-500">Get notified on new comments</p>
                    </div>
                    <Switch 
                      id="commentNotif"
                      checked={commentNotifications}
                      onCheckedChange={setCommentNotifications}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              className="bg-[#2271b1] hover:bg-[#135e96]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
