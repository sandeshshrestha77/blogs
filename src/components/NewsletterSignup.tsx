import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save to newsletter_subscriptions table
      const {
        error: dbError
      } = await supabase.from('newsletter_subscriptions').insert([{
        email
      }]);
      if (dbError) throw dbError;

      // Send welcome email
      const {
        error: emailError
      } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email
        }
      });
      if (emailError) throw emailError;
      toast.success("Thanks for subscribing! Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full mx-auto">
      <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/90 border-0" required />
      <Button type="submit" variant="secondary" disabled={isLoading} className="bg-white hover:bg-white/90 whitespace-nowrap text-zinc-950">
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>;
};
export default NewsletterSignup;