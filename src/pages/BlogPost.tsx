import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// This would typically come from an API or database
const getBlogPost = (slug: string) => {
  const allPosts = [
    {
      title: "The Future of Design Systems in 2024",
      content: `Design systems are evolving rapidly as digital products become more complex and teams grow larger. In 2024, we're seeing a shift towards more intelligent, adaptive design systems that can scale with organizations while maintaining consistency and efficiency.

      One of the key trends is the integration of AI-powered components that can adapt to user behavior and context. This means design systems are becoming more dynamic and responsive to user needs, while still maintaining the core principles of consistency and usability.
      
      Another significant development is the emphasis on accessibility and inclusive design. Modern design systems are being built with accessibility in mind from the ground up, ensuring that digital products can be used by everyone, regardless of their abilities.`,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      author: "Sarah Johnson",
      date: "22 Jan 2024",
      categories: ["Design Systems", "Technology"],
      slug: "future-of-design-systems"
    },
    {
      title: "Conversations with Our Favorite London Studio",
      content: `In a recent sit-down with one of London's fastest-growing brand and product design studios, we uncovered fascinating insights into how they've leveraged our platform to double their revenue in just one year.

      The studio, known for its innovative approach to digital product design, shared their journey of transformation and the key strategies that led to their success. From implementing efficient workflow processes to adopting cutting-edge design tools, their story is both inspiring and instructive.
      
      What stood out most was their emphasis on collaboration and client communication. By using our platform's features to streamline their design review process, they were able to significantly reduce feedback cycles and improve client satisfaction.`,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      author: "Olivia Rhye",
      date: "20 Jan 2024",
      categories: ["Design", "Research"],
      slug: "london-studio-conversation"
    },
    {
      title: "A Relentless Pursuit of Perfection in Product Design",
      content: `The journey of product design is one of constant refinement and attention to detail. Through years of experience, I've come to appreciate the stark contrast between well-crafted products and those that fall short of excellence.

      This observation extends beyond mere aesthetics – it's about the entire user experience, from the initial interaction to long-term usage. The difference often lies in the dedication of the teams behind these products and their commitment to quality.
      
      In this article, we'll explore the principles that guide exceptional product design and the methodologies that separate outstanding products from mediocre ones.`,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      author: "Phoenix Baker",
      date: "19 Jan 2024",
      categories: ["Product", "Design"],
      slug: "perfection-in-product-design"
    },
    {
      title: "How to Run a Successful Business With Your Partner",
      content: `Starting a business with your spouse or significant other can be both rewarding and challenging. This comprehensive guide explores the essential elements of maintaining a healthy business partnership while preserving your personal relationship.

      We'll discuss practical strategies for setting boundaries, defining roles, and managing conflicts effectively. Drawing from real-world examples and expert advice, this article provides valuable insights for couples considering or currently running a business together.
      
      Learn how successful couples navigate the complexities of mixing business with pleasure, and discover key principles for maintaining both professional and personal harmony.`,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      author: "Lana Steiner",
      date: "18 Jan 2024",
      categories: ["Business", "Research"],
      slug: "business-with-partner"
    },
    {
      title: "The Impact of AI on Modern Software Development",
      content: `Artificial Intelligence is revolutionizing the software development landscape, introducing new tools and methodologies that are changing how we build and maintain applications.

      From automated code generation to intelligent testing systems, AI is enhancing developer productivity and code quality. This article explores the latest trends and tools that are shaping the future of software development.
      
      We'll examine real-world applications of AI in development workflows and discuss how teams can effectively integrate these technologies into their existing processes.`,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      author: "Alex Chen",
      date: "17 Jan 2024",
      categories: ["Technology", "AI"],
      slug: "ai-impact-software-development"
    }
  ];

  return allPosts.find((post) => post.slug === slug);
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getBlogPost(slug || "");

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="text-primary hover:underline mb-8 inline-block">
              ← Back to all posts
            </Link>
          </div>

          <div className="flex gap-2 mb-4">
            {post.categories.map((category) => (
              <span
                key={category}
                className="text-xs font-medium px-2 py-1 bg-blue-50 text-primary rounded-full"
              >
                {category}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
          </div>

          <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;