import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                Join Our Team
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Help us build the future of banking. We're looking for talented individuals who are passionate about fintech and innovation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h3 className="text-xl font-semibold mb-4">Software Engineer</h3>
                <p className="text-secondary mb-4">
                  Build and maintain our core banking infrastructure using modern technologies.
                </p>
                <div className="flex gap-4 text-sm text-secondary">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>Remote</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h3 className="text-xl font-semibold mb-4">Product Designer</h3>
                <p className="text-secondary mb-4">
                  Create beautiful and intuitive user experiences for our banking platform.
                </p>
                <div className="flex gap-4 text-sm text-secondary">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>Remote</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h3 className="text-xl font-semibold mb-4">Security Engineer</h3>
                <p className="text-secondary mb-4">
                  Ensure the security and compliance of our banking infrastructure.
                </p>
                <div className="flex gap-4 text-sm text-secondary">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>Remote</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h3 className="text-xl font-semibold mb-4">Customer Success</h3>
                <p className="text-secondary mb-4">
                  Help our customers succeed and provide world-class support.
                </p>
                <div className="flex gap-4 text-sm text-secondary">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>Remote</span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-secondary mb-8">
                Don't see a role that fits? Send us your resume anyway!
              </p>
              <button className="px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
