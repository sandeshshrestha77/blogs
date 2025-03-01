
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-900/30 border-t border-zinc-800/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-white">Sandesh Shrestha</h3>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Exploring design and creativity through articles and insights on technology, design and development.
            </p>
            <div className="flex space-x-5 pt-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>All Articles</span>
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Categories</span>
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>About</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white">Categories</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Technology</span>
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Design</span>
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Development</span>
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Creativity</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white">Stay Connected</h3>
            <p className="text-gray-400 leading-relaxed">
              Join our newsletter to stay updated with the latest articles and insights.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Subscribe Now
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800 mt-16 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
