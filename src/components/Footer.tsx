import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-zinc-900/30 to-zinc-900/50 border-t border-zinc-800/50">
      <div className="container mx-auto px-6 py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* About Section */}
            <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center">
              <img 
              src="/logo.png" 
              alt="Sandesh Shrestha Logo" 
              className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed text-sm">
              Exploring design and creativity through articles and insights on technology, 
              design, and development. Join me on this journey of continuous learning 
              and innovation.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
          { icon: Github, href: "https://github.com/sandeshshrestha77", label: "GitHub" },
          { icon: Twitter, href: "https://twitter.com/sandeshstha8", label: "Twitter" },
          { icon: Linkedin, href: "https://linkedin.com/sandeshshrestha7", label: "LinkedIn" },
          { icon: Mail, href: "mailto:sandeshstha7@gmail.com", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all duration-300 
               p-2 hover:bg-zinc-800/50 rounded-full hover:scale-110"
          >
            <Icon size={20} />
          </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
          { href: "/", label: "Home" },
          { href: "/blogs", label: "Blogs" },
              ].map(({ href, label }) => (
          <li key={label}>
            <a
              href={href}
              className="text-gray-400 hover:text-white transition-colors 
                 duration-300 text-sm hover:translate-x-1 inline-block"
            >
              {label}
            </a>
          </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800/50 mt-8 pt-4 text-sm text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;