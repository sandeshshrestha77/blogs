import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowLeft, MessageCircle, Calendar, Clock, Share2, ArrowRight } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import Footer from "@/components/Footer";

// ... (Keep AuthorCard, CommentForm, CommentsList, RelatedPostCard, ShareButtons, TableOfContents unchanged)

const BlogPost = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      setPost(data || null);
    } catch (error) {
      toast.error("Error loading post");
      console.error("Error:", error);
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
      setComments(data as Comment[] || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  const fetchRelatedContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, image, alt_text, date, read_time, updated_at")
        .neq("slug", slug || "")
        .order("updated_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      if (data) {
        setRecentPosts(data);
        setTrendingPosts(data);
      }
    } catch (error) {
      console.error("Error fetching related content:", error);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
    fetchRelatedContent();
  }, [fetchPost, fetchRelatedContent]);

  useEffect(() => {
    if (post?.id) {
      fetchComments(post.id);
      const channel = supabase
        .channel("comments-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "comments",
            filter: `post_id=eq.${post.id}`,
          },
          (payload) => setComments((prev) => [payload.new as Comment, ...prev])
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [post?.id, fetchComments]);

  const handleCommentAdded = () => {
    if (post?.id) fetchComments(post.id);
  };

  const formatContent = (content: string) => {
    if (!content) return <p className="text-gray-300">No content available.</p>;
    if (content.includes("<p>") || content.includes("<h")) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="prose prose-invert prose-lg max-w-none text-gray-300"
        />
      );
    }
    let headingIndex = 0;
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("#")) {
        const id = `heading-${headingIndex++}`;
        const level = paragraph.match(/^#+/)?.[0].length || 1;
        const text = paragraph.replace(/^#+\s/, "");
        return level === 1 || level === 2 ? (
          <h2 id={id} key={index} className="text-2xl font-bold text-white mt-12 mb-6">
            {text}
          </h2>
        ) : (
          <h3 id={id} key={index} className="text-xl font-bold text-white mt-10 mb-4">
            {text}
          </h3>
        );
      }
      return (
        <p key={index} className="mb-6 text-gray-300 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Post not found</h1>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Helmet>
        <title>{post.meta_title || post.title || "Blog Post"}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        <meta name="keywords" content={post.keywords || ""} />
        <meta name="author" content={post.author || "Anonymous"} />
        <link rel="canonical" href={`https://yourdomain.com/blog/${post.slug}`} />
      </Helmet>
      <Navbar />
      <article className="container mx-auto px-4 py-16 max-w-6xl">
        <Link to="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <div className="lg:col-span-5">
            <header className="mb-10">
              <div className="aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
                  alt={post.alt_text || post.title || "Blog post image"}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              {post.category && (
                <span className="inline-block text-xs font-medium px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author || "Anonymous"}`}
                    alt={`${post.author || "Anonymous"}'s avatar`}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{post.author || "Anonymous"}</span>
                </div>
                {post.date && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                )}
                {post.updated_at && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Updated: {new Date(post.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                {post.read_time && (
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{post.read_time} min read</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  <span>{comments.length} comments</span>
                </div>
              </div>
              <ShareButtons title={post.title} url={window.location.href} />
              {post.content && post.content.length > 1000 && <TableOfContents content={post.content} />}
            </header>
            <div ref={contentRef} className="prose prose-invert prose-lg max-w-none">
              {formatContent(post.content || "")}
            </div>
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6">
                Comments ({comments.length})
              </h2>
              {commentsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <CommentsList comments={comments} />
              )}
              <div className="mt-8">
                <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
              </div>
            </div>
          </div>
          <aside className="lg:col-span-2 space-y-8">
            <AuthorCard
              author={post.author || "Anonymous"}
              date={post.date || new Date().toLocaleDateString()}
              updated_at={post.updated_at}
            />
            <Card className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Posts</h3>
              <div className="space-y-6">
                {trendingPosts.slice(0, 3).map((post) => (
                  <RelatedPostCard key={post.id} post={post} />
                ))}
              </div>
            </Card>
            <Card className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Articles</h3>
              <div className="space-y-6">
                {recentPosts.slice(0, 3).map((post) => (
                  <RelatedPostCard key={post.id} post={post} />
                ))}
                <Link
                  to="/blog"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 mt-4"
                >
                  View all articles
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;
