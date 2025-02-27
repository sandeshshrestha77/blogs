
import { Link } from "react-router-dom";

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
      className="group relative flex flex-col bg-[#1A1B1E] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-zinc-800/50"
    >
      <div className="aspect-[16/9] overflow-hidden bg-zinc-900">
        <img
          src={image || "https://source.unsplash.com/1200x800/?technology"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 text-xs font-medium bg-blue-600/10 text-blue-400 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 line-clamp-2 mb-4 flex-grow text-sm">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-zinc-800">
          <span className="font-medium text-gray-400">{author}</span>
          <div className="flex items-center gap-2">
            <span>{date}</span>
            {read_time && (
              <>
                <span>•</span>
                <span>{read_time} min read</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
