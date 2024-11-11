import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

const FEATURED_POST = {
  title: "The Future of Design Systems in 2024",
  excerpt: "Explore how design systems are evolving and shaping the future of digital product development. From atomic design to AI-powered components.",
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  author: "Sarah Johnson",
  date: "22 Jan 2024",
  categories: ["Design Systems", "Technology"],
  slug: "future-of-design-systems"
};

const BLOG_POSTS = [
  {
    title: "Conversations with Our Favorite London Studio",
    excerpt: "We sat down with London's fast-growing brand and product design studio to find out how they've used our platform to 2x their revenue.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    author: "Olivia Rhye",
    date: "20 Jan 2024",
    categories: ["Design", "Research"],
    slug: "london-studio-conversation"
  },
  {
    title: "A Relentless Pursuit of Perfection in Product Design",
    excerpt: "I began to notice that there was a sharp contrast between well-made, crafted products and poorly made ones, and an even greater distinction between the people who made them.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    author: "Phoenix Baker",
    date: "19 Jan 2024",
    categories: ["Product", "Design"],
    slug: "perfection-in-product-design"
  },
  {
    title: "How to Run a Successful Business With Your Partner",
    excerpt: "Starting a business with your spouse or significant other is an exciting but delicate process and requires a great deal of faith.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    author: "Lana Steiner",
    date: "18 Jan 2024",
    categories: ["Business", "Research"],
    slug: "business-with-partner"
  },
  {
    title: "The Impact of AI on Modern Software Development",
    excerpt: "Artificial Intelligence is revolutionizing how we build software. Learn about the latest trends and tools shaping the future of development.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    author: "Alex Chen",
    date: "17 Jan 2024",
    categories: ["Technology", "AI"],
    slug: "ai-impact-software-development"
  },
  {
    title: "Creating Sustainable Design Practices",
    excerpt: "Discover how design teams are incorporating sustainability into their digital products and processes for a better future.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author: "Emma Wilson",
    date: "16 Jan 2024",
    categories: ["Design", "Sustainability"],
    slug: "sustainable-design-practices"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-primary text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Insights for Creative Minds
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Join our community of designers, developers, and creative professionals. Get weekly insights on design, technology, and business.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-left">Featured Story</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-w-16 aspect-h-9 md:aspect-h-full">
                <img
                  src={FEATURED_POST.image}
                  alt={FEATURED_POST.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-3">
                  {FEATURED_POST.categories.map((category) => (
                    <span
                      key={category}
                      className="text-xs font-medium px-2 py-1 bg-blue-50 text-primary rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-4">{FEATURED_POST.title}</h3>
                <p className="text-gray-600 mb-6">{FEATURED_POST.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>{FEATURED_POST.author}</span>
                  <span className="mx-2">•</span>
                  <span>{FEATURED_POST.date}</span>
                </div>
                <Button className="self-start">Read More</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Posts */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Latest Stories</h2>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-gray-600 mb-8">
              Get the latest articles, resources, and insights about design and development delivered directly to your inbox.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;