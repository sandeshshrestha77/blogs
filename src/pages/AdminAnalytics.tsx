
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";
import { BarChart3, TrendingUp, Eye, MessageSquare, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  views: number;
  category: string;
  created_at: string;
  comments: { count: number }[];
}

const AdminAnalytics = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          slug,
          views,
          category,
          created_at,
          comments(count)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      
      if (data) {
        setPosts(data as Post[]);
      }
    } catch (error) {
      console.error("Error fetching posts data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Generate data for charts based on the real posts
  const generateViewData = () => {
    return posts.slice(0, 10).map((post, index) => {
      const createdDate = new Date(post.created_at);
      return {
        name: post.title?.substring(0, 15) + "..." || `Post ${index + 1}`,
        views: post.views || 0,
        comments: post.comments?.[0]?.count || 0,
        date: createdDate.toLocaleDateString()
      };
    });
  };

  const generateCategoryData = () => {
    const categories: {[key: string]: number} = {};
    
    posts.forEach(post => {
      const category = post.category || "Uncategorized";
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    });
    
    return Object.keys(categories).map(category => ({
      name: category,
      posts: categories[category]
    }));
  };

  const viewData = generateViewData();
  const categoryData = generateCategoryData();

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  
  const totalComments = posts.reduce((sum, post) => {
    return sum + (post.comments?.[0]?.count || 0);
  }, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-primary" />
              Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Track performance and engagement metrics
            </p>
          </div>
          <Tabs 
            value={timeRange} 
            onValueChange={(v) => setTimeRange(v as 'week' | 'month' | 'year')}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 md:w-[300px]">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="h-64 w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Views</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalViews}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Compared to last month</div>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-500">+12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Posts</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{posts.length}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Publishing frequency</div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {Math.round(posts.length / 4)} posts/month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Comments</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalComments}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Engagement rate</div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-gray-700">
                        {posts.length ? (totalComments / posts.length).toFixed(1) : 0} comments/post
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle>Post Views</CardTitle>
                  <CardDescription>Views per post over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    {posts.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500">No post data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={viewData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="views" fill="#3B82F6" name="Views" />
                          <Bar dataKey="comments" fill="#8B5CF6" name="Comments" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Posts by category</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    {categoryData.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500">No category data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            width={100}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="posts" fill="#10B981" name="Posts" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-0">
                <CardTitle>Growth Trend</CardTitle>
                <CardDescription>Post views over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6">
                <div className="h-[300px] w-full">
                  {viewData.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-gray-500">No trend data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={viewData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="#3B82F6" activeDot={{ r: 8 }} name="Views" />
                        <Line type="monotone" dataKey="comments" stroke="#8B5CF6" name="Comments" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-4">
              <Button 
                onClick={fetchPosts} 
                variant="outline" 
                className="text-primary"
              >
                Refresh Data
              </Button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
