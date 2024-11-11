import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for subscribing! Check your email to confirm.");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/90 border-0"
        required
      />
      <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-white/90 whitespace-nowrap">
        Subscribe
      </Button>
    </form>
  );
};

export default NewsletterSignup;