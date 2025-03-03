
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BookOpen, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];

const Blogs = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("posts").select();
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Apply search filter on client side
      let filteredData = data || [];
      if (searchQuery) {
        const lowercaseQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(post => 
          post.title.toLowerCase().includes(lowercaseQuery) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(lowercaseQuery)) ||
          (post.category && post.category.toLowerCase().includes(lowercaseQuery))
        );
      }
      
      setPosts(filteredData);
      
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
  }, [selectedCategory, searchQuery]);
  
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20 mb-6">
            <BookOpen size={16} className="mr-2" />
            All Articles
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Explore Our Articles
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
            Discover in-depth articles, tutorials, and insights on technology, design, and development.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                type="submit"
                className="absolute inset-y-1 right-1 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 border-y border-zinc-800/50 bg-zinc-900/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <div className="flex items-center pr-2 text-zinc-400 mr-2">
                <Filter size={16} className="mr-2" />
                <span>Filter by:</span>
              </div>
              
              <button 
                onClick={() => handleCategorySelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
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
                      : 'bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
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
            <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800/50">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-zinc-800/50 text-zinc-300 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                No posts found
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try different keywords.` 
                  : selectedCategory 
                    ? `No posts found in the ${selectedCategory} category.` 
                    : "No blog posts available at the moment."}
              </p>
              {(selectedCategory || searchQuery) && (
                <Button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Reset Filters
                </Button>
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
