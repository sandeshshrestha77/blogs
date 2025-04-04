
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
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Save, Eye, X, ArrowLeft, Image, Star, Calendar, User, Tag, Clock, Search, AlertCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  alt_text?: string;
};

// SEO Helper Functions
const generateSeoTitle = (title: string): string => {
  return title.length <= 60 ? title : title.substring(0, 57) + "...";
};

const generateSeoDescription = (content: string): string => {
  // Remove HTML tags and limit to 160 characters
  const plainText = content.replace(/<[^>]+>/g, "");
  return plainText.length <= 160 ? plainText : plainText.substring(0, 157) + "...";
};

const generateKeywords = (title: string, category: string): string => {
  // Extract potential keywords from title
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(word => word.length > 3)
    .slice(0, 5);
  
  // Add category if it exists
  if (category && !words.includes(category.toLowerCase())) {
    words.push(category.toLowerCase());
  }
  
  return words.join(", ");
};

const estimateReadTime = (content: string): string => {
  const plainText = content.replace(/<[^>]+>/g, "");
  const wordCount = plainText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute
  return readingTime.toString();
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
    alt_text: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [seoScore, setSeoScore] = useState(0);
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      [{ align: [] }],
      ["clean"]
    ]
  };
  
  const formats = [
    "header", "bold", "italic", "underline", "strike", "list", "bullet", 
    "link", "image", "code-block", "align"
  ];
  
  useEffect(() => {
    if (id) fetchPost();
  }, [id]);
  
  // Calculate SEO score when relevant fields change
  useEffect(() => {
    const calculateSeoScore = () => {
      let score = 0;
      
      // Title factors
      if (formData.meta_title) {
        const titleLength = formData.meta_title.length;
        if (titleLength >= 40 && titleLength <= 60) score += 20;
        else if (titleLength > 0) score += 10;
      }
      
      // Description factors
      if (formData.meta_description) {
        const descLength = formData.meta_description.length;
        if (descLength >= 140 && descLength <= 160) score += 20;
        else if (descLength > 0) score += 10;
      }
      
      // Keywords factors
      if (formData.keywords && formData.keywords.split(",").length >= 3) score += 20;
      else if (formData.keywords) score += 10;
      
      // Image ALT text
      if (imagePreview && formData.alt_text) score += 20;
      
      // Slug quality
      if (formData.slug && formData.slug.includes(formData.title.toLowerCase().split(" ")[0])) score += 20;
      
      setSeoScore(score);
    };
    
    calculateSeoScore();
  }, [formData.meta_title, formData.meta_description, formData.keywords, formData.alt_text, formData.slug, imagePreview, formData.title]);
  
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
          alt_text: data.alt_text || ""
        });
        
        if (data.image) setImagePreview(data.image);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to fetch post data",
        variant: "destructive"
      });
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
      toast({
        title: "Invalid file type",
        description: "Please select a valid image (JPEG, PNG, or GIF)",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB",
        variant: "destructive"
      });
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
          upsert: false
        });
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive"
      });
      return formData.image;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix form errors before submitting",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const imageUrl = await handleImageUpload();
      
      // Auto-generate SEO fields if they're empty
      const postData = {
        ...formData,
        image: imageUrl,
        updated_at: new Date().toISOString(),
        meta_title: formData.meta_title || generateSeoTitle(formData.title),
        meta_description: formData.meta_description || generateSeoDescription(formData.content),
        keywords: formData.keywords || generateKeywords(formData.title, formData.category),
        read_time: formData.read_time || estimateReadTime(formData.content)
      };
      
      const { error } = id
        ? await supabase.from("posts").update(postData).eq("id", id)
        : await supabase.from("posts").insert([postData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Post ${id ? "updated" : "created"} successfully with optimized SEO`,
      });
      
      navigate("/admin");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive"
      });
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
        meta_title: prev.meta_title || generateSeoTitle(value)
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
        meta_description: generateSeoDescription(content)
      }),
      read_time: prev.read_time || estimateReadTime(content)
    }));
    
    setErrors(prev => ({
      ...prev,
      content: undefined
    }));
  };
  
  const generateSeoFields = () => {
    setFormData(prev => ({
      ...prev,
      meta_title: generateSeoTitle(prev.title),
      meta_description: generateSeoDescription(prev.content),
      keywords: generateKeywords(prev.title, prev.category),
      read_time: estimateReadTime(prev.content)
    }));
    
    toast({
      title: "SEO Fields Generated",
      description: "SEO fields have been auto-generated based on your content",
    });
  };
  
  return <AdminLayout>
      <div>
        <div className="mb-6 flex justify-between items-center bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 -ml-2 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Posts
            </Button>
            <h1 className="text-2xl font-medium text-gray-800 dark:text-white">
              {id ? "Edit Post" : "Create New Post"}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              type="button" 
              onClick={generateSeoFields}
              variant="outline"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
            >
              <Search className="h-4 w-4 mr-2" />
              Generate SEO
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                const formEl = document.getElementById("post-form") as HTMLFormElement;
                if (formEl) formEl.requestSubmit();
              }} 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {id ? "Update Post" : "Publish Post"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardContent className="p-6">
                <form id="post-form" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        Post Title
                      </Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="Enter post title" 
                        className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 text-lg font-medium" 
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        URL Slug
                      </Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 border border-r-0 border-gray-300 dark:border-zinc-600 rounded-l-md">
                          /blog/
                        </span>
                        <Input 
                          id="slug" 
                          name="slug" 
                          value={formData.slug} 
                          onChange={handleChange} 
                          placeholder="post-title-slug" 
                          className="rounded-l-none border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                        />
                      </div>
                      {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        Content
                      </Label>
                      <div className="mt-1 editor-wrapper">
                        <style>
                          {`
                          .editor-wrapper .ql-toolbar.ql-snow {
                            border-color: #d1d5db;
                            border-top-left-radius: 0.375rem;
                            border-top-right-radius: 0.375rem;
                            background-color: #f9fafb;
                          }
                          
                          .dark .editor-wrapper .ql-toolbar.ql-snow {
                            border-color: #4b5563;
                            background-color: #374151;
                          }
                          
                          .editor-wrapper .ql-container.ql-snow {
                            border-color: #d1d5db;
                            border-bottom-left-radius: 0.375rem;
                            border-bottom-right-radius: 0.375rem;
                            min-height: 200px;
                            font-size: 1rem;
                          }
                          
                          .dark .editor-wrapper .ql-container.ql-snow {
                            border-color: #4b5563;
                            background-color: #1f2937;
                            color: #e5e7eb;
                          }
                          
                          .editor-wrapper .ql-editor {
                            min-height: 200px;
                          }
                          `}
                        </style>
                        <ReactQuill 
                          theme="snow" 
                          value={formData.content} 
                          onChange={handleContentChange} 
                          modules={modules} 
                          formats={formats} 
                          className="border-0 rounded-md overflow-hidden text-gray-800 dark:text-gray-200" 
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0 file:text-sm file:font-medium
                      file:bg-indigo-600 file:text-white hover:file:bg-indigo-700
                      dark:file:bg-indigo-600 dark:file:text-white dark:hover:file:bg-indigo-700" 
                  />
                  
                  {imagePreview ? (
                    <div className="mt-4 relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-h-[200px] object-cover rounded-md border border-gray-300 dark:border-zinc-700" 
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                          setFormData(prev => ({
                            ...prev,
                            image: "",
                            alt_text: ""
                          }));
                        }} 
                        className="absolute top-2 right-2 rounded-full h-8 w-8 p-0 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mt-2">
                        <Label htmlFor="alt_text" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Alt Text (important for SEO)
                        </Label>
                        <Input 
                          id="alt_text" 
                          name="alt_text" 
                          value={formData.alt_text} 
                          onChange={handleChange} 
                          placeholder="Describe the image for search engines and accessibility" 
                          className="mt-1 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-md p-8 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Drag and drop an image here, or click to select a file
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Adding a featured image with alt text improves SEO and accessibility
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">Excerpt</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  placeholder="Write a short summary of your post. This will be displayed on blog listings." 
                  className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 min-h-[100px]" 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Excerpts are optional hand-crafted summaries of your content that may appear on search results.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">SEO Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Optimization</div>
                  <div className="text-sm font-bold">
                    {seoScore}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      seoScore >= 80 ? 'bg-green-500' : 
                      seoScore >= 50 ? 'bg-yellow-400' : 'bg-red-500'
                    }`} 
                    style={{ width: `${seoScore}%` }}>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  {seoScore < 80 && (
                    <div className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Click "Generate SEO" for optimized metadata
                      </span>
                    </div>
                  )}
                  
                  {!formData.meta_title && (
                    <div className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Add a meta title (40-60 characters)
                      </span>
                    </div>
                  )}
                  
                  {!formData.meta_description && (
                    <div className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Add a meta description (140-160 characters)
                      </span>
                    </div>
                  )}
                  
                  {imagePreview && !formData.alt_text && (
                    <div className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Add alt text to your featured image
                      </span>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="button" 
                  onClick={generateSeoFields}
                  variant="outline"
                  className="w-full mt-4 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Generate SEO Fields
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">Publish</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <Label htmlFor="date" className="text-sm font-medium">
                        Publish Date
                      </Label>
                    </div>
                    <Input 
                      id="date" 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange} 
                      className="w-auto border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-zinc-700" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Star className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <Label htmlFor="featured" className="text-sm font-medium">
                        Featured Post
                      </Label>
                    </div>
                    <Switch 
                      id="featured" 
                      checked={formData.featured} 
                      onCheckedChange={checked => setFormData(prev => ({
                        ...prev,
                        featured: checked
                      }))} 
                      className="data-[state=checked]:bg-indigo-600" 
                    />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-zinc-700" />
                  
                  <div className="pt-2">
                    <Button 
                      type="button" 
                      onClick={() => {
                        const formEl = document.getElementById("post-form") as HTMLFormElement;
                        if (formEl) formEl.requestSubmit();
                      }} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {id ? "Update" : "Publish"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="author" className="text-gray-700 dark:text-gray-300 font-medium flex items-center mb-1">
                      <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Author
                    </Label>
                    <Input 
                      id="author" 
                      name="author" 
                      value={formData.author} 
                      onChange={handleChange} 
                      placeholder="Enter author name" 
                      className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 font-medium flex items-center mb-1">
                      <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Category
                    </Label>
                    <Input 
                      id="category" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      placeholder="Enter category" 
                      className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="read_time" className="text-gray-700 dark:text-gray-300 font-medium flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Read Time (minutes)
                    </Label>
                    <Input 
                      id="read_time" 
                      type="number" 
                      name="read_time" 
                      value={formData.read_time} 
                      onChange={handleChange} 
                      placeholder="e.g., 5" 
                      min="1" 
                      className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meta_title" className="text-gray-700 dark:text-gray-300 font-medium flex items-center mb-1">
                      <Search className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      SEO Title
                    </Label>
                    <Input 
                      id="meta_title" 
                      name="meta_title" 
                      value={formData.meta_title} 
                      onChange={handleChange} 
                      placeholder="SEO optimized title" 
                      maxLength={70} 
                      className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Recommended: 40-60 characters</span>
                      <span className={`${formData.meta_title.length > 60 ? 'text-red-500' : ''}`}>
                        {formData.meta_title.length}/70
                      </span>
                    </div>
                    {errors.meta_title && <p className="text-red-500 text-sm">{errors.meta_title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="meta_description" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Meta Description
                    </Label>
                    <Textarea 
                      id="meta_description" 
                      name="meta_description" 
                      value={formData.meta_description} 
                      onChange={handleChange} 
                      placeholder="Brief description for search results" 
                      maxLength={160} 
                      className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 min-h-[80px]" 
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Recommended: 140-160 characters</span>
                      <span className={`${formData.meta_description.length > 160 ? 'text-red-500' : ''}`}>
                        {formData.meta_description.length}/160
                      </span>
                    </div>
                    {errors.meta_description && <p className="text-red-500 text-sm">{errors.meta_description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Focus Keywords
                    </Label>
                    <Input 
                      id="keywords" 
                      name="keywords" 
                      value={formData.keywords} 
                      onChange={handleChange} 
                      placeholder="e.g., blog, tutorial, react" 
                      className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate keywords with commas</p>
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
