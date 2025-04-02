
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Bell, 
  Globe, 
  Shield, 
  LogOut, 
  RefreshCw,
  Save,
  Trash2,
  Upload
} from "lucide-react";

const AdminSettings = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({
    displayName: '',
    emailNotifications: true,
    commentNotifications: true
  });
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteDescription: ''
  });
  
  const [postDefaults, setPostDefaults] = useState({
    defaultCategory: '',
    seoDescription: ''
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      
      try {
        // Fetch user settings
        if (user) {
          const { data: userSettingsData, error: userSettingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (!userSettingsError && userSettingsData) {
            setUserSettings({
              displayName: userSettingsData.display_name || user?.email?.split('@')[0] || '',
              emailNotifications: userSettingsData.email_notifications ?? true,
              commentNotifications: userSettingsData.comment_notifications ?? true
            });
          }
          
          // Fetch post defaults
          const { data: postDefaultsData, error: postDefaultsError } = await supabase
            .from('post_defaults')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (!postDefaultsError && postDefaultsData) {
            setPostDefaults({
              defaultCategory: postDefaultsData.default_category || 'Technology',
              seoDescription: postDefaultsData.seo_description || ''
            });
          }
        }
        
        // Fetch global site settings
        const { data: siteSettingsData, error: siteSettingsError } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        
        if (!siteSettingsError && siteSettingsData) {
          setSiteSettings({
            siteName: siteSettingsData.site_name || 'My Blog',
            siteDescription: siteSettingsData.site_description || ''
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [user]);
  
  const saveUserSettings = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          display_name: userSettings.displayName,
          email_notifications: userSettings.emailNotifications,
          comment_notifications: userSettings.commentNotifications
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast.success('User settings saved successfully');
    } catch (error) {
      console.error('Error saving user settings:', error);
      toast.error('Failed to save user settings');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const saveSiteSettings = async () => {
    setSaveLoading(true);
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: siteSettings.siteName,
          site_description: siteSettings.siteDescription
        })
        .eq('id', 1);
      
      if (error) throw error;
      
      toast.success('Site settings saved successfully');
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast.error('Failed to save site settings');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const savePostDefaults = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      const { error } = await supabase
        .from('post_defaults')
        .upsert({
          user_id: user.id,
          default_category: postDefaults.defaultCategory,
          seo_description: postDefaults.seoDescription
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast.success('Post defaults saved successfully');
    } catch (error) {
      console.error('Error saving post defaults:', error);
      toast.error('Failed to save post defaults');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
          <p className="text-sm text-zinc-400">
            Manage your account and site settings
          </p>
        </header>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-zinc-800 border border-zinc-700">
            <TabsTrigger value="account" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100">
              Account
            </TabsTrigger>
            <TabsTrigger value="site" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100">
              Site Settings
            </TabsTrigger>
            <TabsTrigger value="post" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100">
              Post Defaults
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription className="text-zinc-400">
                  Manage your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-zinc-700 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <p className="text-zinc-300 font-medium">Profile Photo</p>
                    <p className="text-sm text-zinc-400">
                      This will be displayed on your profile and posts
                    </p>
                  </div>
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-zinc-300">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="displayName"
                      value={userSettings.displayName}
                      onChange={e => setUserSettings({...userSettings, displayName: e.target.value})}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-zinc-200"
                      placeholder="Your display name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 bg-zinc-900 border-zinc-700 text-zinc-400"
                    />
                  </div>
                  <p className="text-xs text-zinc-500">
                    Contact admin to change your email address
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-zinc-300">Notification Settings</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-zinc-400" />
                        <p className="text-sm font-medium text-zinc-300">Email Notifications</p>
                      </div>
                      <p className="text-xs text-zinc-400">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      checked={userSettings.emailNotifications}
                      onCheckedChange={checked => setUserSettings({...userSettings, emailNotifications: checked})}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-zinc-400" />
                        <p className="text-sm font-medium text-zinc-300">Comment Notifications</p>
                      </div>
                      <p className="text-xs text-zinc-400">Receive notifications when someone comments on your posts</p>
                    </div>
                    <Switch
                      checked={userSettings.commentNotifications}
                      onCheckedChange={checked => setUserSettings({...userSettings, commentNotifications: checked})}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-zinc-700 pt-6">
                <Button variant="destructive" onClick={handleLogout} className="bg-red-600/20 text-red-400 hover:bg-red-800/50 hover:text-red-300">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
                <Button onClick={saveUserSettings} disabled={saveLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saveLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="site" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription className="text-zinc-400">
                  Manage your blog's general settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-zinc-300">Site Name</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={e => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-zinc-200"
                      placeholder="My Amazing Blog"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-zinc-300">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={e => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    placeholder="A brief description of your blog..."
                    className="min-h-[100px] bg-zinc-900 border-zinc-700 text-zinc-200"
                  />
                  <p className="text-xs text-zinc-500">
                    This will be used in SEO meta tags and may appear in search engine results
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t border-zinc-700 pt-6">
                <Button onClick={saveSiteSettings} disabled={saveLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saveLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Site Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="post" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <CardHeader>
                <CardTitle>Post Defaults</CardTitle>
                <CardDescription className="text-zinc-400">
                  Configure default settings for new posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCategory" className="text-zinc-300">Default Category</Label>
                  <Input
                    id="defaultCategory"
                    value={postDefaults.defaultCategory}
                    onChange={e => setPostDefaults({...postDefaults, defaultCategory: e.target.value})}
                    className="bg-zinc-900 border-zinc-700 text-zinc-200"
                    placeholder="e.g., Technology, Design, Tutorial"
                  />
                  <p className="text-xs text-zinc-500">
                    This category will be pre-selected when creating new posts
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seoDescription" className="text-zinc-300">Default SEO Description Template</Label>
                  <Textarea
                    id="seoDescription"
                    value={postDefaults.seoDescription}
                    onChange={e => setPostDefaults({...postDefaults, seoDescription: e.target.value})}
                    placeholder="Learn about {title} in this comprehensive guide..."
                    className="min-h-[100px] bg-zinc-900 border-zinc-700 text-zinc-200"
                  />
                  <p className="text-xs text-zinc-500">
                    Use {title} as a placeholder for the post title
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t border-zinc-700 pt-6">
                <Button onClick={savePostDefaults} disabled={saveLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saveLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Post Defaults
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="bg-zinc-800/50 border-zinc-700 text-zinc-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-400" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-4">
              These actions are permanent and cannot be undone. Please be certain.
            </p>
            <Button variant="destructive" className="bg-red-600/20 text-red-400 hover:bg-red-800/50 hover:text-red-300">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
