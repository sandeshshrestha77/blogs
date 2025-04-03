
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { Settings as SettingsIcon, Save, User, Bell, FileText, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      const { data: siteSettingsExists } = await supabase
        .from('site_settings')
        .select('id');
      
      if (siteSettingsExists && siteSettingsExists.length > 0) {
        // Update existing record
        const { error: siteError } = await supabase
          .from('site_settings')
          .update({
            site_name: siteName,
            site_description: siteDescription
          })
          .eq('id', siteSettingsExists[0].id);
        
        if (siteError) throw siteError;
      } else {
        // Insert new record
        const { error: siteError } = await supabase
          .from('site_settings')
          .insert({
            site_name: siteName,
            site_description: siteDescription
          });
        
        if (siteError) throw siteError;
      }

      // Save user settings
      const { data: userSettingsExists } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id);
      
      if (userSettingsExists && userSettingsExists.length > 0) {
        // Update existing record
        const { error: userError } = await supabase
          .from('user_settings')
          .update({
            display_name: displayName,
            email_notifications: emailNotifications,
            comment_notifications: commentNotifications
          })
          .eq('user_id', user.id);
        
        if (userError) throw userError;
      } else {
        // Insert new record
        const { error: userError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            display_name: displayName,
            email_notifications: emailNotifications,
            comment_notifications: commentNotifications
          });
        
        if (userError) throw userError;
      }

      // Save post defaults
      const { data: postDefaultsExists } = await supabase
        .from('post_defaults')
        .select('id')
        .eq('user_id', user.id);
      
      if (postDefaultsExists && postDefaultsExists.length > 0) {
        // Update existing record
        const { error: postError } = await supabase
          .from('post_defaults')
          .update({
            default_category: defaultCategory,
            seo_description: seoDescription
          })
          .eq('user_id', user.id);
        
        if (postError) throw postError;
      } else {
        // Insert new record
        const { error: postError } = await supabase
          .from('post_defaults')
          .insert({
            user_id: user.id,
            default_category: defaultCategory,
            seo_description: seoDescription
          });
        
        if (postError) throw postError;
      }

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-blue-400" />
              Settings
            </h1>
            <p className="text-zinc-400 mt-1">
              Manage your account preferences and blog configuration
            </p>
          </div>
          
          <form onSubmit={handleSaveSettings}>
            <Tabs defaultValue="site" className="mb-8">
              <TabsList className="mb-6 bg-zinc-800/50">
                <TabsTrigger value="site" className="flex items-center gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=inactive]:text-zinc-400">
                  <Globe className="h-4 w-4" />
                  <span>Site</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=inactive]:text-zinc-400">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=inactive]:text-zinc-400">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="defaults" className="flex items-center gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=inactive]:text-zinc-400">
                  <FileText className="h-4 w-4" />
                  <span>Post Defaults</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="site">
                <Card className="border-none bg-zinc-900 shadow-lg shadow-black/20">
                  <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-xl text-white">Site Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Configure the general settings for your blog</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="text-zinc-300">Site Name</Label>
                      <Input 
                        id="siteName" 
                        value={siteName} 
                        onChange={(e) => setSiteName(e.target.value)} 
                        placeholder="My Blog" 
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription" className="text-zinc-300">Site Description</Label>
                      <Textarea 
                        id="siteDescription" 
                        value={siteDescription} 
                        onChange={(e) => setSiteDescription(e.target.value)} 
                        placeholder="A brief description of your blog"
                        rows={3}
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile">
                <Card className="border-none bg-zinc-900 shadow-lg shadow-black/20">
                  <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-xl text-white">Profile Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 bg-zinc-800/50 rounded-lg">
                      <Avatar className="h-16 w-16 border-2 border-zinc-700 shadow-md">
                        <AvatarFallback className="bg-blue-600 text-white text-xl">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium text-white">{displayName || "User"}</p>
                        <p className="text-sm text-zinc-400">{email}</p>
                      </div>
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-zinc-300">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        placeholder="Your Name"
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email} 
                        disabled
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-500"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Email address cannot be changed</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card className="border-none bg-zinc-900 shadow-lg shadow-black/20">
                  <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-xl text-white">Notification Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Configure your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-white">Email Notifications</p>
                        <p className="text-sm text-zinc-400">Receive blog updates via email</p>
                      </div>
                      <Switch 
                        id="emailNotif"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-white">Comment Notifications</p>
                        <p className="text-sm text-zinc-400">Get notified when someone comments on your posts</p>
                      </div>
                      <Switch 
                        id="commentNotif"
                        checked={commentNotifications}
                        onCheckedChange={setCommentNotifications}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="defaults">
                <Card className="border-none bg-zinc-900 shadow-lg shadow-black/20">
                  <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-xl text-white">Default Post Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Configure defaults for new blog posts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCategory" className="text-zinc-300">Default Category</Label>
                      <Input 
                        id="defaultCategory" 
                        value={defaultCategory} 
                        onChange={(e) => setDefaultCategory(e.target.value)} 
                        placeholder="Technology"
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription" className="text-zinc-300">Default SEO Description</Label>
                      <Textarea 
                        id="seoDescription" 
                        value={seoDescription} 
                        onChange={(e) => setSeoDescription(e.target.value)} 
                        placeholder="Default SEO description for new posts"
                        rows={3}
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
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
