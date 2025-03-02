
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
}

const BlogCard = ({
  title,
  excerpt,
  image,
  author,
  date,
  categories,
  slug,
  read_time
}: BlogCardProps) => {
  return (
    <Link 
      to={`/blog/${slug}`} 
      className="group flex flex-col bg-zinc-900/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl border border-zinc-800/50 h-full hover:border-blue-500/30"
    >
      <div className="aspect-[16/9] overflow-hidden bg-zinc-800 relative">
        <img 
          src={image || "https://source.unsplash.com/1200x800/?technology"} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <span 
              key={category} 
              className="px-3 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/20"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 line-clamp-3 mb-4 flex-grow">
          {excerpt}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-zinc-800/50 gap-3">
          {author && (
            <div className="flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              <span className="font-medium text-gray-400">{author}</span>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {date && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-400" />
                <span>{date}</span>
              </div>
            )}
            {read_time && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-blue-400" />
                <span>{read_time} min read</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mb-1">
          <span className="text-sm font-medium">Read article</span>
          <ArrowRightIcon size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
