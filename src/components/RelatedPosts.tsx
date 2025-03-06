
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];

interface RelatedPostsProps {
  currentPostId: string;
  category?: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, category }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('posts').select();
        
        // If we have a category, filter by it
        if (category) {
          query = query.eq('category', category);
        }
        
        // Exclude current post
        query = query.neq('id', currentPostId);
        
        // Get most recent posts
        query = query.order('created_at', { ascending: false });
        
        // Limit to 3 posts
        query = query.limit(3);
        
        const { data, error } = await query;
        
        if (error) throw error;
        if (data) setPosts(data);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedPosts();
  }, [currentPostId, category]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-zinc-800 pt-8">
      <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image || 'https://images.unsplash.com/photo-1572177812156-58036aae439c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h4>
                <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
