import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

const Admin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch {
      toast.error("Error fetching posts");
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select()
        .order("created_at", { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch {
      toast.error("Error fetching comments");
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
    } catch {
      toast.error("Error deleting comment");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchComments();

    const postChannel = supabase
      .channel("posts-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, fetchPosts)
      .subscribe();

    const commentChannel = supabase
      .channel("comments-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, fetchComments)
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  return (
    <AdminLayout>
      {/* Blog Posts Table */}
      <div className="bg-[#1A1B1E] rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => navigate(`/admin/edit/${post.id}`)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Comments Table */}
      <div className="bg-[#1A1B1E] rounded-xl shadow-xl border border-zinc-800 overflow-hidden mt-6">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">Recent Comments</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.author}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="hover:bg-red-600/10 hover:text-red-400 text-gray-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
