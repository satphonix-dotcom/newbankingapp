import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Status = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              System Status
            </h1>
            <div className="space-y-8">
              <div className="p-6 rounded-lg border border-border bg-surface">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <h2 className="text-xl font-semibold">All Systems Operational</h2>
                </div>
                <p className="text-secondary">
                  All services are running smoothly. No incidents reported in the last 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Service Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 rounded border border-border">
                    <span>API Services</span>
                    <span className="text-green-500">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded border border-border">
                    <span>Web Application</span>
                    <span className="text-green-500">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded border border-border">
                    <span>Database Services</span>
                    <span className="text-green-500">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded border border-border">
                    <span>Payment Processing</span>
                    <span className="text-green-500">Operational</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Past Incidents</h3>
                <div className="text-secondary">
                  No incidents reported in the past 90 days.
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
