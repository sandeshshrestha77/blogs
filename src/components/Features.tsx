
import React from 'react';
import { Code, Figma, Zap, Video, Layout, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <Figma className="w-6 h-6 text-purple-400" />,
      title: "Design Insights",
      description: "Deep dives into graphic design principles, trends, and techniques that elevate your visual communication."
    },
    {
      id: 2,
      icon: <Video className="w-6 h-6 text-blue-400" />,
      title: "Motion Graphics",
      description: "Expert tutorials on creating captivating animations and dynamic visual content for various platforms."
    },
    {
      id: 3,
      icon: <Layout className="w-6 h-6 text-green-400" />,
      title: "UI/UX Design",
      description: "Insights on creating intuitive, beautiful interfaces that deliver exceptional user experiences."
    },
    {
      id: 4,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Creative Workflows",
      description: "Productivity tips and creative workflows to help you work more efficiently and effectively."
    },
    {
      id: 5,
      icon: <Code className="w-6 h-6 text-red-400" />,
      title: "Design Tools",
      description: "Guides on mastering industry-standard design software and emerging creative technologies."
    },
    {
      id: 6,
      icon: <Clock className="w-6 h-6 text-teal-400" />,
      title: "Time-Saving Tips",
      description: "Quick techniques and shortcuts that save you hours of work while maintaining professional quality."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 text-sm font-medium mb-4">
            <Zap size={14} />
            <span>What I Cover</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Topics & Expertise</h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Explore the range of design topics and skills covered in my articles and tutorials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="bg-zinc-800/20 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/30 hover:border-blue-500/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-zinc-800/50 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
