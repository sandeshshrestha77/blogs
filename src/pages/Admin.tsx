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
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

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
      postsChannel.unsubscribe();
      commentsChannel.unsubscribe();
    };
  }, []);

  return (
    <AdminLayout>
      <div>
        <div className="mb-section">
          <h1 className="text-heading-1 font-bold text-gray-800 flex items-center mb-2">
            <LayoutDashboard className="mr-2 h-7 w-7 text-[#2271b1]" />
            Dashboard
          </h1>
          <p className="text-base-content text-gray-600">
            Blog management dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-section">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold text-[#2271b1]">{posts.length}</p>
                  <p className="text-gray-500 mt-1">Total Posts</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#2271b1]/10 flex items-center justify-center">
                  <FileTextIcon className="h-6 w-6 text-[#2271b1]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold text-green-600">{posts.filter(p => p.featured).length}</p>
                  <p className="text-gray-500 mt-1">Featured Posts</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold text-blue-600">{comments.length}</p>
                  <p className="text-gray-500 mt-1">Comments</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm border border-gray-200 mb-section">
          <CardHeader className="border-b border-gray-100 bg-white px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-heading-3 font-semibold text-gray-800">Latest Posts</CardTitle>
              <Button 
                onClick={() => navigate("/admin/create")}
                variant="success"
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
                    <TableHead className="font-medium text-gray-600">Comments</TableHead>
                    <TableHead className="font-medium text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No posts found. Create your first post!
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map(({ id, title, author, category, date, featured, comments, slug }) => (
                      <TableRow key={id} className="hover:bg-gray-50 border-gray-200">
                        <TableCell className="font-medium text-[#2271b1] hover:text-[#135e96] transition-colors">
                          <a href={`/admin/edit/${id}`} className="hover:underline">
                            {title}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            <Button 
                              onClick={() => navigate(`/blog/${slug}`)} 
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center p-0 h-auto"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            {category || "Uncategorized"}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {new Date(date).toLocaleDateString() || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1 text-gray-400" />
                            {comments && comments[0] ? comments[0].count : 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/edit/${id}`)}
                              aria-label={`Edit post: ${title}`}
                              className="hover:bg-[#2271b1]/10 hover:text-[#2271b1] text-gray-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(id)}
                              disabled={isDeleting === id}
                              aria-label={`Delete post: ${title}`}
                              className="hover:bg-red-50 hover:text-red-500 text-gray-500"
                            >
                              {isDeleting === id ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeaturePost(id, featured ?? false)}
                              disabled={isTogglingFeature === id}
                              aria-label={`Toggle featured status for post: ${title}`}
                              className={
                                featured
                                  ? "text-yellow-500 hover:bg-yellow-50"
                                  : "text-gray-500 hover:bg-gray-100"
                              }
                            >
                              {isTogglingFeature === id ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : featured ? (
                                <Star className="h-4 w-4" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
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

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-white px-6 py-4">
            <CardTitle className="text-heading-3 font-semibold text-gray-800">Latest Comments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-50 border-gray-200">
                    <TableHead className="font-medium text-gray-600">Comment</TableHead>
                    <TableHead className="font-medium text-gray-600">Post</TableHead>
                    <TableHead className="font-medium text-gray-600">Date</TableHead>
                    <TableHead className="font-medium text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : comments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No comments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    comments.map(({ id, content, created_at, posts }) => (
                      <TableRow key={id} className="hover:bg-gray-50 border-gray-200">
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {content || "No content"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {posts?.slug ? (
                            <Button 
                              onClick={() => navigate(`/blog/${posts.slug}`)}
                              variant="ghost"
                              className="p-0 h-auto text-[#2271b1] hover:text-[#135e96] hover:underline"
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
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(id)}
                              aria-label="Delete comment"
                              className="hover:bg-red-50 hover:text-red-500 text-gray-500"
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
