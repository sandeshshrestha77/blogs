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

const BlogCard = ({ title, excerpt, image, author, date, categories, slug }: BlogCardProps) => {
  return (
    <Link to={`/blog/${slug}`} className="group">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-3">
            {categories.map((category) => (
              <span
                key={category}
                className="text-xs font-medium px-2 py-1 bg-blue-50 text-primary rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{excerpt}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{author}</span>
            <span className="mx-2">•</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;