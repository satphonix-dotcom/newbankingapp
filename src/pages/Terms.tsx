
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              Terms of Service
            </h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Account Terms</h2>
                <p className="text-secondary">
                  You must be 18 years or older to use our services. You are responsible
                  for maintaining the security of your account and password. We cannot and
                  will not be liable for any loss or damage from your failure to comply
                  with this security obligation.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
                <p className="text-secondary">
                  By using our services, you agree to pay all fees associated with your
                  account. Fees are non-refundable except as required by law or as
                  explicitly stated in our refund policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Service Modifications</h2>
                <p className="text-secondary">
                  We reserve the right to modify or discontinue any part of our service
                  with or without notice. We shall not be liable to you or any third party
                  for any modification, suspension, or discontinuance of our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="text-secondary">
                  You expressly understand and agree that we shall not be liable for any
                  direct, indirect, incidental, special, consequential, or exemplary damages
                  resulting from your use of our services.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
