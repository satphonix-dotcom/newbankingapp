
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Press = () => {
  const pressReleases = [
    {
      title: "BankApp Raises $50M Series B to Accelerate Growth",
      date: "March 15, 2024",
      excerpt: "Funding will be used to expand product offerings and enter new markets."
    },
    {
      title: "BankApp Launches Revolutionary Mobile Banking Features",
      date: "March 1, 2024",
      excerpt: "New features include AI-powered budgeting and instant international transfers."
    },
    {
      title: "BankApp Named Top Fintech Startup of 2024",
      date: "February 15, 2024",
      excerpt: "Recognition highlights company's innovative approach to digital banking."
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo",
      format: "PNG, SVG",
      size: "2.5 MB"
    },
    {
      title: "Brand Guidelines",
      format: "PDF",
      size: "4.8 MB"
    },
    {
      title: "Product Screenshots",
      format: "ZIP",
      size: "15.2 MB"
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
                Press Room
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Get the latest news and updates about BankApp
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-6">Latest News</h2>
                <div className="space-y-6">
                  {pressReleases.map((release, index) => (
                    <div key={index} className="p-6 rounded-2xl bg-surface border border-border">
                      <div className="text-sm text-secondary mb-2">{release.date}</div>
                      <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                      <p className="text-secondary mb-4">{release.excerpt}</p>
                      <button className="text-primary hover:text-accent transition-colors">
                        Read More →
                      </button>
                    </div>
                  