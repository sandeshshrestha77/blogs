import { Github, Twitter, Linkedin } from "lucide-react";
const Footer = () => {
  return <footer className="text-gray-400 border-t border-gray-800 bg-zinc-950">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        {/* About Section */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-white">Sandesh Shrestha</h3>
          <p className="text-sm mt-2 max-w-sm">Exploring design and creativity through articles and insights.</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Github size={22} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Twitter size={22} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Linkedin size={22} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
      </div>
    </footer>;
};
export default Footer;