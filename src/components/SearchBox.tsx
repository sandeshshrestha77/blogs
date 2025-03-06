
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search, X } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchPosts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select()
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      searchPosts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-3 pl-4 pr-10 bg-zinc-900 text-white focus:outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleResultClick(post.slug)}
                  className="p-3 hover:bg-zinc-800 cursor-pointer border-t border-zinc-800"
                >
                  <h4 className="text-white font-medium">{post.title}</h4>
                  {post.excerpt && (
                    <p className="text-zinc-400 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                  )}
                </div>
              ))}
            </div>
          ) : query.trim() !== '' ? (
            <div className="p-6 text-center text-zinc-400">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
