
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthContent } from "@/components/auth/AuthContent";

const SignIn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <AuthContent />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
