import { Github, Twitter, Linkedin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Sandesh Shrestha Logo" className="h-12 w-auto" />
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
                  label: "GitHub",
                },
                {
                  icon: Twitter,
                  href: "https://twitter.com/sandeshstha8",
                  label: "Twitter",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/sandeshshrestha7",
                  label: "LinkedIn",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-all duration-300 bg-zinc-800/50 hover:bg-blue-600/20 p-2.5 rounded-full hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Navigation</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/blogs", label: "Blogs" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight size={16} className="mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800/30 mt-16 pt-8 text-sm text-center text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;