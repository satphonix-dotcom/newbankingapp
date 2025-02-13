
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      name: "David Kim",
      role: "Head of Security",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
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
                About BankApp
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                We're on a mission to make banking simple, secure, and accessible to everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 mb-24">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-secondary mb-4">
                  Founded in 2020, BankApp was born from a simple idea: banking should be easy and accessible to everyone. We saw how traditional banks were failing to meet the needs of modern consumers and businesses.
                </p>
                <p className="text-secondary">
                  Today, we're proud to serve millions of customers worldwide, providing them with the tools they need to manage their money effectively and securely.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Security First</h3>
                      <p className="text-secondary">Your security and privacy are our top priorities.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Transparency</h3>
                      <p className="text-secondary">We believe in clear, honest communication with our customers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Innovation</h3>
                      <p className="text-secondary">We continuously innovate to provide the best banking experience.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                Meet the people behind BankApp who are working to revolutionize banking.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-secondary">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
