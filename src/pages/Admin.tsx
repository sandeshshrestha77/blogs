
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
  ArrowUpRight,
  ArrowRight,
  Clock,
  LinkIcon
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRealtimeData } from "@/hooks/useRealtimeData";

type Post = Database['public']['Tables']['posts']['Row'] & {
  comments: { count: number }[];
};

type Comment = Database['public']['Tables']['comments']['Row'] & {
  posts?: { title: string; slug: string };
};

const Admin = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingFeature, setIsTogglingFeature] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    data: posts = [],
    loading: postsLoading,
    error: postsError
  } = useRealtimeData<Post>({
    tableName: 'posts',
    initialQuery: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          comments(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const {
    data: comments = [],
    loading: commentsLoading,
  } = useRealtimeData<Comment>({
    tableName: 'comments',
    initialQuery: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          posts(title, slug)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    }
  });

  const handleDelete = async (postId: string) => {
    try {
      setIsDeleting(postId);
      const { error } = await supabase
        .from("posts")
        .delete()
        .match({ id: postId });

      if (error) throw error;
      toast.success("Post deleted successfully");
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
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

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
              <Skeleton className="h-10 w-10 rounded-md bg-zinc-800" />
              <Skeleton className="h-4 w-32 bg-zinc-800" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
          <TableCell><Skeleton className="h-8 w-24 bg-zinc-800" /></TableCell>
        </TableRow>
      ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">
              Manage your blog content and analyze activity
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/create")}
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="overflow-hidden border-none bg-zinc-900 shadow-lg shadow-black/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-400">Total Posts</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-white">{posts.length}</h3>
                    <Badge className="mb-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      9%
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-zinc-500">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-400" />
                <span>Growing steadily</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none bg-zinc-900 shadow-lg shadow-black/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-400">Total Views</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-white">{totalViews}</h3>
                    <Badge className="mb-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      12%
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-600/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-zinc-500">
                <ArrowUpRight className="h-4 w-4 mr-1 text-emerald-400" />
                <span>Up from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none bg-zinc-900 shadow-lg shadow-black/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-400">Comments</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-white">{totalComments}</h3>
                    <Badge className="mb-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      Recent
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-zinc-500">
                <ArrowUpRight className="h-4 w-4 mr-1 text-purple-400" />
                <span>New engagement</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none bg-zinc-900 shadow-lg shadow-black/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-400">Featured</p>
                  <div className="flex items-end gap-1">
                    <h3 className="text-3xl font-bold text-white">{featuredPosts}</h3>
                    <Badge className="mb-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20">
                      <ChevronUp className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-zinc-500">
                <LinkIcon className="h-4 w-4 mr-1 text-amber-400" />
                <span>Promoting top content</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="col-span-1 md:col-span-2 border-none bg-gradient-to-br from-blue-600/20 to-purple-600/20 shadow-lg shadow-black/20">
            <CardHeader className="p-6 border-b border-zinc-800">
              <div>
                <CardTitle className="text-xl text-white">Content Dashboard</CardTitle>
                <CardDescription className="text-zinc-400">
                  Manage and monitor your blog performance
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate("/admin/create")} 
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="h-8 w-8" />
                  <span>Create New Post</span>
                </Button>
                <Button 
                  onClick={() => navigate("/admin/analytics")} 
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <BarChart3 className="h-8 w-8 text-zinc-300" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-blue-600/40 to-purple-600/40 shadow-lg shadow-black/20">
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Quick Tips</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Regularly updating your blog with fresh content helps with SEO and reader engagement.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="mt-4 border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300"
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
          <TabsList className="w-full max-w-md mx-auto mb-6 bg-zinc-800/50">
            <TabsTrigger 
              value="posts" 
              className="flex-1 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=inactive]:text-zinc-400"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="flex-1 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=inactive]:text-zinc-400"
            >
              Recent Comments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            <Card className="border-none bg-zinc-900 shadow-lg shadow-black/20">
              <CardHeader className="bg-zinc-900 border-b border-zinc-800 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold text-white">Latest Posts</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage your published content
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate("/admin/create")}
                    className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-zinc-800 border-zinc-800">
                      <TableHead className="font-medium text-zinc-400">Title</TableHead>
                      <TableHead className="font-medium text-zinc-400">Author</TableHead>
                      <TableHead className="font-medium text-zinc-400">Category</TableHead>
                      <TableHead className="font-medium text-zinc-400">Date</TableHead>
                      <TableHead className="font-medium text-zinc-400">Comments</TableHead>
                      <TableHead className="font-medium text-zinc-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postsLoading ? (
                      renderSkeletonRows(3)
                    ) : posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-zinc-400">
                          <div className="flex flex-col items-center justify-center py-6">
                            <FileText className="h-10 w-10 text-zinc-600 mb-3" />
                            <p>No posts found. Create your first post!</p>
                            <Button 
                              onClick={() => navigate("/admin/create")} 
                              variant="outline"
                              className="mt-4 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add Post
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      posts.map(({ id, title, author, category, date, featured, comments, slug }) => (
                        <TableRow key={id} className="hover:bg-zinc-800 border-zinc-800">
                          <TableCell className="py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                                <FileText className="h-5 w-5 text-zinc-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white hover:text-blue-400 hover:underline cursor-pointer" onClick={() => navigate(`/admin/edit/${id}`)}>
                                  {title}
                                </p>
                                {featured && (
                                  <Badge className="mt-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30">
                                    <Star className="h-3 w-3 mr-1 text-amber-300" fill="currentColor" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-400">
                                  {author?.[0]?.toUpperCase() || "A"}
                                </span>
                              </div>
                              <span className="text-sm text-zinc-300">{author || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-zinc-800/80 border-zinc-700 text-zinc-300">
                              {category || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-400 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-zinc-500" />
                              {new Date(date).toLocaleDateString() || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-400">
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
                                className="h-8 w-8 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px] border-zinc-700 bg-zinc-900 text-zinc-300">
                                  <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800" onClick={() => navigate(`/admin/edit/${id}`)}>
                                    <Pencil className="h-4 w-4 mr-2 text-zinc-400" />
                                    Edit Post
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800" onClick={() => toggleFeaturePost(id, featured ?? false)}>
                                    {featured ? (
                                      <>
                                        <StarOff className="h-4 w-4 mr-2 text-zinc-400" />
                                        Unfeature Post
                                      </>
                                    ) : (
                                      <>
                                        <Star className="h-4 w-4 mr-2 text-amber-400" />
                                        Feature Post
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-zinc-800 focus:bg-zinc-800" onClick={() => handleDelete(id)}>
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
              <CardFooter className="bg-zinc-900 border-t border-zinc-800 p-4 flex justify-between items-center">
                <p className="text-sm text-zinc-400">Showing {posts.length} posts</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                >
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-0">
            <Card className="border-none bg-zinc-900 shadow-lg shadow-black/20">
              <CardHeader className="bg-zinc-900 border-b border-zinc-800 p-4 md:p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-white">Recent Comments</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage user engagement on your blog
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-zinc-800 border-zinc-800">
                      <TableHead className="font-medium text-zinc-400">Comment</TableHead>
                      <TableHead className="font-medium text-zinc-400">User</TableHead>
                      <TableHead className="font-medium text-zinc-400">Post</TableHead>
                      <TableHead className="font-medium text-zinc-400">Date</TableHead>
                      <TableHead className="font-medium text-zinc-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commentsLoading ? (
                      renderSkeletonRows(3)
                    ) : comments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-zinc-400">
                          <div className="flex flex-col items-center justify-center py-6">
                            <MessageSquare className="h-10 w-10 text-zinc-600 mb-3" />
                            <p>No comments found.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      comments.map(({ id, content, name, email, created_at, posts }) => (
                        <TableRow key={id} className="hover:bg-zinc-800 border-zinc-800">
                          <TableCell className="max-w-xs truncate text-zinc-300">
                            <p className="line-clamp-2">{content || "No content"}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-sm font-medium text-zinc-300">
                                  {name?.[0]?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-zinc-300">{name}</p>
                                <p className="text-xs text-zinc-500">{email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-300">
                            {posts?.slug ? (
                              <Button 
                                onClick={() => navigate(`/blog/${posts.slug}`)}
                                variant="ghost"
                                className="p-0 h-auto text-blue-400 hover:text-blue-300 hover:bg-transparent hover:underline"
                              >
                                {posts.title || "Unknown Post"}
                              </Button>
                            ) : (
                              <span className="text-zinc-500">Unknown Post</span>
                            )}
                          </TableCell>
                          <TableCell className="text-zinc-400 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-zinc-500" />
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
                                className="h-8 w-8 text-red-400 border-zinc-700 hover:bg-zinc-800"
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
              <CardFooter className="bg-zinc-900 border-t border-zinc-800 p-4 flex justify-between items-center">
                <p className="text-sm text-zinc-400">Showing latest {comments.length} comments</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm border-zinc-700 hover:bg-zinc-800 text-zinc-300"
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
