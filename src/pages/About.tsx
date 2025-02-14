import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              About BankApp
            </h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-secondary">
                  At BankApp, we're on a mission to make banking simpler, faster, and more
                  accessible for everyone. We believe that managing your money should be
                  effortless and empowering.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-secondary">
                  Founded in 2023, BankApp was born from the belief that traditional
                  banking needed a digital transformation. We've built a platform that
                  combines cutting-edge technology with user-friendly design to create
                  the best possible banking experience.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <p className="text-secondary">
                  We prioritize transparency, security, and innovation in everything we do.
                  Our commitment to these values has helped us build trust with our users
                  and create a banking platform that truly serves their needs.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                <p className="text-secondary">
                  Our diverse team of experts in finance, technology, and customer service
                  works tirelessly to ensure that BankApp remains at the forefront of
                  digital banking innovation while providing the best possible service to
                  our users.
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

export default About;
