import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { Database } from "@/integrations/supabase/types";
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
      const [featuredResponse, postsResponse] = await Promise.all([supabase.from("posts").select().eq('featured', true).maybeSingle(), supabase.from("posts").select().eq('featured', false).order("created_at", {
        ascending: false
      })]);
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
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 bg-slate-50">
        {initialLoading ? <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner />
          </div> : <>
            {featuredPost && <section className="mb-16 lg:mb-24">
                <Link to={`/blog/${featuredPost.slug}`} className="relative rounded-2xl overflow-hidden shadow-2xl group block bg-white dark:bg-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={featuredPost.image || "https://source.unsplash.com/1200x800/?technology"} alt={featuredPost.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white backdrop-blur-sm">
                      {featuredPost.category}
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {featuredPost.title}
                    </h1>
                    <p className="mt-3 text-lg text-gray-200 line-clamp-2 max-w-3xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-gray-300">
                      <span className="text-sm">{featuredPost.author}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-sm">{featuredPost.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-sm">{featuredPost.read_time} min read</span>
                    </div>
                    <Button size="lg" className="mt-6 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300">
                      Read Article
                    </Button>
                  </div>
                </Link>
              </section>}

            {posts.length > 0 && <section className="space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-zinc-950">
                      Latest Stories
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Discover our most recent articles and insights
                    </p>
                  </div>
                  {!showAllPosts && posts.length > 6 && <Button variant="outline" size="lg" onClick={handleViewAll} className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      View All Articles
                    </Button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {displayedPosts.map(post => <BlogCard key={post.id} {...post} categories={post.category ? [post.category] : []} />)}
                </div>
              </section>}

            {!updating && !featuredPost && posts.length === 0 && <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    No Posts Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new content and updates.
                  </p>
                </div>
              </div>}
          </>}
      </main>
      <Footer />
    </div>;
};
export default Index;