
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle, AlertCircle } from "lucide-react";

const Status = () => {
  const services = [
    {
      name: "API",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None"
    },
    {
      name: "Web App",
      status: "operational",
      uptime: "99.98%",
      lastIncident: "2 days ago"
    },
    {
      name: "Mobile App",
      status: "operational",
      uptime: "99.95%",
      lastIncident: "5 days ago"
    },
    {
      name: "Payment Processing",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None"
    },
    {
      name: "Authentication",
      status: "degraded",
      uptime: "99.90%",
      lastIncident: "Ongoing"
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
                System Status
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>All systems operational</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {services.map((service, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <div className="flex items-center gap-2">
                      {service.status === "operational" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="capitalize">{service.status}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Uptime: {service.uptime}</span>
                    <span>Last incident: {service.lastIncident}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Past Incidents</h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Authentication Degradation</span>
                    <span className="text-sm text-secondary">March 15, 2024</span>
                  </div>
                  <p className="text-secondary">Brief authentication delays affecting some users.</p>
                </div>
                <div className="pb-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">API Performance Issues</span>
                    <span className="text-sm text-secondary">March 10, 2024</span>
                  </div>
                  <p className="text-secondary">Intermittent API latency affecting some regions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Status;
