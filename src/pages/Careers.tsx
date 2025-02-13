
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Careers = () => {
  const departments = [
    {
      name: "Engineering",
      positions: [
        {
          title: "Senior Backend Engineer",
          location: "Remote",
          type: "Full-time"
        },
        {
          title: "Frontend Developer",
          location: "New York, NY",
          type: "Full-time"
        }
      ]
    },
    {
      name: "Product",
      positions: [
        {
          title: "Product Manager",
          location: "San Francisco, CA",
          type: "Full-time"
        },
        {
          title: "UX Designer",
          location: "Remote",
          type: "Full-time"
        }
      ]
    },
    {
      name: "Marketing",
      positions: [
        {
          title: "Content Marketing Manager",
          location: "London, UK",
          type: "Full-time"
        },
        {
          title: "Digital Marketing Specialist",
          location: "Remote",
          type: "Contract"
        }
      ]
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
                Join Our Team
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Help us build the future of banking. We're looking for talented individuals to join our growing team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h2 className="text-xl font-semibold mb-4">Why BankApp?</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Competitive salary and equity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Flexible remote work options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Comprehensive health benefits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Professional development budget</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h2 className="text-xl font-semibold mb-4">Our Values</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Customer First</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Innovation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Transparency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Collaboration</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              {departments.map((department, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-semibold mb-4">{department.name}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {department.positions.map((position, posIndex) => (
                      <div key={posIndex} className="p-6 rounded-2xl bg-surface border border-border">
                        <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                        <div className="flex items-center gap-4 text-secondary mb-4">
                          <span>{position.location}</span>
                          <span>•</span>
                          <span>{position.type}</span>
                        </div>
                        <button className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
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

export default Careers;
