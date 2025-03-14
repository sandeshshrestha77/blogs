import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/30 overflow-hidden py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-400">
        <p className="text-sm">&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://github.com/sandeshshrestha77" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <Github size={20} />
          </a>
          <a href="https://twitter.com/sandeshstha8" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <Twitter size={20} />
          </a>
          <a href="https://linkedin.com/in/sandeshshrestha7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
