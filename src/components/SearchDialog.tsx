
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  title: string;
  slug: string;
  excerpt: string | null;
}

export function SearchDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (search.length > 2) {
      searchPosts();
    } else {
      setResults([]);
    }
  }, [search]);

  const searchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('title, slug, excerpt')
      .ilike('title', `%${search}%`)
      .limit(5);

    if (data) {
      setResults(data as SearchResult[]);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    navigate(`/blog/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white ml-1">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="sr-only">Search Posts</DialogTitle>
        <div className="space-y-4">
          <Input 
            placeholder="Search posts..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            autoFocus 
            className="bg-zinc-900 border-zinc-800"
          />
          <div className="space-y-2">
            {results.map((result) => (
              <button
                key={result.slug}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left hover:bg-zinc-800 transition-colors"
                onClick={() => handleSelect(result.slug)}
              >
                <h4 className="font-medium text-white">{result.title}</h4>
                {result.excerpt && (
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                    {result.excerpt}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
