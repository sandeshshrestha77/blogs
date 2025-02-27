
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
type PostInput = Partial<Omit<Post, 'id' | 'created_at'>> & {
  title: string;
  slug: string;
};

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
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchPost = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          author: data.author || "",
          content: data.content || "",
          category: data.category || "",
          date: data.date || "",
          image: data.image || "",
          excerpt: data.excerpt || "",
          featured: data.featured || false,
          read_time: data.read_time || "",
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      }
    } catch (error) {
      toast.error("Error fetching post");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Cleanup preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      // Generate a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const uploadedImageUrl = await handleImageUpload();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const postData = {
        ...formData,
        image: imageUrl,
      };

      if (id) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postData])
          .select();

        if (error) throw error;
        toast.success("Post created successfully");
      }

      navigate("/admin");
    } catch (error) {
      toast.error("Error saving post");
      console.error('Error:', error);
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
      <Card className="bg-[#1A1B1E] border-zinc-800 shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title</label>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Author</label>
                <Input 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Category</label>
                <Input 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Date</label>
                <Input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Image</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="bg-zinc-900 border-zinc-700 text-white file:bg-zinc-800 file:text-white file:border-0"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-auto max-h-[200px] rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Slug</label>
                <Input 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange} 
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Excerpt</label>
                <Input 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Content</label>
              <textarea 
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                required 
                className="w-full min-h-[200px] px-3 py-2 text-sm rounded-md bg-zinc-900 border border-zinc-700 text-white" 
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin")}
                className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Saving..." : (id ? "Update" : "Create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminPostForm;
