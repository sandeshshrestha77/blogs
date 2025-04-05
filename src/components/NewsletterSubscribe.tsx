
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Instead of using rpc which is causing type issues, 
      // let's directly insert into the newsletter_subscribers table
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (data) {
        toast.error("Email already subscribed");
        setIsLoading(false);
        return;
      }
      
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
      
      if (insertError) {
        throw insertError;
      }
      
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2 text-gray-900">Subscribe to Our Newsletter</h3>
      <p className="text-gray-600 mb-4">Get the latest posts delivered straight to your inbox.</p>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow"
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            ) : (
              <span className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
