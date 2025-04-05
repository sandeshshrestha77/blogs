
import React from 'react';
import { MessageSquare } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "UI Designer",
      content: "Sandesh's motion design tutorials completely transformed my approach to animation. His techniques are practical and immediately applicable.",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Art Director",
      content: "The clarity and depth of Sandesh's articles have helped me solve complex design challenges. His insights are invaluable to any creative professional.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Freelance Designer",
      content: "Following Sandesh's blog has been a game-changer for my freelance career. His practical advice and techniques have helped me win more clients.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
    }
  ];

  return (
    <section className="py-24 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium mb-4">
            <MessageSquare size={14} />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl font-bold text-white">What Others Are Saying</h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Hear from designers and creatives who have enhanced their skills through my content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-zinc-800/30 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/30 hover:border-blue-500/20 transition-all duration-300 animate-fade-in hover:shadow-lg hover:shadow-blue-900/5"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30" 
                />
                <div>
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-zinc-300 italic">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
