import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Post {
  title: string;
  content: string | null;
  image: string | null;
  author: string | null;
  date: string | null;
  category: string | null;
  slug: string;
}

const AuthorCard = ({ author, date }: { author: string; date: string }) => (
  <Card className="p-6 lg:sticky lg:top-8 shadow-md rounded-lg">
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
          alt={`${author}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-lg mb-2">{author}</h3>
      <p className="text-sm text-muted-foreground mb-4">Graphic Designer</p>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
  </Card>
);

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single();
      if (error) throw error;
      setPost(data);
    } catch (error) {
      toast.error("Error loading post");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <article className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to all posts
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {post.category && (
              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                {post.category}
              </span>
            )}
            <h1 className="text-4xl font-bold my-4">{post.title}</h1>
            <div className="aspect-[16/9] mb-8 rounded-xl overflow-hidden shadow-md">
              <img
                src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
                alt={post.title}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
            <div className="prose prose-lg dark:prose-invert leading-relaxed space-y-6">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
          <aside>
            <AuthorCard author={post.author || "Anonymous"} date={post.date || new Date().toLocaleDateString()} />
          </aside>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
