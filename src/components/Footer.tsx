import { Github, Twitter, Linkedin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="relative bg-zinc-950 border-t border-zinc-800/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto pt-16 pb-8 sm:px-6 lg:px-8 relative z-10 px-0 py-[24px]">
        {/* Main Grid */}
        

        {/* Copyright Section */}
        <div className="border-t border-zinc-800/30 mt-16 pt-8 text-sm text-center text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;