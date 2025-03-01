import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostInput = Partial<Post> & {
  title: string;
  slug: string;
};

const AdminPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form data, loading, image file, and preview
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    slug: "",
    excerpt: "",
    featured: false,
    read_time: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
  ];

  // Fetch post data if editing an existing post
  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id)
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
      console.error("Error fetching post:", error);
      toast.error("Failed to fetch post data.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Handle image file selection and validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
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
  };

  // Upload image to Supabase storage
  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  // Handle form submission
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

      const postData = { ...formData, image: imageUrl };

      if (id) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Post updated successfully.");
      } else {
        const { error } = await supabase.from("posts").insert([postData]);

        if (error) throw error;
        toast.success("Post created successfully.");
      }

      navigate("/admin");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor content changes
  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-zinc-900 text-zinc-200 p-8">
        <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-zinc-100">
              {id ? "Edit Post" : "Create Post"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter post title"
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <Input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded-md border border-zinc-600"
                  />
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Enter slug"
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Enter excerpt"
                  rows={3}
                  className="w-full bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500 rounded-md p-2"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Read Time (in minutes)</label>
                <Input
                  type="number"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  placeholder="Enter read time"
                  className="bg-zinc-700 text-zinc-200 placeholder-zinc-400 border-zinc-600 focus:border-blue-500"
                />
              </div>

              {/* Featured Post */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, featured: !prev.featured }))
                  }
                  className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out mr-2"
                />
                <label className="text-sm font-medium">Featured Post</label>
              </div>

              {/* Content */}
                <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  className="bg-white text-black placeholder-gray-400 border-zinc-600 focus:border-blue-500"
                />
                </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => navigate("/admin")}
                  variant="outline"
                  className="border-zinc-600 bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-zinc-100"
                >
                  {isLoading ? "Saving..." : id ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPostForm;