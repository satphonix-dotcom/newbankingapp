
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Blog = () => {
  const posts = [
    {
      title: "The Future of Digital Banking",
      category: "Industry Insights",
      date: "March 15, 2024",
      excerpt: "Exploring the latest trends and innovations in digital banking and what they mean for consumers.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
      title: "Security Best Practices for Online Banking",
      category: "Security",
      date: "March 12, 2024",
      excerpt: "Essential tips and guidelines to keep your online banking experience safe and secure.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
    },
    {
      title: "Managing Your Finances in 2024",
      category: "Personal Finance",
      date: "March 10, 2024",
      excerpt: "Expert advice on managing your money effectively in today's economic climate.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                Blog
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Insights, updates, and stories from the BankApp team
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <article key={index} className="rounded-2xl bg-surface border border-border overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-secondary mb-4">{post.excerpt}</p>
                    <button className="text-primary hover:text-accent transition-colors">
                      Read More →
                    </button>
                  </div>
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
