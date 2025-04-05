
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { Settings as SettingsIcon, Save, User, FileText, Shield, Lock, Palette, Globe, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
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
        
        if (user?.id) {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                <SettingsIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage your account preferences and blog configuration
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSaveSettings}>
            <Tabs defaultValue="profile" className="mb-8">
              <TabsList className="mb-6 bg-white dark:bg-zinc-800 p-1 border border-gray-200 dark:border-zinc-700 rounded-lg">
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="defaults" className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span>Post Defaults</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm">
                  <CardHeader className="border-b border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80">
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-indigo-500" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-700">
                      <Avatar className="h-16 w-16 border-2 border-indigo-100 dark:border-indigo-900 shadow-md">
                        <AvatarFallback className="bg-indigo-600 text-white text-xl">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">{displayName || "User"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email} 
                        disabled
                        className="bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email address cannot be changed</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="defaults">
                <Card className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm">
                  <CardHeader className="border-b border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80">
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      Default Post Settings
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Configure defaults for new blog posts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCategory" className="text-gray-700 dark:text-gray-300">Default Category</Label>
                      <Input 
                        id="defaultCategory" 
                        value={defaultCategory} 
                        onChange={(e) => setDefaultCategory(e.target.value)} 
                        placeholder="Technology"
                        className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus-visible:ring-indigo-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription" className="text-gray-700 dark:text-gray-300">Default SEO Description</Label>
                      <Textarea 
                        id="seoDescription" 
                        value={seoDescription} 
                        onChange={(e) => setSeoDescription(e.target.value)} 
                        placeholder="Default SEO description for new posts"
                        rows={3}
                        className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus-visible:ring-indigo-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6"
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
