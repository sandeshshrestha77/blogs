import { Github, Twitter, Linkedin, Mail } from "lucide-react";
const Footer = () => {
  return <footer className="bg-zinc-900/30 border-t border-zinc-800/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-white">Sandesh Shrestha</h3>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Exploring design and creativity through articles and insights on technology, design and development.
            </p>
            <div className="flex space-x-5 pt-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          

          {/* Categories */}
          

          {/* Newsletter */}
          
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800 mt-16 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;