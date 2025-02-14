import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Future of Digital Banking",
      date: "March 15, 2024",
      excerpt: "Explore how AI and blockchain are transforming the banking industry.",
      category: "Technology"
    },
    {
      title: "Managing Your Finances in 2024",
      date: "March 10, 2024",
      excerpt: "Essential tips for personal finance management in the current economy.",
      category: "Personal Finance"
    },
    {
      title: "Security in Digital Banking",
      date: "March 5, 2024",
      excerpt: "Learn about the latest security measures protecting your digital assets.",
      category: "Security"
    },
    {
      title: "Investment Strategies for Beginners",
      date: "March 1, 2024",
      excerpt: "A comprehensive guide to starting your investment journey.",
      category: "Investing"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                Latest from Our Blog
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Insights, updates, and stories from the world of banking and finance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <article 
                  key={index} 
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-accent transition-colors"
                >
                  <div className="text-sm text-secondary mb-2 flex items-center justify-between">
                    <span>{post.date}</span>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-secondary mb-4">{post.excerpt}</p>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    Read more →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
