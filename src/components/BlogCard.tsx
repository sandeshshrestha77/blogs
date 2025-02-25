
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
      className="group block rounded-xl overflow-hidden bg-white shadow-md border border-gray-200 transition-all hover:shadow-lg"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={image || "https://source.unsplash.com/1200x800/?technology"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <span
              key={category}
              className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{excerpt}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{author}</span>
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
