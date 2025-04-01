
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
  FileText as FileTextIcon,
  PlusCircle as PlusCircleIcon,
  BarChart3,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  const showToast = (type: "success" | "error", message: string) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

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
      showToast("error", "Error fetching posts");
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      showToast("error", "Error fetching comments");
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
      showToast("success", "Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("error", "Error deleting post");
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
      showToast(
        "success",
        `Post ${!currentStatus ? "featured" : "unfeatured"} successfully`
      );
      fetchPosts();
    } catch (error) {
      console.error("Error updating feature status:", error);
      showToast("error", "Error updating feature status");
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
      showToast("success", "Comment deleted successfully");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("error", "Error deleting comment");
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

  const renderSkeletonRows = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-6 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-12" />
          </TableCell>
          <TableCell>
            <div className="flex justify-end">
              <Skeleton className="h-9 w-24" />
            </div>
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center mb-2">
            <LayoutDashboard className="mr-2 h-7 w-7 text-primary" />
            Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your blog content and monitor activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-primary">{posts.length}</p>
                  <p className="text-gray-500 mt-1">Total Posts</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileTextIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-emerald-600">{posts.filter(p => p.featured).length}</p>
                  <p className="text-gray-500 mt-1">Featured Posts</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-blue-600">{comments.length}</p>
                  <p className="text-gray-500 mt-1">Comments</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm border border-gray-100 mb-8">
          <CardHeader className="border-b border-gray-100 bg-white px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">Latest Posts</CardTitle>
                <CardDescription className="text-gray-500">Manage your published content</CardDescription>
              </div>
              <Button 
                onClick={() => navigate("/admin/create")}
                variant="default"
                size="sm"
                className="text-white"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-50 border-gray-200">
                    <TableHead className="font-medium text-gray-600">Title</TableHead>
                    <TableHead className="font-medium text-gray-600">Author</TableHead>
                    <TableHead className="font-medium text-gray-600">Category</TableHead>
                    <TableHead className="font-medium text-gray-600">Date</TableHead>
                    <TableHead className="font-medium text-gray-600"><MessageSquare className="h-4 w-4" /></TableHead>
                    <TableHead className="font-medium text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    renderSkeletonRows(3)
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No posts found. Create your first post!
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map(({ id, title, author, category, date, featured, comments, slug }) => (
                      <TableRow key={id} className="hover:bg-gray-50 border-gray-200">
                        <TableCell className="font-medium text-primary hover:text-primary/90 transition-colors">
                          <a href={`/admin/edit/${id}`} className="hover:underline">
                            {title}
                          </a>
                          {featured && (
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border border-yellow-200">
                              Featured
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {author?.[0]?.toUpperCase() || "A"}
                              </span>
                            </div>
                            <span className="text-gray-600">{author || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
                            {category || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
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
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog/${slug}`)}
                              aria-label={`View post: ${title}`}
                              className="mr-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem onClick={() => navigate(`/admin/edit/${id}`)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleFeaturePost(id, featured ?? false)}>
                                  {featured ? (
                                    <>
                                      <StarOff className="h-4 w-4 mr-2" />
                                      Unfeature
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4 mr-2" />
                                      Feature
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
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
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="border-b border-gray-100 bg-white px-6 py-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Latest Comments</CardTitle>
              <CardDescription className="text-gray-500">Recent user engagement on your blog</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-50 border-gray-200">
                    <TableHead className="font-medium text-gray-600">Comment</TableHead>
                    <TableHead className="font-medium text-gray-600">Name</TableHead>
                    <TableHead className="font-medium text-gray-600">Post</TableHead>
                    <TableHead className="font-medium text-gray-600">Date</TableHead>
                    <TableHead className="font-medium text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    renderSkeletonRows(3)
                  ) : comments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No comments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    comments.map(({ id, content, name, email, created_at, posts }) => (
                      <TableRow key={id} className="hover:bg-gray-50 border-gray-200">
                        <TableCell className="max-w-xs truncate text-gray-700">
                          {content || "No content"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {name?.[0]?.toUpperCase() || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{name}</p>
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
                            <span>{posts?.title || "Unknown Post"}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {new Date(created_at).toLocaleDateString() || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteComment(id)}
                              aria-label="Delete comment"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Admin;
