import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
type Post = Database['public']['Tables']['posts']['Row'];
type PostInput = Partial<Omit<Post, 'id' | 'created_at'>> & {
  title: string;
  slug: string;
};
const AdminPostForm = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  // Using the state directly instead of a ref for content
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
    read_time: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Define Quill modules and formats
  const modules = {
    toolbar: [[{
      'header': [1, 2, 3, 4, 5, 6, false]
    }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{
      'list': 'ordered'
    }, {
      'list': 'bullet'
    }], ['link', 'image', 'code-block'], ['clean']]
  };
  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'link', 'image', 'code-block'];
  const fetchPost = async () => {
    if (!id) return;
    try {
      const {
        data,
        error
      } = await supabase.from('posts').select().eq('id', id).maybeSingle();
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
          read_time: data.read_time || ""
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
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        toast.error("Invalid file type. Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Please select a file smaller than 5MB.");
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };
  const handleImageUpload = async () => {
    if (!imageFile) return null;
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const {
        error: uploadError,
        data
      } = await supabase.storage.from('images').upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      });
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('images').getPublicUrl(fileName);
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
        image: imageUrl
      };
      if (id) {
        const {
          error
        } = await supabase.from('posts').update(postData).eq('id', id);
        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const {
          error
        } = await supabase.from('posts').insert([postData]).select();
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
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };
  return <AdminLayout>
      <Card className="bg-[#1A1B1E] border-zinc-800 shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} required className="bg-zinc-900 border-zinc-700 text-white" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Author</label>
                <Input name="author" value={formData.author} onChange={handleChange} required className="bg-zinc-900 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Category</label>
                <Input name="category" value={formData.category} onChange={handleChange} required className="bg-zinc-900 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Date</label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} required className="bg-zinc-900 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Image</label>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="bg-zinc-900 border-zinc-700 text-white file:bg-zinc-800 file:text-white file:border-0" />
                {imagePreview && <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-auto max-h-[200px] rounded-lg" />
                  </div>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Slug</label>
                <Input name="slug" value={formData.slug} onChange={handleChange} required className="bg-zinc-900 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Excerpt</label>
                <Input name="excerpt" value={formData.excerpt} onChange={handleChange} required className="bg-zinc-900 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Read Time (in minutes)</label>
                <Input name="read_time" value={formData.read_time} onChange={handleChange} placeholder="e.g. 5" className="bg-zinc-900 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2 flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.featured === true} onChange={() => setFormData(prev => ({
                  ...prev,
                  featured: !prev.featured
                }))} className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2" />
                  <span className="text-sm font-medium text-gray-300">Featured Post</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Content</label>
              <div className="bg-white rounded">
                <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} modules={modules} formats={formats} className="h-[400px] mb-12" /* Adding bottom margin for Quill toolbar */ />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin")} className="border-zinc-700 bg-zinc-300 hover:bg-zinc-200 text-zinc-950">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? "Saving..." : id ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>;
};
export default AdminPostForm;