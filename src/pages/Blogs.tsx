
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Search, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";
import { Helmet } from "react-helmet";

type Post = Database['public']['Tables']['posts']['Row'];

const Blogs = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [showTrending, setShowTrending] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("posts").select();
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      if (showTrending) {
        query = query.order("views", {
          ascending: false,
          nullsFirst: false
        });
      } else {
        query = query.order("created_at", {
          ascending: false
        });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      let filteredData = data || [];
      
      if (searchQuery) {
        const lowercaseQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(post => 
          post.title.toLowerCase().includes(lowercaseQuery) || 
          post.excerpt && post.excerpt.toLowerCase().includes(lowercaseQuery) || 
          post.category && post.category.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      setPosts(filteredData);
      
      if (!selectedCategory) {
        const uniqueCategories = Array.from(
          new Set(data?.map(post => post.category).filter(Boolean) as string[])
        );
        setCategories(uniqueCategories);
      }
      
      if (!showTrending) {
        const { data: trendingData, error: trendingError } = await supabase
          .from("posts")
          .select()
          .order("views", {
            ascending: false,
            nullsFirst: false
          })
          .limit(4);
        
        if (!trendingError && trendingData) {
          setTrendingPosts(trendingData);
        }
      }
    } catch (error) {
      toast.error("Error loading blog posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, showTrending]);

  useEffect(() => {
    fetchPosts();
    
    const channel = supabase
      .channel("blogs-page")
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
    setShowTrending(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTrending(false);
    fetchPosts();
  };

  const toggleTrendingView = () => {
    setShowTrending(!showTrending);
    setSelectedCategory(null);
  };

  const metaTitle = selectedCategory 
    ? `${selectedCategory} Articles | Sandesh Shrestha's Blog` 
    : "All Articles | Sandesh Shrestha's Blog";
    
  const metaDescription = selectedCategory 
    ? `Explore our collection of articles about ${selectedCategory}. Expert guides, tutorials, and insights to help you master ${selectedCategory}.` 
    : "Discover in-depth articles, tutorials, and insights on technology, design, and development from Sandesh Shrestha.";
    
  const keywords = categories.join(", ") + ", blog, articles, tutorials";

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
        {posts[0]?.image && <meta property="og:image" content={posts[0].image} />}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {posts[0]?.image && <meta name="twitter:image" content={posts[0].image} />}
        
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <Navbar />
      
      <section className="pt-36 pb-16 relative overflow-hidden py-[80px]">
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
                onChange={e => setSearchQuery(e.target.value)} 
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
      
      <section className="border-y border-zinc-800/50 bg-zinc-900/30 py-[16px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="flex items-center pr-2 text-zinc-400 mr-2">
              <Filter size={16} className="mr-2" />
              <span>Filter by:</span>
            </div>
            
            <button 
              onClick={() => handleCategorySelect(null)} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null && !showTrending ? 'bg-blue-600 text-white' : 'bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
            >
              All Categories
            </button>
            
            {categories.map(category => (
              <button 
                key={category} 
                onClick={() => handleCategorySelect(category)} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
  
      <section className="py-20">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              {showTrending && (
                <div className="mb-8 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Trending Articles
                  </h2>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <BlogCard 
                    key={post.id} 
                    {...post} 
                    categories={post.category ? [post.category] : []} 
                    views={post.views} 
                  />
                ))}
              </div>
              
              {!showTrending && trendingPosts.length > 0}
            </>
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
                    : "No blog posts available at the moment."
                }
              </p>
              {(selectedCategory || searchQuery || showTrending) && (
                <Button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setShowTrending(false);
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
