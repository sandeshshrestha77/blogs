
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BookOpen } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];

const Blogs = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("posts").select();
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setPosts(data);
      
      // Get unique categories for the filter
      if (!selectedCategory) {
        const uniqueCategories = Array.from(
          new Set(data?.map(post => post.category).filter(Boolean) as string[])
        );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error("Error loading blog posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);
  
  useEffect(() => {
    fetchPosts();
    
    const channel = supabase.channel("blogs-page")
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
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20 mb-6">
            <BookOpen size={16} className="mr-2" />
            All Articles
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Our Blog Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover in-depth articles, tutorials, and insights on technology, design, and development.
          </p>
        </div>
        
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl -z-0"></div>
      </section>
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 border-y border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <button 
                onClick={() => handleCategorySelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
                }`}
              >
                All Categories
              </button>
              
              {categories.map((category) => (
                <button 
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <BlogCard 
                  key={post.id} 
                  {...post} 
                  categories={post.category ? [post.category] : []} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-white mb-4">
                No posts found
              </h3>
              <p className="text-gray-400">
                {selectedCategory 
                  ? `No posts found in the ${selectedCategory} category.` 
                  : "No blog posts available at the moment."}
              </p>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View All Posts
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blogs;
