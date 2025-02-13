
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Lock, AlertTriangle, Server } from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard protocols."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Two-Factor Authentication",
      description: "Additional security layer to protect your account from unauthorized access."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Fraud Monitoring",
      description: "24/7 monitoring of all transactions to detect and prevent fraudulent activity."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Secure Infrastructure",
      description: "Our systems are hosted in secure, SOC 2 compliant data centers."
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
                Security
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Your security is our top priority. Learn about the measures we take to protect your data and assets.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                  <p className="text-secondary">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Our Security Commitments</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-secondary">Regular security audits and penetration testing by independent firms</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-secondary">Compliance with international security standards and regulations</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-secondary">Continuous monitoring and real-time threat detection</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-secondary">Regular employee security training and awareness programs</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
