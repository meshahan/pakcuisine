import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/database";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data) {
        setBlogPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);
  return (
    <>
      <Helmet>
        <title>Blog - Pak Cuisine | Recipes & Stories</title>
        <meta
          name="description"
          content="Explore our blog for authentic Pakistani recipes, cooking tips, cultural stories, and updates from Pak Cuisine."
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <main className="pt-24">
          {/* Hero */}
          <section className="bg-secondary py-16 relative overflow-hidden">
            <div className="absolute inset-0 pattern-overlay opacity-30" />
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Our <span className="text-primary">Blog</span>
              </h1>
              <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
                Recipes, stories, and culinary adventures from the Pak Cuisine kitchen.
              </p>
            </div>
          </section>

          {/* Blog Grid */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading posts...</div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No blog posts available yet.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                    <article
                      key={post.id}
                      className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Image */}
                      <Link to={`/blog/${post.slug}`} className="block relative h-52 overflow-hidden">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.published_at && new Date(post.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <Link to={`/blog/${post.slug}`}>
                          <h2 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center text-primary font-medium hover:underline"
                        >
                          Read More
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
