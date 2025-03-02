import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // For SEO meta tags
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowLeft, MessageCircle, Calendar, Clock, Share2, ArrowRight } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import Footer from "@/components/Footer";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  alt_text?: string;
  updated_at?: string;
};

interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string | null;
  content: string;
  created_at: string;
}

const AuthorCard = ({ author, date, updated_at }: { author: string; date: string; updated_at?: string }) => {
  return (
    <Card className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6 mb-6 shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-zinc-800 overflow-hidden mr-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
            alt={`${author}'s avatar`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{author}</h3>
          <p className="text-sm text-gray-400">Posted on {new Date(date).toLocaleDateString()}</p>
          {updated_at && (
            <p className="text-xs text-gray-500">
              Updated: {new Date(updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <p className="text-gray-300 text-sm">Graphic Designer</p>
    </Card>
  );
};

const CommentForm = ({ postId, onCommentAdded }: { postId: string; onCommentAdded: () => void }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">Leave a Comment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-400">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-400">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-400">
          Comment *
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Submitting...
          </span>
        ) : (
          "Post Comment"
        )}
      </Button>
    </form>
  );
};

const CommentsList = ({ comments }: { comments: Comment[] }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Be the first to comment on this article!
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <Card
          key={comment.id}
          className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-md"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden mr-3">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.name}`}
                alt={`${comment.name}'s avatar`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h4 className="font-medium text-white">{comment.name}</h4>
              <p className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{comment.content}</p>
        </Card>
      ))}
    </div>
  );
};

const RelatedPostCard = ({ post }: { post: Post }) => (
  <Link to={`/blog/${post.slug}`} className="group block">
    <Card className="flex gap-4 items-start p-4 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 transition-colors shadow-md">
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={post.image || "https://source.unsplash.com/100x100/?technology"}
          alt={post.alt_text || post.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div>
        <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h4>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(post.date || post.created_at).toLocaleDateString()}
          </span>
          {post.read_time && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.read_time} min
            </span>
          )}
        </div>
      </div>
    </Card>
  </Link>
);

const ShareButtons = ({ title, url }: { title: string; url: string }) => {
  const shareData = { title, url };
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 transition-colors"
        onClick={() => window.navigator.share?.(shareData)}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

const TableOfContents = ({ content }: { content: string }) => {
  const headings = content
    .match(/<h[2-3][^>]*>.*?<\/h[2-3]>/gi)
    ?.map((heading) => ({
      level: heading.startsWith("<h2") ? 2 : 3,
      text: heading.replace(/<\/?h[2-3][^>]*>/g, "").trim(),
      id: heading.match(/id=["'](.*?)["']/)?.[1] || `heading-${Math.random().toString(36).slice(2)}`,
    })) || [];

  if (headings.length === 0) return null;

  return (
    <Card className="mb-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 shadow-md">
      <h3 className="text-lg font-semibold text-white mb-3">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li
            key={index}
            className={`text-blue-400 hover:text-blue-300 ${heading.level === 3 ? "pl-4" : ""}`}
          >
            <a href={`#${heading.id}`} className="flex items-center">
              <span className="mr-2">•</span>
              <span className="line-clamp-1">{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
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
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*") // Fetch all fields including new ones
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      setPost(data);
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
      setComments(data as Comment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  const fetchRelatedContent = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, image, alt_text, date, read_time, updated_at")
        .neq("slug", slug || "")
        .order("updated_at", { ascending: false })
        .limit(4);
      if (data) {
        setRecentPosts(data);
        setTrendingPosts(data); // Placeholder; update logic for trending if needed
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
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        <meta name="keywords" content={post.keywords || ""} />
        <meta name="author" content={post.author || "Anonymous"} />
        <link rel="canonical" href={`https://yourdomain.com/blog/${post.slug}`} />
      </Helmet>
      <Navbar />
      <article className="container mx-auto px-4 py-16 max-w-6xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <div className="lg:col-span-5">
            <header className="mb-10">
              <div className="aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
                  alt={post.alt_text || post.title}
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
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                    alt={`${post.author}'s avatar`}
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
              {post.content && post.content.length > 1000 && (
                <TableOfContents content={post.content} />
              )}
            </header>
            <div ref={contentRef} className="prose prose-invert prose-lg max-w-none">
              {post.content ? formatContent(post.content) : (
                <p className="text-gray-300">No content available.</p>
              )}
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
