
import { Github, Twitter, Linkedin, Mail, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be where you'd handle the subscription logic
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/30 border border-zinc-700/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
              <p className="mt-2 text-zinc-300">
                Subscribe to my newsletter to receive the latest updates and insights.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 bg-zinc-800/70 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[240px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Sandesh Shrestha Logo" className="h-12 w-auto" />
              <span className="text-white font-semibold text-xl">Sandesh Shrestha</span>
            </div>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              Exploring design and creativity through articles and insights on technology, 
              design, and development. Join me on this journey of continuous learning 
              and innovation.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                {
                  icon: Github,
                  href: "https://github.com/sandeshshrestha77",
                  label: "GitHub"
                }, 
                {
                  icon: Twitter,
                  href: "https://twitter.com/sandeshstha8",
                  label: "Twitter"
                }, 
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/sandeshshrestha7",
                  label: "LinkedIn"
                }, 
                {
                  icon: Mail,
                  href: "mailto:sandeshstha67@gmail.com",
                  label: "Email"
                }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-all duration-300 
                  bg-zinc-800/50 hover:bg-blue-600/20 p-2.5 rounded-full hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                {
                  href: "/",
                  label: "Home"
                }, 
                {
                  href: "/blogs",
                  label: "Blogs"
                }
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-zinc-400 hover:text-white transition-colors 
                    duration-300 flex items-center group"
                  >
                    <ChevronRight size={16} className="mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              Contact
            </h3>
            <ul className="space-y-3 text-zinc-400">
              <li>
                <a href="mailto:sandeshstha67@gmail.com" className="hover:text-white transition-colors">
                  sandeshstha67@gmail.com
                </a>
              </li>
              <li>
                <a href="https://twitter.com/sandeshstha8" className="hover:text-white transition-colors">
                  @sandeshstha8
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800/30 mt-16 pt-8 text-sm text-center text-zinc-400">
          <p>
            &copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
