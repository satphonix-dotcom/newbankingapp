import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <section className="relative overflow-hidden px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary mb-6">
              Smart Banking for the
              <br />
              <span className="bg-gradient-to-r from-[#9EE755] to-[#CFDD3C] bg-clip-text text-transparent">
                Digital Generation
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-secondary mb-8">
              Experience banking reimagined. Simple, secure, and designed for the modern world.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/sign-in">
                <button className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </Link>
              <button 
                onClick={() => {
                  const featuresSection = document.querySelector('#features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 glass rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative mt-16">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/9396fb71-7f39-4df2-a8ab-3e0409f52601.png"
                alt="Hero"
                className="rounded-3xl shadow-2xl max-w-[90%] w-auto h-auto"
              />
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-surface px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-16">Features designed for you</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Secure Transactions",
                  description: "Bank-grade encryption for all your transactions",
                  icon: "🔒",
                },
                {
                  title: "Real-time Updates",
                  description: "Get instant notifications for all account activities",
                  icon: "⚡",
                },
                {
                  title: "Smart Savings",
                  description: "AI-powered insights to help you save more",
                  icon: "💡",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-background border border-border hover:border-accent transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-secondary">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: "How secure is my data?",
                  answer: "We use bank-level encryption to protect all your data and transactions.",
                },
                {
                  question: "What are the fees?",
                  answer: "We believe in transparent pricing with no hidden fees.",
                },
                {
                  question: "How do I get started?",
                  answer: "Download our app and follow the simple registration process.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-background/50"
                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        activeAccordion === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeAccordion === index && (
                    <div className="px-6 py-4 bg-background/50">
                      <p className="text-secondary">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary text-white px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8">Ready to get started?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have already made the switch.
            </p>
            <Link to="/sign-in">
              <button className="px-8 py-4 bg-accent text-primary rounded-full font-semibold hover:bg-accent/90 transition-colors">
                Create Account
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
