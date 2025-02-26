
import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
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
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setUpdating(true);
      const [featuredResponse, postsResponse] = await Promise.all([
        supabase
          .from("posts")
          .select()
          .eq('featured', true)
          .maybeSingle(),
        supabase
          .from("posts")
          .select()
          .eq('featured', false)
          .order("created_at", { ascending: false })
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
    <div className="min-h-screen bg-accent">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {initialLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {featuredPost && (
              <section className="mb-16">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="relative block aspect-[21/9] rounded-2xl overflow-hidden shadow-lg group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/90 via-secondary-dark/50 to-transparent z-10" />
                  <img
                    src={featuredPost.image || "https://source.unsplash.com/1200x800/?technology"}
                    alt={featuredPost.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-20">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white">
                      {featuredPost.category}
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {featuredPost.title}
                    </h1>
                    <p className="mt-3 text-lg text-gray-200 line-clamp-2 max-w-3xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-gray-300">
                      <span>{featuredPost.author}</span>
                      <span>•</span>
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.read_time} min read</span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {posts.length > 0 && (
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-secondary-dark">
                      Latest Stories
                    </h2>
                    <p className="mt-2 text-secondary-light">
                      Discover our most recent articles and insights
                    </p>
                  </div>
                  {!showAllPosts && posts.length > 6 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAllPosts(true)}
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      View All Articles
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      {...post}
                      categories={post.category ? [post.category] : []}
                    />
                  ))}
                </div>
              </section>
            )}

            {!updating && !featuredPost && posts.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold text-secondary-dark mb-4">
                    No Posts Available
                  </h3>
                  <p className="text-secondary-light">
                    Check back later for new content and updates.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
