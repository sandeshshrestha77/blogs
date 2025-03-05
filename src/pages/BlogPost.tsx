import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowLeft, MessageCircle, Calendar, Clock, Share2, ArrowRight, Eye } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
type Post = Database['public']['Tables']['posts']['Row'];
interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string | null;
  content: string;
  created_at: string;
}
const AuthorCard = ({
  author,
  date
}: {
  author: string;
  date: string;
}) => {
  return <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden mr-5 border-2 border-blue-500/20">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} alt={`${author}'s avatar`} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-xl mb-1">{author}</h3>
          <p className="text-sm text-gray-400">Posted on {date}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm">Graphic Designer</p>
    </div>;
};
const CommentForm = ({
  postId,
  onCommentAdded
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
      const {
        error
      } = await supabase.from('comments').insert({
        post_id: postId,
        name,
        email: email || null,
        content
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
  return <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900/60 p-7 rounded-xl border border-zinc-800 shadow-lg">
      <h3 className="text-2xl font-semibold text-white mb-5">Leave a Comment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Name *
          </label>
          <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
            Email (optional)
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">
          Comment *
        </label>
        <textarea id="comment" value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
      </div>
      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-zinc-100 font-medium px-6 py-2.5 rounded-md transition-colors">
        {isSubmitting ? "Submitting..." : "Post Comment"}
      </Button>
    </form>;
};
const CommentsList = ({
  comments
}: {
  comments: Comment[];
}) => {
  if (comments.length === 0) {
    return <div className="text-center py-10 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
        <p className="text-gray-400 text-lg">Be the first to comment on this article!</p>
      </div>;
  }
  return <div className="space-y-6">
      {comments.map(comment => <div key={comment.id} className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden mr-4 border border-zinc-700">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.name}`} alt={`${comment.name}'s avatar`} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <h4 className="font-medium text-white text-lg">{comment.name}</h4>
              <p className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
              </p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{comment.content}</p>
        </div>)}
    </div>;
};
const RelatedPostCard = ({
  post
}: {
  post: Post;
}) => <Link to={`/blog/${post.slug}`} className="group block">
    <div className="flex gap-5 items-start p-4 rounded-lg hover:bg-zinc-900/50 transition-colors">
      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 border border-zinc-800 shadow-md">
        <img src={post.image || "https://source.unsplash.com/100x100/?technology"} alt={post.title} className="w-full h-full object-contain" loading="lazy" />
      </div>
      <div>
        <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 text-lg mb-2">
          {post.title}
        </h4>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {post.date}
          </span>
          {post.read_time && <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.read_time} min
            </span>}
          {post.views !== undefined && post.views !== null}
        </div>
      </div>
    </div>
  </Link>;
const ShareButtons = () => {
  return <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-100 transition-colors" onClick={() => window.navigator.share?.({
      url: window.location.href
    })}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>;
};
const TableOfContents = ({
  content
}: {
  content: string;
}) => {
  const headings = content.split('\n\n').filter(para => para.startsWith('#') || para.startsWith('##')).map(heading => heading.replace(/^#+\s/, '').trim()).slice(0, 5);
  if (headings.length === 0) return null;
  return <div className="mb-10 p-6 bg-zinc-900/60 rounded-xl border border-zinc-800 shadow-md sticky top-24">
      <h3 className="text-xl font-semibold text-white mb-4">Table of Contents</h3>
      <ul className="space-y-3">
        {headings.map((heading, index) => <li key={index} className="text-blue-400 hover:text-blue-300 transition-colors">
            <a href={`#heading-${index}`} className="flex items-center group">
              <span className="mr-2 text-blue-500 group-hover:mr-3 transition-all">•</span>
              <span className="line-clamp-1">{heading}</span>
            </a>
          </li>)}
      </ul>
    </div>;
};
const BlogPost = () => {
  const {
    slug
  } = useParams();
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
      const {
        data,
        error
      } = await supabase.from("posts").select().eq('slug', slug).maybeSingle();
      if (error) throw error;
      if (data) {
        setPost(data);
        await supabase.rpc('increment_views', {
          post_slug: slug
        });
      }
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
      const {
        data,
        error
      } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      if (data) setComments(data as Comment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, []);
  const fetchRelatedContent = useCallback(async () => {
    try {
      const {
        data: recentData,
        error: recentError
      } = await supabase.from("posts").select().neq('slug', slug || '').order('created_at', {
        ascending: false
      }).limit(3);
      if (recentError) throw recentError;
      if (recentData) setRecentPosts(recentData);
      const {
        data: trendingData,
        error: trendingError
      } = await supabase.from("posts").select().neq('slug', slug || '').order('views', {
        ascending: false,
        nullsFirst: false
      }).limit(1).maybeSingle();
      if (trendingError) throw trendingError;
      if (trendingData) setTrendingPosts(trendingData ? [trendingData] : []);
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
      const channel = supabase.channel('comments-channel').on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${post.id}`
      }, payload => {
        const newComment = payload.new as Comment;
        setComments(prevComments => [newComment, ...prevComments]);
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [post?.id, fetchComments]);
  const handleCommentAdded = () => {
    if (post?.id) {
      fetchComments(post.id);
    }
  };
  const formatContent = (content: string) => {
    if (content && (content.includes('<p>') || content.includes('<h'))) {
      return <div dangerouslySetInnerHTML={{
        __html: content
      }} className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-6 prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:my-10 prose-img:shadow-lg prose-hr:border-zinc-700 prose-blockquote:border-l-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-400" />;
    }
    let headingIndex = 0;
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('#') || paragraph.startsWith('##')) {
        const id = `heading-${headingIndex}`;
        headingIndex++;
        if (paragraph.startsWith('##')) {
          return <h3 id={id} key={index} className="text-2xl font-bold text-white mt-12 mb-5 scroll-mt-24">
              {paragraph.replace(/^##\s/, '')}
            </h3>;
        } else {
          return <h2 id={id} key={index} className="text-3xl font-bold text-white mt-16 mb-6 scroll-mt-24">
              {paragraph.replace(/^#\s/, '')}
            </h2>;
        }
      }
      return <p key={index} className="mb-7 text-gray-300 leading-relaxed text-lg">{paragraph}</p>;
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>;
  }
  if (!post) {
    return <div className="min-h-screen flex flex-col bg-zinc-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-6 text-white">Post not found</h1>
          <Link to="/">
            <Button size="lg" className="mt-4">Return Home</Button>
          </Link>
        </div>
      </div>;
  }
  const metaTitle = post.meta_title || post.title;
  const metaDescription = post.meta_description || post.excerpt || `Read about ${post.title}`;
  const imageAltText = post.alt_text || post.title;
  const keywords = post.keywords || post.category || '';
  return <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:section" content={post.category} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Navbar />

      <div className="w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

      <article className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="mb-10">
          <Link to="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 group transition-colors text-sm font-medium">
            <ArrowLeft size={16} className="mr-2 group-hover:mr-3 transition-all" />
            Back to all articles
          </Link>
        </div>

        <div className="aspect-video mb-12 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50">
          <img src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"} alt={imageAltText} className="object-cover w-full h-full" loading="lazy" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
          <div className="lg:col-span-5">
            <header className="mb-12">
              {post.category && <span className="inline-block text-sm font-medium px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full mb-5">
                  {post.category}
                </span>}
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={`${post.author}'s avatar`} className="w-8 h-8 rounded-full border border-zinc-700" />
                  <span className="font-medium">{post.author || "Anonymous"}</span>
                </div>
                {post.date && <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>}
                {post.read_time && <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{post.read_time} min read</span>
                  </div>}
                {post.views !== undefined && post.views !== null && <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{post.views} views</span>
                  </div>}
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>{comments.length} comments</span>
                </div>
              </div>

              <ShareButtons />

              {post.content && post.content.length > 1000 && <TableOfContents content={post.content} />}
            </header>

            <div ref={contentRef} className="article-content mb-16">
              {post.content ? formatContent(post.content) : <p className="text-gray-300">No content available.</p>}
            </div>

            <div className="mt-16 pt-10 border-t border-zinc-800">
              <h2 className="text-3xl font-bold text-white mb-8">Comments ({comments.length})</h2>
              {commentsLoading ? <div className="flex justify-center py-10">
                  <LoadingSpinner />
                </div> : <CommentsList comments={comments} />}
              <div className="mt-12">
                <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-10">
            <div className="sticky top-24">
              <AuthorCard author={post.author || "Anonymous"} date={post.date || new Date().toLocaleDateString()} />

              {trendingPosts.length > 0 && <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 shadow-lg mb-10">
                  <h3 className="text-xl font-semibold text-white mb-6">Trending Articles</h3>
                  <div>
                    {trendingPosts.map(post => <RelatedPostCard key={post.id} post={post} />)}
                  </div>
                </div>}

              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Articles</h3>
                <div className="space-y-6">
                  {recentPosts.slice(0, 3).map(post => <RelatedPostCard key={post.id} post={post} />)}
                  <Link to="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300 mt-6 group transition-colors">
                    View all articles
                    <ArrowRight size={16} className="ml-2 group-hover:ml-3 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <Footer />
    </div>;
};
export default BlogPost;