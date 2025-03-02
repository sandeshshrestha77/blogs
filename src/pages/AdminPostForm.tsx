import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  alt_text?: string;
};

const AdminPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    meta_title: "",
    meta_description: "",
    keywords: "",
    alt_text: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
    "align",
  ];

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          author: data.author || "",
          content: data.content || "",
          category: data.category || "",
          date: data.date?.split("T")[0] || "",
          image: data.image || "",
          excerpt: data.excerpt || "",
          featured: data.featured || false,
          read_time: data.read_time || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          keywords: data.keywords || "",
          alt_text: data.alt_text || "",
        });
        if (data.image) setImagePreview(data.image);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to fetch post data");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.slug) newErrors.slug = "Slug is required";
    if (!formData.content) newErrors.content = "Content is required";
    if (formData.meta_title && formData.meta_title.length > 70) {
      newErrors.meta_title = "SEO title should be 70 characters or less";
    }
    if (formData.meta_description && formData.meta_description.length > 160) {
      newErrors.meta_description = "Meta description should be 160 characters or less";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPEG, PNG, or GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return formData.image;

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return formData.image;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const imageUrl = await handleImageUpload();
      const postData = { 
        ...formData, 
        image: imageUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = id
        ? await supabase.from("posts").update(postData).eq("id", id)
        : await supabase.from("posts").insert([postData]);

      if (error) throw error;
      toast.success(`Post ${id ? "updated" : "created"} successfully`);
      navigate("/admin");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "title" && !id) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: !prev.slug ? generateSlug(value) : prev.slug,
        meta_title: prev.meta_title || value.slice(0, 70),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      ...(prev.excerpt ? {} : { excerpt: content.replace(/<[^>]+>/g, "").slice(0, 150) + "..." }),
      ...(prev.meta_description ? {} : { 
        meta_description: content.replace(/<[^>]+>/g, "").slice(0, 160) 
      }),
    }));
    setErrors(prev => ({ ...prev, content: undefined }));
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-zinc-800 border-zinc-700 shadow-xl">
          <CardHeader className="border-b border-zinc-700">
            <CardTitle className="text-2xl font-semibold text-zinc-100 tracking-tight">
              {id ? "Edit Post" : "Create New Post"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Content Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-zinc-200 font-medium">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a compelling post title"
                    className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-zinc-200 font-medium">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="post-title-slug"
                    className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {errors.slug && <p className="text-red-400 text-sm">{errors.slug}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-zinc-200 font-medium">Content *</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    className="bg-white text-black border-zinc-600 rounded-md shadow-sm"
                  />
                  {errors.content && <p className="text-red-400 text-sm">{errors.content}</p>}
                </div>
              </div>

              <Separator className="bg-zinc-700" />

              {/* Image Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-zinc-100">Image Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-zinc-200 font-medium">Featured Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 file:text-zinc-200 file:bg-zinc-600 file:border-0 file:rounded-md file:px-3 file:py-1 hover:file:bg-zinc-500 transition-all"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-md border border-zinc-600 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alt_text" className="text-zinc-200 font-medium">Image Alt Text</Label>
                    <Input
                      id="alt_text"
                      name="alt_text"
                      value={formData.alt_text}
                      onChange={handleChange}
                      placeholder="Describe the image"
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-zinc-400">Improves SEO and accessibility</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-700" />

              {/* SEO Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-zinc-100">SEO Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title" className="text-zinc-200 font-medium">SEO Title</Label>
                    <Input
                      id="meta_title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      placeholder="Optimize your title for search engines"
                      maxLength={70}
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Recommended: 60-70 characters</span>
                      <span>{formData.meta_title.length}/70</span>
                    </div>
                    {errors.meta_title && <p className="text-red-400 text-sm">{errors.meta_title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description" className="text-zinc-200 font-medium">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      placeholder="Write a compelling description for search results"
                      maxLength={160}
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    />
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Recommended: 150-160 characters</span>
                      <span>{formData.meta_description.length}/160</span>
                    </div>
                    {errors.meta_description && (
                      <p className="text-red-400 text-sm">{errors.meta_description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-zinc-200 font-medium">Focus Keywords</Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      placeholder="e.g., blog, tutorial, react"
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-zinc-400">Separate keywords with commas</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-700" />

              {/* Additional Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-zinc-100">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-zinc-200 font-medium">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Author name"
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-zinc-200 font-medium">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Post category"
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-zinc-200 font-medium">Publish Date</Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="read_time" className="text-zinc-200 font-medium">Read Time (minutes)</Label>
                    <Input
                      id="read_time"
                      type="number"
                      name="read_time"
                      value={formData.read_time}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                      min="1"
                      className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-zinc-200 font-medium">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary of the post"
                    className="bg-zinc-700 text-zinc-200 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured" className="text-zinc-200 font-medium">Featured Post</Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-700">
                <Button
                  type="button"
                  onClick={() => navigate("/admin")}
                  variant="outline"
                  className="bg-zinc-700 border-zinc-600 text-zinc-200 hover:bg-zinc-600 hover:text-zinc-100 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                      Saving...
                    </span>
                  ) : id ? "Update Post" : "Create Post"}
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
