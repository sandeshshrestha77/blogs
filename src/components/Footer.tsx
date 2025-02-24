import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
<<<<<<< HEAD
  return (
    <footer className="bg-[#0D1117] text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        {/* About Section */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-white">Sandesh Shrestha</h3>
          <p className="text-sm mt-2 max-w-sm">
            Exploring design and creativity through thoughtful articles and insights.
          </p>
=======
  return <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">404 Aesthetics</h3>
            <p className="text-sm">Exploring design, and creativity through thoughtful articles and insights.</p>
          </div>
          
          <div>
            
            <ul className="space-y-2">
              
              
              
              
            </ul>
          </div>
          
          <div>
            
            <ul className="space-y-2">
              
              
              
              
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
>>>>>>> 993c1ea82d6aa7d321fd24897a699158c73cd658
        </div>

        {/* Social Links */}
        <div className="flex space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github size={22} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Twitter size={22} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Linkedin size={22} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
