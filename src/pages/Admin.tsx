import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Pencil, Trash2, Star, StarOff, Eye, MessageSquare, Calendar, FileText, PlusCircle, BarChart3, MoreHorizontal, ChevronUp, ArrowUpRight, Clock, LinkIcon, Users, TrendingUp, Bookmark, Layers } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRealtimeData } from "@/hooks/useRealtimeData";

type Post = Database['public']['Tables']['posts']['Row'] & {
  comments: {
    count: number;
  }[];
};

type Comment = Database['public']['Tables']['comments']['Row'] & {
  posts?: {
    title: string;
    slug: string;
  };
};

const Admin = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingFeature, setIsTogglingFeature] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    data: posts = [],
    loading: postsLoading,
    error: postsError
  } = useRealtimeData<Post>(
    'posts',
    async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          comments(count)
        `)
        .order("created_at", { ascending: false });
      
      return { data, error };
    }
  );
  
  const {
    data: comments = [],
    loading: commentsLoading
  } = useRealtimeData<Comment>(
    'comments',
    async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          posts(title, slug)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      return { data, error };
    }
  );
  
  const totalViews = posts ? posts.reduce((sum, post) => sum + (post.views || 0), 0) : 0;
  const totalComments = posts ? posts.reduce((sum, post) => {
    return sum + (post.comments?.[0]?.count || 0);
  }, 0) : 0;
  const featuredPosts = posts ? posts.filter(p => p.featured).length : 0;

  const handleDelete = async (postId: string) => {
    try {
      setIsDeleting(postId);
      const {
        error
      } = await supabase.from("posts").delete().match({
        id: postId
      });
      if (error) throw error;
      toast({
        title: "Post deleted",
        description: "Post deleted successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Error deleting post",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  const toggleFeaturePost = async (postId: string, currentStatus: boolean) => {
    try {
      setIsTogglingFeature(postId);
      const {
        error
      } = await supabase.from("posts").update({
        featured: !currentStatus
      }).match({
        id: postId
      }).select("featured");
      if (error) throw error;
      toast({
        title: `Post ${!currentStatus ? "featured" : "unfeatured"}`,
        description: `Post ${!currentStatus ? "featured" : "unfeatured"} successfully`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating feature status:", error);
      toast({
        title: "Error",
        description: "Error updating feature status",
        variant: "destructive"
      });
    } finally {
      setIsTogglingFeature(null);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      const {
        error
      } = await supabase.from("comments").delete().match({
        id: commentId
      });
      if (error) throw error;
      toast({
        title: "Comment deleted",
        description: "Comment deleted successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Error deleting comment",
        variant: "destructive"
      });
    }
  };
  
  const renderSkeletonRows = (count: number) => {
    return Array(count).fill(0).map((_, index) => <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-md bg-zinc-800" />
              <Skeleton className="h-4 w-32 bg-zinc-800" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-8 w-24 bg-zinc-800" /></TableCell>
        </TableRow>);
  };
  
  return <AdminLayout>
      <div className="space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Welcome to Your Dashboard
                </h1>
                <p className="text-indigo-100 max-w-2xl">
                  Manage your content, track analytics, and optimize your blog performance from this central hub.
                </p>
              </div>
              <Button onClick={() => navigate("/admin/create")} className="bg-white hover:bg-inwo-50 text-indigo-700 shadow-md transition-all duration-200 transform hover:scale-105">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-none bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Posts</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{posts?.length || 0}</h3>
                    <Badge className="mb-1 bg-blue-100 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50 border">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      9%
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 flex items-center justify-center transition-colors">
                  <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span>Growing steadily</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Views</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalViews}</h3>
                    <Badge className="mb-1 bg-emerald-100 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50 border">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      12%
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 flex items-center justify-center transition-colors">
                  <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                <ArrowUpRight className="h-4 w-4 mr-1 text-emerald-600 dark:text-emerald-400" />
                <span>Up from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Comments</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalComments}</h3>
                    <Badge className="mb-1 bg-purple-100 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50 border">
                      <Clock className="h-3 w-3 mr-1" />
                      Recent
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 flex items-center justify-center transition-colors">
                  <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                <Users className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                <span>Active engagement</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Featured</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{featuredPosts}</h3>
                    <Badge className="mb-1 bg-amber-100 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50 border">
                      <Bookmark className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60 flex items-center justify-center transition-colors">
                  <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="currentColor" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                <LinkIcon className="h-4 w-4 mr-1 text-amber-600 dark:text-amber-400" />
                <span>Promoting top content</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-8 border border-gray-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 shadow-md">
            <CardHeader className="p-6 border-b border-gray-100 dark:border-zinc-700/50 bg-gray-50/80 dark:bg-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-zinc-400">
                    Manage and monitor your blog performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => navigate("/admin/create")} className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <PlusCircle className="h-8 w-8 mb-1" />
                  <span className="font-medium">Create Post</span>
                  <span className="text-xs text-indigo-200">Add new content</span>
                </Button>
                
                <Button onClick={() => navigate("/admin/analytics")} className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <BarChart3 className="h-8 w-8 mb-1" />
                  <span className="font-medium">Analytics</span>
                  <span className="text-xs text-emerald-200">View metrics</span>
                </Button>
                
                <Button onClick={() => navigate("/admin/settings")} variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <LayoutDashboard className="h-8 w-8 mb-1 text-gray-500 dark:text-zinc-400" />
                  <span className="font-medium">Settings</span>
                  <span className="text-xs text-gray-500 dark:text-zinc-500">Update preferences</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4 border border-gray-200 dark:border-zinc-700/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 dark:bg-zinc-800 shadow-md">
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Quick Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-300">
                      Regularly publishing fresh content helps with SEO and reader engagement.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-300">
                      Respond to comments to build community around your blog.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 border-indigo-200 dark:border-indigo-900/40 bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400" onClick={() => navigate("/")}>
                View Your Blog
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6 bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-lg">
            <TabsTrigger value="posts" className="flex-1 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-zinc-400">
              Posts
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex-1 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-zinc-400">
              Recent Comments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            <Card className="border border-gray-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 shadow-md overflow-hidden">
              <CardHeader className="bg-gray-50/80 dark:bg-zinc-800/80 border-b border-gray-100 dark:border-zinc-700/50 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Latest Posts
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-zinc-400">
                      Manage your published content
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate("/admin/create")} className="sm:w-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 border-gray-100 dark:border-zinc-700">
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Title</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Author</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Category</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Date</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Comments</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postsLoading ? renderSkeletonRows(3) : !posts || posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-zinc-400">
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="rounded-full bg-gray-100 dark:bg-zinc-700/50 p-3 mb-4">
                              <FileText className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-lg font-medium mb-2">No posts found</p>
                            <p className="text-sm text-gray-500 dark:text-zinc-500 mb-4">Create your first post to get started</p>
                            <Button onClick={() => navigate("/admin/create")} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Create First Post
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : posts.map(({
                      id,
                      title,
                      author,
                      category,
                      date,
                      featured,
                      comments,
                      slug
                    }) => (
                      <TableRow key={id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 border-gray-100 dark:border-zinc-700/50">
                        <TableCell className="py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-md flex items-center justify-center mr-3 flex-shrink-0 border border-indigo-200 dark:border-indigo-800/50">
                              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400 hover:underline cursor-pointer truncate max-w-[200px] md:max-w-[300px]" onClick={() => navigate(`/admin/edit/${id}`)}>
                                {title}
                              </p>
                              {featured && <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                                  <Star className="h-3 w-3 mr-1 text-amber-700 dark:text-amber-400" fill="currentColor" />
                                  Featured
                                </Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                {author?.[0]?.toUpperCase() || "A"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-zinc-300">{author || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300">
                            {category || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-zinc-400 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400 dark:text-zinc-500" />
                            {new Date(date).toLocaleDateString() || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-zinc-300">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                            <span className="font-medium">{comments && comments[0] ? comments[0].count : 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end items-center space-x-2">
                            <Button variant="outline" size="icon" onClick={() => navigate(`/blog/${slug}`)} aria-label={`View post: ${title}`} className="h-8 w-8 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="outline" size="icon" onClick={() => navigate(`/admin/edit/${id}`)} className="h-8 w-8 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px] border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 focus:bg-gray-100 dark:focus:bg-zinc-700" onClick={() => toggleFeaturePost(id, featured ?? false)}>
                                  {featured ? <>
                                      <StarOff className="h-4 w-4 mr-2 text-gray-500 dark:text-zinc-400" />
                                      Unfeature Post
                                    </> : <>
                                      <Star className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                                      Feature Post
                                    </>}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20" onClick={() => handleDelete(id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <CardFooter className="bg-gray-50/80 dark:bg-zinc-800/80 border-t border-gray-100 dark:border-zinc-700/50 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-zinc-400">Showing {posts?.length || 0} posts</p>
                <Button variant="outline" size="sm" className="text-sm border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300">
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-0">
            <Card className="border border-gray-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 shadow-md overflow-hidden">
              <CardHeader className="bg-gray-50/80 dark:bg-zinc-800/80 border-b border-gray-100 dark:border-zinc-700/50 p-4 md:p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Recent Comments
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-zinc-400">
                      Manage user engagement on your blog
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 border-gray-100 dark:border-zinc-700/50">
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Comment</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">User</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Post</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400">Date</TableHead>
                      <TableHead className="font-medium text-gray-500 dark:text-zinc-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commentsLoading ? renderSkeletonRows(3) : !comments || comments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-gray-500 dark:text-zinc-400">
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="rounded-full bg-gray-100 dark:bg-zinc-700/50 p-3 mb-4">
                              <MessageSquare className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-lg font-medium mb-2">No comments yet</p>
                            <p className="text-sm text-gray-500 dark:text-zinc-500">Comments will appear here when users engage with your posts</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : comments.map(({
                      id,
                      content,
                      name,
                      email,
                      created_at,
                      posts
                    }) => (
                      <TableRow key={id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 border-gray-100 dark:border-zinc-700/50">
                        <TableCell className="max-w-xs truncate text-gray-700 dark:text-zinc-300 py-4">
                          <div className="bg-gray-50 dark:bg-zinc-800/60 p-2 rounded border border-gray-100 dark:border-zinc-700/50">
                            <p className="line-clamp-2 text-sm">{content || "No content"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/50">
                              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                                {name?.[0]?.toUpperCase() || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                              <p className="text-xs text-gray-500 dark:text-zinc-500">{email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-zinc-300">
                          {posts?.slug ? <Button onClick={() => navigate(`/blog/${posts.slug}`)} variant="ghost" className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-transparent hover:underline">
                              {posts.title || "Unknown Post"}
                            </Button> : <span className="text-gray-500 dark:text-zinc-500">Unknown Post</span>}
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-zinc-400 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400 dark:text-zinc-500" />
                            {new Date(created_at).toLocaleDateString() || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="icon" onClick={() => handleDeleteComment(id)} aria-label="Delete comment" className="h-8 w-8 text-red-600 dark:text-red-400 border-gray-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <CardFooter className="bg-gray-50/80 dark:bg-zinc-800/80 border-t border-gray-100 dark:border-zinc-700/50 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-zinc-400">Showing latest {comments?.length || 0} comments</p>
                <Button variant="outline" size="sm" className="text-sm border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300">
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <style>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </AdminLayout>;
};

export default Admin;
