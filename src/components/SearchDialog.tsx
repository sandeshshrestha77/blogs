import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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

    setResults(data || []);
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    navigate(`/blog/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-muted-foreground sm:w-64 lg:w-80">
          <Search className="mr-2 h-4 w-4" />
          Search posts...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <div className="space-y-4">
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="space-y-2">
            {results.map((result) => (
              <button
                key={result.slug}
                className="w-full rounded-lg border p-4 text-left hover:bg-muted"
                onClick={() => handleSelect(result.slug)}
              >
                <h4 className="font-medium">{result.title}</h4>
                {result.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
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