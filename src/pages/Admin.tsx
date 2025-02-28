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
import { Pencil, Trash2, Star, StarOff } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];

const Admin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      toast.error("Error fetching posts");
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .match({ id: postId });

      if (error) throw error;
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  const toggleFeaturePost = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ featured: !currentStatus })
        .match({ id: postId })
        .select('featured');

      if (error) throw error;
      toast.success(Post ${!currentStatus ? "featured" : "unfeatured"} successfully);
      fetchPosts();
    } catch (error) {
      toast.error("Error updating feature status");
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("posts-channel")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "posts",
      }, fetchPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="bg-[#1A1B1E] rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
          <p className="text-sm text-gray-400 mt-1">Manage and organize your blog content</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-900/50">
                <TableHead className="font-semibold text-gray-300">Title</TableHead>
                <TableHead className="font-semibold text-gray-300">Author</TableHead>
                <TableHead className="font-semibold text-gray-300">Category</TableHead>
                <TableHead className="font-semibold text-gray-300">Date</TableHead>
                <TableHead className="font-semibold text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow 
                  key={post.id}
                  className="hover:bg-zinc-900/50 border-zinc-800"
                >
                  <TableCell className="font-medium text-white">{post.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-300">
                          {post.author?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-300">{post.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      {post.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">{post.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(/admin/edit/${post.id})}
                        className="hover:bg-blue-600/10 hover:text-blue-400 text-gray-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="hover:bg-red-600/10 hover:text-red-400 text-gray-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeaturePost(post.id, post.featured || false)}
                        className={post.featured ? 
                          "text-yellow-400 hover:bg-yellow-600/10" : 
                          "text-gray-400 hover:bg-gray-600/10"
                        }
                      >
                        {post.featured ? (
                          <Star className="h-4 w-4" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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
