import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  categories: string[];
  slug: string;
}

const BlogCard = ({
  title,
  excerpt,
  image,
  author,
  date,
  categories,
  slug,
}: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group block rounded-xl overflow-hidden bg-white shadow-md border border-gray-200 transition-all hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Categories */}
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

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{excerpt}</p>

        {/* Author & Date */}
        <div className="flex items-center text-sm text-gray-500">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
