
import { Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowRightIcon } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string | null;
  image: string | null;
  author: string | null;
  date: string | null;
  categories: string[];
  slug: string;
  read_time: string | null;
  alt_text?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

const BlogCard = ({
  title,
  excerpt,
  image,
  author,
  date,
  categories,
  slug,
  read_time,
  alt_text,
  meta_title,
  meta_description
}: BlogCardProps) => {
  // Use SEO fields if available, otherwise fall back to regular fields
  const displayTitle = meta_title || title;
  const displayExcerpt = meta_description || excerpt;
  const imageAlt = alt_text || title;
  
  return (
    <Link 
      to={`/blog/${slug}`} 
      className="group flex flex-col bg-zinc-900/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl border border-zinc-800/50 h-full hover:border-blue-500/30"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
        <img 
          src={image || "https://source.unsplash.com/1200x800/?technology"} 
          alt={imageAlt} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          loading="lazy" 
          width="600"
          height="338"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col flex-grow p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.slice(0, 2).map(category => (
            <span 
              key={category} 
              className="px-2 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/20"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {displayTitle}
        </h3>

        <p className="text-sm sm:text-base text-gray-400 line-clamp-2 sm:line-clamp-3 mb-3 flex-grow">
          {displayExcerpt}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mt-auto pt-3 border-t border-zinc-800/50 gap-2 sm:gap-3">
          {author && (
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-blue-400" />
              <span className="font-medium text-gray-400 truncate max-w-[120px]">{author}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-blue-400" />
                <span>{date}</span>
              </div>
            )}
            {read_time && (
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-blue-400" />
                <span>{read_time} min</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mb-1">
          <span className="text-xs sm:text-sm font-medium">Read article</span>
          <ArrowRightIcon size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
