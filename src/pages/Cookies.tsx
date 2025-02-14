import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              Cookie Policy
            </h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
                <p className="text-secondary">
                  Cookies are small text files that are placed on your computer or mobile device
                  when you visit our website. They help us make our site work better for you
                  and provide us with insights about how our site is being used.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
                <p className="text-secondary">
                  We use cookies to remember your preferences, understand how you use our site,
                  and improve your experience. This includes remembering your login status,
                  language preferences, and other settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                <p className="text-secondary">
                  We use both session cookies, which expire when you close your browser,
                  and persistent cookies, which stay on your device until they expire or
                  you delete them. We also use essential cookies for our site to function
                  and analytical cookies to improve our service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
                <p className="text-secondary">
                  You can control and manage cookies in your browser settings. Please note
                  that removing or blocking cookies may impact your user experience and
                  some features of our site may not work as intended.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
