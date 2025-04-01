
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Eye,
  MessageSquare,
  Calendar,
  FileText,
  PlusCircle,
  BarChart3,
  MoreHorizontal,
  ChevronUp,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Clock,
  UserPlus,
  ThumbsUp,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Post = Database['public']['Tables']['posts']['Row'] & {
  comments: { count: number }[];
};

type Comment = Database['public']['Tables']['comments']['Row'] & {
  posts?: { title: string; slug: string };
};

const Admin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingFeature, setIsTogglingFeature] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          comments(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formattedPosts = data.map(post => {
          const commentsData = post.comments || [];
          return {
            ...post,
            comments: commentsData
          };
        });
        
        setPosts(formattedPosts as Post[]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error fetching posts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          posts(title, slug)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Error fetching comments");
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      setIsDeleting(postId);
      const { error } = await supabase
        .from("posts")
        .delete()
        .match({ id: postId });

      if (error) throw error;
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleFeaturePost = async (postId: string, currentStatus: boolean) => {
    try {
      setIsTogglingFeature(postId);
      const { error } = await supabase
        .from("posts")
        .update({ featured: !currentStatus })
        .match({ id: postId })
        .select("featured");

      if (error) throw error;
      toast.success(
        `Post ${!currentStatus ? "featured" : "unfeatured"} successfully`
      );
      fetchPosts();
    } catch (error) {
      console.error("Error updating feature status:", error);
      toast.error("Error updating feature status");
    } finally {
      setIsTogglingFeature(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .match({ id: commentId });

      if (error) throw error;
      toast.success("Comment deleted successfully");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchComments();

    const postsChannel = supabase
      .channel("posts-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => fetchPosts()
      )
      .subscribe();

    const commentsChannel = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => fetchComments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalComments = posts.reduce((sum, post) => {
    return sum + (post.comments?.[0]?.count || 0);
  }, 0);
  const featuredPosts = posts.filter(p => p.featured).length;

  const renderSkeletonRows = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
        </TableRow>
      ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, manage your blog content and analyze activity
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/create")}
            className="hidden sm:flex"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Posts</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900">{posts.length}</h3>
                    <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-100">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      9%
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>Growing steadily</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900">{totalViews}</h3>
                    <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-100">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      12%
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span>Up from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900">{totalComments}</h3>
                    <Badge className="mb-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                      <Clock className="h-3 w-3 mr-1" />
                      Recent
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <UserPlus className="h-4 w-4 mr-1 text-purple-500" />
                <span>New engagement</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Featured</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-gray-900">{featuredPosts}</h3>
                    <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-100">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <ThumbsUp className="h-4 w-4 mr-1 text-amber-500" />
                <span>Promoting top content</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="col-span-1 md:col-span-2 border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Content Dashboard</CardTitle>
                <CardDescription className="text-white/80">
                  Manage and monitor your blog performance
                </CardDescription>
              </div>
              <BarChart3 className="h-6 w-6 text-white/90" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate("/admin/create")} 
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                >
                  <PlusCircle className="h-8 w-8" />
                  <span>Create New Post</span>
                </Button>
                <Button 
                  onClick={() => navigate("/admin/analytics")} 
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-blue-200"
                >
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <span className="text-blue-600">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Quick Tips</h3>
                <p className="text-white/80 text-sm">
                  Regularly updating your blog with fresh content helps with SEO and reader engagement.
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="mt-4 bg-white/20 hover:bg-white/30 text-white border-none"
                onClick={() => navigate("/")}
              >
                View Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6 bg-muted/20">
            <TabsTrigger 
              value="posts" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Recent Comments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-white border-b border-gray-100 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Latest Posts</CardTitle>
                    <CardDescription className="text-gray-500">
                      Manage your published content
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate("/admin/create")}
                    className="sm:w-auto w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-medium">Title</TableHead>
                      <TableHead className="font-medium">Author</TableHead>
                      <TableHead className="font-medium">Category</TableHead>
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Comments</TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      renderSkeletonRows(3)
                    ) : posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center justify-center py-6">
                            <FileText className="h-10 w-10 text-gray-300 mb-3" />
                            <p>No posts found. Create your first post!</p>
                            <Button 
                              onClick={() => navigate("/admin/create")} 
                              variant="outline"
                              className="mt-4"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add Post
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      posts.map(({ id, title, author, category, date, featured, comments, slug }) => (
                        <TableRow key={id} className="hover:bg-gray-50 border-gray-200">
                          <TableCell className="py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3 flex-shrink-0">
                                <FileText className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 hover:text-primary hover:underline cursor-pointer" onClick={() => navigate(`/admin/edit/${id}`)}>
                                  {title}
                                </p>
                                {featured && (
                                  <Badge className="mt-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border border-yellow-200">
                                    <Star className="h-3 w-3 mr-1" fill="currentColor" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {author?.[0]?.toUpperCase() || "A"}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">{author || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
                              {category || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              {new Date(date).toLocaleDateString() || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            <div className="flex items-center">
                              <span className="font-medium">{comments && comments[0] ? comments[0].count : 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(`/blog/${slug}`)}
                                aria-label={`View post: ${title}`}
                                className="h-8 w-8 border-gray-200"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200">
                                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px] border-gray-200 shadow-lg">
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/admin/edit/${id}`)}>
                                    <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                                    Edit Post
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => toggleFeaturePost(id, featured ?? false)}>
                                    {featured ? (
                                      <>
                                        <StarOff className="h-4 w-4 mr-2 text-gray-500" />
                                        Unfeature Post
                                      </>
                                    ) : (
                                      <>
                                        <Star className="h-4 w-4 mr-2 text-amber-500" />
                                        Feature Post
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => handleDelete(id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {posts.length} posts</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchPosts()}
                  className="text-sm border-gray-200"
                >
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-0">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-white border-b border-gray-100 p-4 md:p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Recent Comments</CardTitle>
                    <CardDescription className="text-gray-500">
                      Manage user engagement on your blog
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-medium">Comment</TableHead>
                      <TableHead className="font-medium">User</TableHead>
                      <TableHead className="font-medium">Post</TableHead>
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      renderSkeletonRows(3)
                    ) : comments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center justify-center py-6">
                            <MessageSquare className="h-10 w-10 text-gray-300 mb-3" />
                            <p>No comments found.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      comments.map(({ id, content, name, email, created_at, posts }) => (
                        <TableRow key={id} className="hover:bg-gray-50 border-gray-200">
                          <TableCell className="max-w-xs truncate text-gray-700">
                            <p className="line-clamp-2">{content || "No content"}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {name?.[0]?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{name}</p>
                                <p className="text-xs text-gray-500">{email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {posts?.slug ? (
                              <Button 
                                onClick={() => navigate(`/blog/${posts.slug}`)}
                                variant="ghost"
                                className="p-0 h-auto text-primary hover:text-primary/90 hover:underline"
                              >
                                {posts.title || "Unknown Post"}
                              </Button>
                            ) : (
                              <span className="text-gray-500">Unknown Post</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              {new Date(created_at).toLocaleDateString() || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteComment(id)}
                                aria-label="Delete comment"
                                className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing latest {comments.length} comments</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchComments()}
                  className="text-sm border-gray-200"
                >
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;
