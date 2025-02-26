
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
  read_time,
}: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={image || "https://source.unsplash.com/1200x800/?technology"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 text-xs font-medium bg-primary-light text-primary rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-secondary-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-secondary line-clamp-2 mb-4 flex-grow text-sm">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-secondary-light mt-auto pt-4 border-t border-gray-100">
          <span className="font-medium">{author}</span>
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
