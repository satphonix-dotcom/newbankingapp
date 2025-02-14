import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              Press Room
            </h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
                <div className="space-y-6">
                  <div className="border-b border-border pb-6">
                    <p className="text-sm text-secondary mb-2">March 15, 2024</p>
                    <h3 className="text-xl font-semibold mb-2">BankApp Announces Series B Funding</h3>
                    <p className="text-secondary">
                      BankApp secures $50M in Series B funding to accelerate growth and expand
                      international presence in the digital banking sector.
                    </p>
                  </div>
                  <div className="border-b border-border pb-6">
                    <p className="text-sm text-secondary mb-2">February 28, 2024</p>
                    <h3 className="text-xl font-semibold mb-2">New Partnership with Major Retailers</h3>
                    <p className="text-secondary">
                      Strategic partnership announced with leading retail chains to provide
                      enhanced cashback rewards for BankApp users.
                    </p>
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-secondary mb-2">January 10, 2024</p>
                    <h3 className="text-xl font-semibold mb-2">BankApp Reaches 1 Million Users</h3>
                    <p className="text-secondary">
                      Milestone achievement as BankApp's user base surpasses 1 million active
                      accounts across multiple markets.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Media Resources</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface border border-border">
                    <h3 className="font-semibold mb-2">Press Kit</h3>
                    <p className="text-secondary mb-3">
                      Download our press kit including logos, brand guidelines, and executive headshots.
                    </p>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      Download Press Kit →
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-surface border border-border">
                    <h3 className="font-semibold mb-2">Media Inquiries</h3>
                    <p className="text-secondary mb-3">
                      For press and media inquiries, please contact our communications team.
                    </p>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      Contact Press Team →
                    </button>
                  </div>
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

export default Press;
