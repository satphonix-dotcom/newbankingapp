
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Phone } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "24/7 support for urgent matters",
      action: "Call 1-800-BANKAPP",
      availability: "Available 24/7"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Quick answers to simple questions",
      action: "Start Chat",
      availability: "Available 9AM-6PM"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Detailed support for complex issues",
      action: "Send Email",
      availability: "Response within 24h"
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
                Contact Us
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Have a question or need help? Choose how you'd like to contact us below.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{method.title}</h2>
                  <p className="text-secondary mb-4">{method.description}</p>
                  <button className="w-full px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors mb-2">
                    {method.action}
                  </button>
                  <p className="text-sm text-secondary">{method.availability}</p>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="w-full px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
