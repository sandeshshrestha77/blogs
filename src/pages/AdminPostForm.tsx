
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];
type PostInput = Database['public']['Tables']['posts']['Insert'];

const AdminPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostInput>({
    title: "",
    author: "",
    content: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    image: "",
    slug: "",
    excerpt: "",
    featured: false,
    read_time: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .match({ id })
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData(data as PostInput);
      }
    } catch (error) {
      toast.error("Error fetching post");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const fileName = `${Date.now()}-${imageFile.name}`;
    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile);
      
      if (error) throw error;
      
      const imageUrl = supabase.storage
        .from('images')
        .getPublicUrl(fileName).data.publicUrl;
      
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (imageFile) await handleImageUpload();

      if (id) {
        const { error } = await supabase
          .from('posts')
          .update(formData as Post)
          .match({ id });

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([formData]);

        if (error) throw error;
        toast.success("Post created successfully");
      }

      navigate("/admin");
    } catch (error) {
      toast.error("Error saving post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AdminLayout>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input name="author" value={formData.author || ''} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input name="category" value={formData.category || ''} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" name="date" value={formData.date || ''} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input name="slug" value={formData.slug} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea 
                name="content" 
                value={formData.content || ''} 
                onChange={handleChange} 
                required 
                className="w-full min-h-[200px] px-3 py-2 text-sm rounded-md border border-input" 
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin")}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : (id ? "Update" : "Create")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminPostForm;
