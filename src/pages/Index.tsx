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
        supabase.from("posts").select().eq('featured', false).order("created_at", { ascending: false }).limit(6)
      ]);
      if (featuredResponse.error && featuredResponse.error.code !== 'PGRST116') throw featuredResponse.error;
      if (postsResponse.error) throw postsResponse.error;
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
    const channel = supabase.channel("posts-channel").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "posts"
    }, fetchPosts).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const handleViewAll = () => setShowAllPosts(true);
  const displayedPosts = useMemo(() => showAllPosts ? posts : posts.slice(0, 6), [showAllPosts, posts]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Helmet>
        <title>Sandesh Shrestha | Articles & Insights</title>
        <meta name="description" content="Explore expert guides and tutorials on technology, design, and development." />
      </Helmet>

      <Navbar />

      {initialLoading ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* About Section - Reduced Padding */}
          <section className="relative overflow-hidden py-[80px]">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden border border-zinc-800/50 shadow-xl">
                    <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="About" className="w-full h-auto" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium">
                    <User size={14} />
                    <span>About Me</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Hey there, I'm Sandesh Shrestha</h2>
                  <p className="text-zinc-300">
                    I'm a Graphic & Motion Designer passionate about design, creativity, and technology. This blog shares insights on design and motion graphics. 🚀
                  </p>
                  <Link to="https://sandeshshrestha.xyz" target="_blank">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View My Work
                      <ArrowUpRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Post Section - Adjusted Padding */}
          {featuredPost && (
            <section className="relative pt-16 pb-20">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-white">{featuredPost.title}</h1>
                    <p className="text-zinc-300">{featuredPost.excerpt}</p>
                    <Link to={`/blog/${featuredPost.slug}`} className="inline-flex items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Read Article
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Latest Posts Section - Standardized Padding */}
          {posts.length > 0 && (
            <section className="py-[80px] bg-zinc-950">
              <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Latest Stories</h2>
                    <p className="mt-2 text-zinc-400">Discover our most recent articles and insights</p>
                  </div>
                  <div className="flex gap-3">
                    {!showAllPosts && posts.length > 6 && (
                      <Button variant="outline" onClick={handleViewAll} className="border-blue-600 text-blue-400">
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
                  {displayedPosts.map(post => (
                    <BlogCard key={post.id} {...post} categories={post.category ? [post.category] : []} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;