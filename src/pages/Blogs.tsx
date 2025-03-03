import { Link } from "react-router-dom";

type BlogCardProps = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  created_at: string;
};

const BlogCard = ({ id, title, slug, excerpt, image, category, created_at }: BlogCardProps) => {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 mb-4 line-clamp-2">{excerpt}</p>
        <p className="text-zinc-500 text-sm mb-4">
          {new Date(created_at).toLocaleDateString()} | {category}
        </p>
        <Link 
          to={`/blog/${slug}`} 
          className="text-blue-500 hover:underline font-medium"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
