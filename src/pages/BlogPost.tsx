
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Clock, User, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import RelatedPosts from "@/components/RelatedPosts";
import ThreeDBackground from "@/components/ThreeDBackground";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        if (!slug) return;

        const { data, error } = await supabase
          .from("posts")
          .select()
          .eq("slug", slug)
          .single();

        if (error) {
          toast.error("Post not found");
          throw error;
        }

        setPost(data);

        // Update view count
        if (data.id) {
          const newViewCount = (data.views || 0) + 1;
          await supabase
            .from("posts")
            .update({ views: newViewCount })
            .eq("id", data.id);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="container mx-auto px-4 py-40 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-zinc-400">The article you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.image && <meta property="og:image" content={post.image} />}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ""} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <div className="absolute inset-0 -z-10 opacity-50">
        <ThreeDBackground color="#0f172a" />
      </div>
      
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12">
            {post.category && (
              <div className="inline-block px-4 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-500/20 text-sm font-medium mb-4">
                {post.category}
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-zinc-400">
              {post.author && (
                <div className="flex items-center">
                  <User size={18} className="mr-2 text-blue-400" />
                  <span>{post.author}</span>
                </div>
              )}
              
              {post.date && (
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-400" />
                  <span>{post.date}</span>
                </div>
              )}
              
              {post.read_time && (
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-blue-400" />
                  <span>{post.read_time} min read</span>
                </div>
              )}
              
              {post.views !== null && post.views !== undefined && (
                <div className="flex items-center">
                  <Eye size={18} className="mr-2 text-blue-400" />
                  <span>{post.views} views</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Featured Image */}
          {post.image && (
            <div className="max-w-5xl mx-auto mb-16 rounded-xl overflow-hidden shadow-2xl border border-zinc-800/50">
              <img 
                src={post.image} 
                alt={post.alt_text || post.title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white prose-code:text-blue-300 prose-blockquote:border-blue-500 prose-blockquote:text-zinc-300 prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700"
              dangerouslySetInnerHTML={{ __html: post.content || "" }} 
            />
            
            {/* Related Posts */}
            <RelatedPosts currentPostId={post.id} category={post.category} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
