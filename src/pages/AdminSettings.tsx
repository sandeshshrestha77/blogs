
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

  const [siteName, setSiteName] = useState("My Blog");
  const [siteDescription, setSiteDescription] = useState("A blog about technology, design, and more.");
 
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);

  const [defaultCategory, setDefaultCategory] = useState("Technology");
  const [seoDescription, setSeoDescription] = useState("This is a default SEO description for new posts.");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        if (user?.email) {
          setEmail(user.email);
          setDisplayName(user.email.split('@')[0] || "");
        }
        
        // Load site settings
        const { data: siteData, error: siteError } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        
        if (siteError) {
          if (siteError.code !== 'PGRST116') { // Not found error code
            console.error('Error loading site settings:', siteError);
          }
        } else if (siteData) {
          setSiteName(siteData.site_name || "My Blog");
          setSiteDescription(siteData.site_description || "A blog about technology, design, and more.");
        }

        if (user?.id) {
          // Load user settings
          const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (userError) {
            if (userError.code !== 'PGRST116') {
              console.error('Error loading user settings:', userError);
            }
          } else if (userData) {
            setDisplayName(userData.display_name || user.email?.split('@')[0] || "");
            setEmailNotifications(userData.email_notifications !== undefined ? userData.email_notifications : true);
            setCommentNotifications(userData.comment_notifications !== undefined ? userData.comment_notifications : true);
          }

          // Load post defaults
          const { data: postData, error: postError } = await supabase
            .from('post_defaults')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (postError) {
            if (postError.code !== 'PGRST116') {
              console.error('Error loading post defaults:', postError);
            }
          } else if (postData) {
            setDefaultCategory(postData.default_category || "Technology");
            setSeoDescription(postData.seo_description || "This is a default SEO description for new posts.");
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user?.id) {
      toast.error("You must be logged in to save settings");
      return;
    }
    
    try {
      setIsLoading(true);

      // Save site settings
      const { data: existingSiteSettings } = await supabase
        .from('site_settings')
        .select('id')
        .single();
      
      const { error: siteError } = await supabase
        .from('site_settings')
        .upsert({
          id: existingSiteSettings?.id || undefined,
          site_name: siteName,
          site_description: siteDescription
        });
      
      if (siteError) throw siteError;

      // Save user settings
      const { error: userError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          display_name: displayName,
          email_notifications: emailNotifications,
          comment_notifications: commentNotifications
        }, { 
          onConflict: 'user_id' 
        });
      
      if (userError) throw userError;

      // Save post defaults
      const { error: postError } = await supabase
        .from('post_defaults')
        .upsert({
          user_id: user.id,
          default_category: defaultCategory,
          seo_description: seoDescription
        }, { 
          onConflict: 'user_id'
        });
      
      if (postError) throw postError;

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      {isLoading && !user ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-2">
              <SettingsIcon className="mr-2 h-5 md:h-6 w-5 md:w-6 text-primary" />
              Settings
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Configure your blog settings
            </p>
          </div>
          
          <form onSubmit={handleSaveSettings}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-gray-800 text-lg md:text-xl">General Settings</CardTitle>
                    <CardDescription className="text-gray-600">Configure the general settings for your blog</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="text-gray-700">Site Name</Label>
                      <Input 
                        id="siteName" 
                        value={siteName} 
                        onChange={(e) => setSiteName(e.target.value)} 
                        placeholder="My Blog" 
                        className="text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription" className="text-gray-700">Site Description</Label>
                      <Textarea 
                        id="siteDescription" 
                        value={siteDescription} 
                        onChange={(e) => setSiteDescription(e.target.value)} 
                        placeholder="A brief description of your blog"
                        rows={3}
                        className="text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-gray-800 text-lg md:text-xl">Default Post Settings</CardTitle>
                    <CardDescription className="text-gray-600">Configure defaults for new blog posts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCategory" className="text-gray-700">Default Category</Label>
                      <Input 
                        id="defaultCategory" 
                        value={defaultCategory} 
                        onChange={(e) => setDefaultCategory(e.target.value)} 
                        placeholder="Technology"
                        className="text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription" className="text-gray-700">Default SEO Description</Label>
                      <Textarea 
                        id="seoDescription" 
                        value={seoDescription} 
                        onChange={(e) => setSeoDescription(e.target.value)} 
                        placeholder="Default SEO description for new posts"
                        rows={3}
                        className="text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-gray-800 text-lg md:text-xl">Profile Settings</CardTitle>
                    <CardDescription className="text-gray-600">Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-gray-700">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        placeholder="Your Name"
                        className="text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email} 
                        disabled
                        className="text-gray-800 placeholder:text-gray-400 bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Email address cannot be changed</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-gray-800 text-lg md:text-xl">Notification Settings</CardTitle>
                    <CardDescription className="text-gray-600">Configure your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotif" className="text-gray-700">Email Notifications</Label>
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
                        <Label htmlFor="commentNotif" className="text-gray-700">Comment Notifications</Label>
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
                className="bg-primary hover:bg-primary/90 text-white"
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
      )}
    </AdminLayout>
  );
};

export default AdminSettings;
