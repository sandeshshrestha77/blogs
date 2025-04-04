
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { toast } from "sonner";
import { ArrowRight, ChevronRight, Clock, User, BookOpen, ArrowUpRight, Code, Figma, Zap, Star } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Helmet } from "react-helmet";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";

type Post = Database['public']['Tables']['posts']['Row'];

const Index = () => {
  const navigate = useNavigate();
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  const { 
    data: posts,
    loading: updating,
  } = useRealtimeData<Post>({
    tableName: 'posts',
    initialQuery: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq('featured', false)
        .order("created_at", { ascending: false })
        .limit(showAllPosts ? 100 : 6);
      
      if (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
      return data || [];
    },
    event: '*'
  });

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select()
          .eq('featured', true)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) setFeaturedPost(data);
      } catch (error) {
        console.error("Error loading featured post:", error);
        toast.error("Error loading featured post");
      }
    };

    fetchFeaturedPost();

    const channel = supabase
      .channel('featured-post-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: 'featured=eq.true'
        },
        () => fetchFeaturedPost()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleViewAll = () => setShowAllPosts(true);
  const displayedPosts = useMemo(() => posts || [], [posts]);

  const metaTitle = "Sandesh Shrestha | Articles & Insights on Technology and Design";
  const metaDescription = "Explore expert guides and tutorials on technology, design, and development...";
  const keywords = "web development, design, technology, tutorials, digital skills, programming";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section with improved visuals and animations */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-in">
              <div className="rounded-2xl overflow-hidden border border-zinc-800/50 shadow-xl transition-all duration-500 hover:shadow-blue-500/10 hover:border-blue-500/20">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" 
                  alt="About" 
                  className="w-full h-auto hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
            
            <div className="space-y-6 py-[16px] mx-0 my-0 animate-slide-in-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium">
                <User size={14} />
                <span>About Me</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Hey there, I'm Sandesh Shrestha
              </h1>
              <p className="text-zinc-300 leading-relaxed text-lg">
                I'm a Graphic & Motion Designer passionate about design, creativity, and technology. 
                This blog is where I share insights on design and motion graphics to help you elevate your creative skills.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="https://sandeshshrestha.xyz" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="lg" className="group">
                    View My Portfolio
                    <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
                  </Button>
                </Link>
                <Link to="/blogs">
                  <Button variant="outline" size="lg" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                    Read My Articles
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - New Addition */}
      <Features />

      {featuredPost && (
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium mb-4">
                <Star size={14} />
                <span>Featured Content</span>
              </div>
              <h2 className="text-3xl font-bold text-white">This Week's Highlight</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20">
                  Featured Story
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {featuredPost.title}
                </h2>
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/30 aspect-video animate-fade-in">
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

      {/* Testimonials Section - New Addition */}
      <Testimonials />

      {displayedPosts.length > 0 && (
        <section className="bg-zinc-950 py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium mb-3">
                  <BookOpen size={14} />
                  <span>Latest Articles</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Latest Stories</h2>
                <p className="mt-2 text-zinc-400">Discover our most recent articles and insights</p>
              </div>
              <div className="flex gap-3 animate-fade-in">
                {!showAllPosts && displayedPosts.length > 6 && (
                  <Button variant="outline" onClick={handleViewAll} className="border-blue-600/40 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-all">
                    View More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
                <Link to="/blogs">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    All Articles
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BlogCard 
                    title={post.title}
                    excerpt={post.excerpt}
                    image={post.image}
                    author={post.author}
                    date={post.date}
                    categories={post.category ? [post.category] : []}
                    slug={post.slug}
                    read_time={post.read_time}
                    alt_text={post.alt_text}
                    meta_title={post.meta_title}
                    meta_description={post.meta_description}
                    views={post.views}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!updating && !featuredPost && (!displayedPosts || displayedPosts.length === 0) && (
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
      
      {/* Call To Action Section - New Addition */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to level up your design skills?</h2>
            <p className="text-xl text-zinc-300 mb-8">Join thousands of designers who get my weekly tips, tutorials, and inspiration.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/blogs">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  Browse Articles
                </Button>
              </Link>
              <a href="https://sandeshshrestha.xyz" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 w-full sm:w-auto">
                  Visit My Portfolio
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
