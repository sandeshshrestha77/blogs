import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowRight, ChevronRight, Clock, User, BookOpen, ArrowUpRight } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Helmet } from "react-helmet";

type Post = Database['public']['Tables']['posts']['Row'];

const Index = () => {
  const navigate = useNavigate();
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setUpdating(true);
      const [featuredResponse, postsResponse] = await Promise.all([
        supabase.from("posts").select().eq('featured', true).maybeSingle(),
        supabase.from("posts").select().eq('featured', false).order("created_at", {
          ascending: false
        }).limit(6)
      ]);

      if (featuredResponse.error && featuredResponse.error.code !== 'PGRST116') {
        throw featuredResponse.error;
      }
      if (postsResponse.error) {
        throw postsResponse.error;
      }

      if (featuredResponse.data) setFeaturedPost(featuredResponse.data);
      if (postsResponse.data) setPosts(postsResponse.data);
    } catch (error) {
      toast.error("Error loading posts");
    } finally {
      setInitialLoading(false);
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    
    const channel = supabase.channel("posts-channel")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "posts"
      }, fetchPosts)
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const handleViewAll = () => setShowAllPosts(true);
  
  const displayedPosts = useMemo(() => 
    showAllPosts ? posts : posts.slice(0, 6), 
    [showAllPosts, posts]
  );

  const metaTitle = "Sandesh Shrestha | Articles & Insights on Technology and Design";
  const metaDescription = "Explore expert guides and tutorials on technology, design, and development. Find resources to master digital skills, whether you're a beginner or looking to refine your expertise.";
  const keywords = "web development, design, technology, tutorials, digital skills, programming";

  return (
    <div className="min-h-screen bg-zinc-950">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {featuredPost?.image && <meta property="og:image" content={featuredPost.image} />}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {featuredPost?.image && <meta name="twitter:image" content={featuredPost.image} />}
        
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <Navbar />
      
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Hero Section with Featured Post */}
          {featuredPost && (
            <section className="relative pt-32 pb-20 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20">
                      Featured Story
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {featuredPost.title}
                    </h1>
                    
                    <p className="text-lg text-zinc-300 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-6 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600/20 p-1.5 rounded-full">
                          <User size={16} className="text-blue-400" />
                        </div>
                        <span>{featuredPost.author}</span>
                      </div>
                      {featuredPost.read_time && (
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600/20 p-1.5 rounded-full">
                            <Clock size={16} className="text-blue-400" />
                          </div>
                          <span>{featuredPost.read_time} min read</span>
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/blog/${featuredPost.slug}`} className="inline-flex items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors group shadow-lg shadow-blue-900/20">
                      Read Article 
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </Link>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/30 aspect-video">
                    <img 
                      src={featuredPost.image || "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"} 
                      alt={featuredPost.title} 
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/80"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/80 text-white">
                        {featuredPost.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Trending Posts Section */}
          {posts.length > 0 && (
            <section className="py-20 bg-zinc-900/30">
              <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium mb-3">
                      <BookOpen size={14} />
                      <span>Latest Articles</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Trending Stories
                    </h2>
                    <p className="mt-2 text-zinc-400">
                      Discover our most popular articles and insights
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    {!showAllPosts && posts.length > 6 && (
                      <Button 
                        variant="outline" 
                        onClick={handleViewAll} 
                        className="border-blue-600/40 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-all"
                      >
                        View More
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                    
                    <Link to="/blogs">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        All Articles
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedPosts.map(post => (
                    <BlogCard 
                      key={post.id} 
                      {...post} 
                      categories={post.category ? [post.category] : []} 
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* About Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden border border-zinc-800/50 shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" 
                      alt="About" 
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600/20 p-3 rounded-full">
                        <BookOpen size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-zinc-400 text-sm">Total Articles</div>
                        <div className="text-white font-bold text-xl">{posts.length + (featuredPost ? 1 : 0)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium">
                    <User size={14} />
                    <span>About Me</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white">
                    Hey there, I'm Sandesh Shrestha
                  </h2>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    I'm passionate about technology, design, and creating meaningful digital experiences.
                    Through my blog, I share insights, tutorials, and thoughts on the ever-evolving
                    world of tech and development.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    With a focus on web development, UX/UI design, and emerging technologies,
                    I aim to provide valuable content for both beginners and experienced professionals.
                  </p>
                  
                  <Link to="/blogs">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white group">
                      Explore My Articles
                      <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter CTA Section */}
          <section className="py-20 bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-t border-zinc-800/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium">
                  Stay Connected
                </div>
                
                <h2 className="text-3xl font-bold text-white">
                  Subscribe to My Newsletter
                </h2>
                
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Get the latest articles, insights, and updates delivered directly to your inbox.
                </p>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-6 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {!updating && !featuredPost && posts.length === 0 && (
            <div className="text-center py-40">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No Posts Available
                </h3>
                <p className="text-zinc-400">
                  Check back later for new content and updates.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
