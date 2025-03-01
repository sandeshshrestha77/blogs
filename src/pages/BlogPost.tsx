import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowLeft, MessageCircle, Calendar, Clock, Share2, ArrowRight } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import Footer from "@/components/Footer";

type Post = Database['public']['Tables']['posts']['Row'];
interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string | null;
  content: string;
  created_at: string;
}

const AuthorCard = ({ author, date }: { author: string; date: string }) => (
  <div className="text-white">
    <p>{author}</p>
    <p>Posted on {date}</p>
    <p>Graphic Designer</p>
  </div>
);

const CommentForm = ({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) {
      toast.error("Name and comment are required");
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        name,
        email: email || null,
        content,
      });
      if (error) throw error;
      toast.success("Comment submitted successfully");
      setName("");
      setEmail("");
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-white">Leave a Comment</h3>
      <input
        type="text"
        placeholder="Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Comment *"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Post Comment"}
      </Button>
    </form>
  );
};

const CommentsList = ({ comments }: { comments: Comment[] }) => {
  if (comments.length === 0) {
    return <p className="text-white">Be the first to comment on this article!</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-zinc-700 pb-4">
          <p className="font-bold text-white">{comment.name}</p>
          <p className="text-sm text-gray-400">
            {new Date(comment.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-white">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    try {
      const { data, error } = await supabase.from("posts").select().eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (data) setPost(data);
    } catch (error) {
      toast.error("Error loading post");
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchComments = useCallback(async (postId: string) => {
    try {
      setCommentsLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setComments(data as Comment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post?.id) {
      fetchComments(post.id);
    }
  }, [post?.id, fetchComments]);

  const handleCommentAdded = () => {
    if (post?.id) {
      fetchComments(post.id);
    }
  };

  const formatContent = (content: string) => {
    if (content && (content.includes("<p>") || content.includes("<h"))) {
      return <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    let headingIndex = 0;
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("#") || paragraph.startsWith("##")) {
        const id = `heading-${headingIndex}`;
        headingIndex++;
        if (paragraph.startsWith("##")) {
          return (
            <h3 key={id} className="text-white">
              {paragraph.replace(/^##\s/, "")}
            </h3>
          );
        } else {
          return (
            <h2 key={id} className="text-white">
              {paragraph.replace(/^#\s/, "")}
            </h2>
          );
        }
      }
      return (
        <p key={index} className="text-white">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="text-white">
        <p>Post not found</p>
        <Link to="/">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-5">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <AuthorCard author={post.author || "Anonymous"} date={post.date || ""} />
            <div className="mt-4">{formatContent(post.content)}</div>
            <CommentsList comments={comments} />
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-4 bg-zinc-800">
              <h3 className="text-xl font-bold">Trending Posts</h3>
              {trendingPosts.slice(0, 3).map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="block mt-2 text-blue-400">
                  {post.title}
                </Link>
              ))}
            </Card>
            <Card className="p-4 bg-zinc-800">
              <h3 className="text-xl font-bold">Recent Articles</h3>
              {recentPosts.slice(0, 3).map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="block mt-2 text-blue-400">
                  {post.title}
                </Link>
              ))}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
