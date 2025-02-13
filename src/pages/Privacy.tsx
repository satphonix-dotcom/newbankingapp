
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              Privacy Policy
            </h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="text-secondary">
                  We collect information you provide directly to us, including when you create an account,
                  make a transaction, or contact us for support. This may include your name, email,
                  phone number, and financial information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="text-secondary">
                  We use the information we collect to provide, maintain, and improve our services,
                  to process your transactions, and to communicate with you about your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                <p className="text-secondary">
                  We do not sell your personal information. We may share your information with
                  third-party service providers who assist us in operating our platform and
                  providing our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="text-secondary">
                  We implement appropriate technical and organizational measures to protect
                  your personal information against unauthorized access, alteration, or destruction.
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

export default Privacy;
