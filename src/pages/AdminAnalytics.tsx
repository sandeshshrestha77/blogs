
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";
import { BarChart3, TrendingUp, Eye, MessageSquare, FileText, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Track performance and engagement metrics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as 'week' | 'month' | 'year')}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(v) => setChartType(v as 'bar' | 'line')}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
                  <Eye className="h-full w-full text-blue-500" />
                </div>
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Total Views</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalViews.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-medium text-green-500">+12.5%</span>
                      <span className="text-gray-500 ml-1">vs last {timeRange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
                  <FileText className="h-full w-full text-purple-500" />
                </div>
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Total Posts</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{posts.length}</h3>
                    <div className="mt-4 flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-700 font-medium">
                        {Math.max(1, Math.round(posts.length / 4))} posts/month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
                  <MessageSquare className="h-full w-full text-green-500" />
                </div>
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Total Comments</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalComments.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-700 font-medium">
                        {posts.length ? (totalComments / posts.length).toFixed(1) : 0} comments/post
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Post Performance</CardTitle>
                      <CardDescription>Views and comments per post</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {posts.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500">No post data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart
                            data={viewData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                              }} 
                            />
                            <Legend />
                            <Bar dataKey="views" fill="#4169E1" name="Views" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="comments" fill="#8B5CF6" name="Comments" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : (
                          <LineChart
                            data={viewData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                              }} 
                            />
                            <Legend />
                            <Line type="monotone" dataKey="views" stroke="#4169E1" name="Views" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="comments" stroke="#8B5CF6" name="Comments" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Category Distribution</CardTitle>
                      <CardDescription>Posts by category</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                          <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            width={100}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="posts" fill="#10B981" name="Posts" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-800">Growth Trend</CardTitle>
                    <CardDescription>Post views over time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
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
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#4169E1" 
                          activeDot={{ r: 8 }} 
                          name="Views"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="comments" 
                          stroke="#8B5CF6" 
                          name="Comments"
                          strokeWidth={2}
                        />
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
                className="border-gray-200 text-primary hover:bg-primary/5 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
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
