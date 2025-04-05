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
import { PlusCircle, Save, Eye, X, ArrowLeft, Image, Star, Calendar, User, Tag, Clock, Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  alt_text?: string;
};
const AdminPostForm = () => {
  const {
    id
  } = useParams();
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
    alt_text: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const modules = {
    toolbar: [[{
      header: [1, 2, 3, false]
    }], ["bold", "italic", "underline", "strike"], [{
      list: "ordered"
    }, {
      list: "bullet"
    }], ["link", "image", "code-block"], [{
      align: []
    }], ["clean"]]
  };
  const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image", "code-block", "align"];
  useEffect(() => {
    if (id) fetchPost();
  }, [id]);
  const fetchPost = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("posts").select().eq("id", id).maybeSingle();
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
          alt_text: data.alt_text || ""
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
    return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
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
      const {
        error
      } = await supabase.storage.from("images").upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) throw error;
      const {
        data
      } = supabase.storage.from("images").getPublicUrl(fileName);
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
        updated_at: new Date().toISOString()
      };
      const {
        error
      } = id ? await supabase.from("posts").update(postData).eq("id", id) : await supabase.from("posts").insert([postData]);
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
    const {
      name,
      value
    } = e.target;
    if (name === "title" && !id) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: !prev.slug ? generateSlug(value) : prev.slug,
        meta_title: prev.meta_title || value.slice(0, 70)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      ...(prev.excerpt ? {} : {
        excerpt: content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
      }),
      ...(prev.meta_description ? {} : {
        meta_description: content.replace(/<[^>]+>/g, "").slice(0, 160)
      })
    }));
    setErrors(prev => ({
      ...prev,
      content: undefined
    }));
  };
  return <AdminLayout>
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="text-gray-500 hover:text-gray-700 -ml-2 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Posts
            </Button>
            <h1 className="text-2xl font-medium text-gray-800">
              {id ? "Edit Post" : "Add New Post"}
            </h1>
          </div>
          <div className="flex space-x-2">
            
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <form id="post-form" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-700 font-medium mb-1">
                        Add title
                      </Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter post title" className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400 text-lg font-medium" />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="slug" className="text-gray-700 font-medium mb-1">
                        Slug
                      </Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                          /blog/
                        </span>
                        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="post-title-slug" className="rounded-l-none border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                      </div>
                      {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="content" className="text-gray-700 font-medium mb-1">
                        Content
                      </Label>
                      <div className="mt-1">
                        <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} modules={modules} formats={formats} className="border-0 rounded-md overflow-hidden text-gray-800" />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="px-6 py-4 border-b border-gray-200">
                <CardTitle className="text-lg font-medium text-gray-800">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="border-gray-300 bg-white text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0 file:text-sm file:font-medium
                    file:bg-[#2271b1] file:text-white hover:file:bg-[#135e96]" />
                  
                  {imagePreview ? <div className="mt-4 relative">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-[200px] object-cover rounded-md border border-gray-300" />
                      <Button type="button" variant="destructive" size="sm" onClick={() => {
                    setImagePreview("");
                    setImageFile(null);
                    setFormData(prev => ({
                      ...prev,
                      image: ""
                    }));
                  }} className="absolute top-2 right-2 rounded-full h-8 w-8 p-0 bg-white border border-gray-300 hover:bg-red-50 text-gray-700 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mt-2">
                        <Label htmlFor="alt_text" className="text-gray-700 text-sm font-medium">
                          Alt Text
                        </Label>
                        <Input id="alt_text" name="alt_text" value={formData.alt_text} onChange={handleChange} placeholder="Describe the image" className="mt-1 border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                      </div>
                    </div> : <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Drag and drop an image here, or click to select a file
                        </p>
                      </div>
                    </div>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="px-6 py-4 border-b border-gray-200">
                <CardTitle className="text-lg font-medium text-gray-800">Excerpt</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Write a short summary of your post. This will be displayed on blog listings." className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400 min-h-[100px]" />
                <p className="text-xs text-gray-500 mt-2">
                  Excerpts are optional hand-crafted summaries of your content.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="px-6 py-4 border-b border-gray-200">
                <CardTitle className="text-lg font-medium text-gray-800">Publish</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <Label htmlFor="date" className="text-sm font-medium">
                        Publish Date
                      </Label>
                    </div>
                    <Input id="date" type="date" name="date" value={formData.date} onChange={handleChange} className="w-auto border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1]" />
                  </div>
                  
                  <Separator className="bg-gray-200" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                      <Star className="h-4 w-4 mr-2 text-gray-500" />
                      <Label htmlFor="featured" className="text-sm font-medium">
                        Featured Post
                      </Label>
                    </div>
                    <Switch id="featured" checked={formData.featured} onCheckedChange={checked => setFormData(prev => ({
                    ...prev,
                    featured: checked
                  }))} className="data-[state=checked]:bg-[#2271b1]" />
                  </div>
                  
                  <Separator className="bg-gray-200" />
                  
                  <div className="pt-2">
                    <Button type="button" onClick={() => {
                    const formEl = document.getElementById("post-form") as HTMLFormElement;
                    if (formEl) formEl.requestSubmit();
                  }} className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white" disabled={isLoading}>
                      {isLoading ? <span className="flex items-center justify-center">
                          <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                          </svg>
                          Saving...
                        </span> : <>
                          <Save className="h-4 w-4 mr-2" />
                          {id ? "Update" : "Publish"}
                        </>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="px-6 py-4 border-b border-gray-200">
                <CardTitle className="text-lg font-medium text-gray-800">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="author" className="text-gray-700 font-medium flex items-center mb-1">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Author
                    </Label>
                    <Input id="author" name="author" value={formData.author} onChange={handleChange} placeholder="Enter author name" className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-gray-700 font-medium flex items-center mb-1">
                      <Tag className="h-4 w-4 mr-2 text-gray-500" />
                      Category
                    </Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                  </div>
                  
                  <div>
                    <Label htmlFor="read_time" className="text-gray-700 font-medium flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Read Time (minutes)
                    </Label>
                    <Input id="read_time" type="number" name="read_time" value={formData.read_time} onChange={handleChange} placeholder="e.g., 5" min="1" className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="px-6 py-4 border-b border-gray-200">
                <CardTitle className="text-lg font-medium text-gray-800">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meta_title" className="text-gray-700 font-medium flex items-center mb-1">
                      <Search className="h-4 w-4 mr-2 text-gray-500" />
                      SEO Title
                    </Label>
                    <Input id="meta_title" name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="SEO optimized title" maxLength={70} className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Recommended: 60-70 characters</span>
                      <span>{formData.meta_title.length}/70</span>
                    </div>
                    {errors.meta_title && <p className="text-red-500 text-sm">{errors.meta_title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="meta_description" className="text-gray-700 font-medium mb-1">
                      Meta Description
                    </Label>
                    <Textarea id="meta_description" name="meta_description" value={formData.meta_description} onChange={handleChange} placeholder="Brief description for search results" maxLength={160} className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400 min-h-[80px]" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Recommended: 150-160 characters</span>
                      <span>{formData.meta_description.length}/160</span>
                    </div>
                    {errors.meta_description && <p className="text-red-500 text-sm">{errors.meta_description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-gray-700 font-medium mb-1">
                      Focus Keywords
                    </Label>
                    <Input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="e.g., blog, tutorial, react" className="border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#2271b1] focus:border-[#2271b1] placeholder-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>;
};
export default AdminPostForm;