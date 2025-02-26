
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-secondary-dark">Sandesh Shrestha</h3>
          <p className="text-sm mt-2 max-w-sm text-secondary-light">
            Exploring design and creativity through thoughtful articles and insights.
          </p>
        </div>

        <div className="flex space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-light hover:text-primary transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-light hover:text-primary transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-light hover:text-primary transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-secondary-light">
          <p>&copy; {new Date().getFullYear()} Sandesh Shrestha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
