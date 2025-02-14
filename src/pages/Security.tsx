import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Lock, Key, AlertTriangle } from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Grade Protection",
      description: "Your funds are protected by state-of-the-art security systems and protocols."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "All transactions and personal data are encrypted using advanced algorithms."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Two-Factor Authentication",
      description: "Additional layer of security for all sensitive operations."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Fraud Detection",
      description: "24/7 monitoring systems to detect and prevent suspicious activities."
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
                Security First Banking
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Your security is our top priority. We employ multiple layers of protection
                to keep your money and data safe.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-secondary">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-surface border border-border">
              <h2 className="text-2xl font-semibold mb-6">Our Security Commitment</h2>
              <div className="space-y-4 text-secondary">
                <p>
                  We are committed to protecting your financial data with the highest
                  security standards in the industry. Our security measures include:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Regular security audits and penetration testing</li>
                  <li>Compliance with international banking security standards</li>
                  <li>Continuous monitoring and threat assessment</li>
                  <li>Regular updates and security patches</li>
                  <li>Dedicated security team working 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
