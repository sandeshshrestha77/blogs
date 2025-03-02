import { Github, Twitter, Linkedin, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-gradient-to-b from-zinc-900/30 to-zinc-900/90 border-t border-zinc-800/50">
      <div className="container mx-auto py-[32px] px-0">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Sandesh Shrestha Logo" className="h-14 w-auto hover:scale-105 transition-transform duration-300" />
              
            </div>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Exploring design and creativity through articles and insights on technology, 
              design, and development. Join me on this journey of continuous learning 
              and innovation.
            </p>
            <div className="flex space-x-3 pt-2">
              {[{
              icon: Github,
              href: "https://github.com/sandeshshrestha77",
              label: "GitHub"
            }, {
              icon: Twitter,
              href: "https://twitter.com/sandeshstha8",
              label: "Twitter"
            }, {
              icon: Linkedin,
              href: "https://linkedin.com/sandeshshrestha7",
              label: "LinkedIn"
            }, {
              icon: Mail,
              href: "mailto:sandeshstha67@gmail.com",
              label: "Email"
            }].map(({
              icon: Icon,
              href,
              label
            }) => <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 
                  bg-zinc-800/50 hover:bg-blue-600/20 p-3 rounded-full hover:scale-110">
                  <Icon size={20} />
                </a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white tracking-tight relative inline-block 
              after:content-[''] after:absolute after:w-14 after:h-1 after:bg-blue-500 
              after:left-0 after:-bottom-3">
              Quick Links
            </h3>
            <ul className="space-y-4 mt-8">
              {[{
              href: "/",
              label: "Home"
            }, {
              href: "/blogs",
              label: "Blogs"
            }].map(({
              href,
              label
            }) => <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-white transition-colors 
                      duration-300 flex items-center group">
                    <ChevronRight size={16} className="mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white tracking-tight relative inline-block 
              after:content-[''] after:absolute after:w-14 after:h-1 after:bg-blue-500 
              after:left-0 after:-bottom-3">
              Newsletter
            </h3>
            <p className="text-gray-400 mt-8">
              Subscribe to receive updates on new content and features.
            </p>
            <div className="mt-4 flex flex-col space-y-3">
              <input type="email" placeholder="Your email address" className="px-4 py-2.5 bg-zinc-800/70 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800/50 mt-12 pt-8 text-sm text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;