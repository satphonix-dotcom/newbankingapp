
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic account features",
        "Up to 3 virtual cards",
        "Standard support",
        "Basic analytics"
      ]
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "For growing needs",
      features: [
        "Everything in Basic",
        "Unlimited virtual cards",
        "Priority support",
        "Advanced analytics",
        "Joint accounts",
        "Custom categories"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integration",
        "API access",
        "Team management",
        "Advanced security"
      ]
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
                Simple, transparent pricing
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Choose the plan that best suits your needs. All plans include our core banking features.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div key={index} className="p-8 rounded-2xl bg-surface border border-border hover:border-accent transition-colors">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-secondary">/month</span>}
                  </div>
                  <p className="text-secondary mb-6">{plan.description}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-8 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                    Get Started
                  </button>
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

export default Pricing;
