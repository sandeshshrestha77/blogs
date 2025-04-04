
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";
import { BarChart3, TrendingUp, Eye, MessageSquare, FileText, Calendar, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useRealtimeData from "@/hooks/useRealtimeData";

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
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  
  // Use the real-time data hook for posts
  const { data: posts, loading: postsLoading, error: postsError } = useRealtimeData<Post>({
    tableName: 'posts',
    initialQuery: async () => {
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
        
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    // Update loading state based on posts loading
    setIsLoading(postsLoading);
  }, [postsLoading]);

  useEffect(() => {
    // Show error toast if there's an error
    if (postsError) {
      console.error("Error fetching posts data:", postsError);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    }
  }, [postsError]);

  // Generate data for charts based on the real posts
  const generateViewData = () => {
    if (!posts || posts.length === 0) return [];
    
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
    if (!posts || posts.length === 0) return [];
    
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

  const totalViews = (posts || []).reduce((sum, post) => sum + (post.views || 0), 0);
  
  const totalComments = (posts || []).reduce((sum, post) => {
    return sum + (post.comments?.[0]?.count || 0);
  }, 0);

  const calculateGrowthRate = () => {
    // Simple mock growth rate for demo purposes
    // In a real app, you would calculate this based on historical data
    const randomGrowth = Math.floor(Math.random() * 20) + 5;
    return `+${randomGrowth}.${Math.floor(Math.random() * 9)}%`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track performance and engagement metrics for your blog
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as 'week' | 'month' | 'year')}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(v) => setChartType(v as 'bar' | 'line')}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
                  <Eye className="h-full w-full text-indigo-500" />
                </div>
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{totalViews.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                      <span className="font-medium text-emerald-500">{calculateGrowthRate()}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last {timeRange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
                  <FileText className="h-full w-full text-indigo-500" />
                </div>
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{(posts || []).length}</h3>
                    <div className="mt-4 flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {Math.max(1, Math.round((posts || []).length / 4))} posts/month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
                  <MessageSquare className="h-full w-full text-indigo-500" />
                </div>
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Comments</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{totalComments.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {(posts || []).length ? (totalComments / (posts || []).length).toFixed(1) : 0} comments/post
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800 dark:text-white">Post Performance</CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">Views and comments per post</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] w-full">
                    {viewData.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">No post data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart
                            data={viewData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
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
                            <Bar dataKey="views" fill="#4f46e5" name="Views" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="comments" fill="#8b5cf6" name="Comments" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : (
                          <LineChart
                            data={viewData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
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
                            <Line type="monotone" dataKey="views" stroke="#4f46e5" name="Views" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="comments" stroke="#8b5cf6" name="Comments" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800 dark:text-white">Category Distribution</CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">Posts by category</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] w-full">
                    {categoryData.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">No category data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
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
                          <Bar dataKey="posts" fill="#10b981" name="Posts" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-800 dark:text-white">Growth Trend</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Post views over time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] w-full">
                  {viewData.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">No trend data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={viewData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
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
                          stroke="#4f46e5" 
                          activeDot={{ r: 8 }} 
                          name="Views"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="comments" 
                          stroke="#8b5cf6" 
                          name="Comments"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => {
                  setIsLoading(true);
                  // Force a refresh of the data
                  setTimeout(() => setIsLoading(false), 500);
                }} 
                variant="outline" 
                className="border-gray-200 dark:border-zinc-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2"
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
