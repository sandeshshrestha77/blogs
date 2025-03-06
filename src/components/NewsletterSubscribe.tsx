
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Store the subscriber in Supabase
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])
        .select();
        
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.info('You\'re already subscribed!');
        } else {
          throw error;
        }
      } else {
        toast.success('Thanks for subscribing!');
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-bold text-white">Subscribe to our newsletter</h3>
        <p className="text-zinc-400">Get the latest articles and updates delivered to your inbox.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white w-full"
            required
          />
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            disabled={loading}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;
