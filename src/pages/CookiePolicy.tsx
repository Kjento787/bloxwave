import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 19, 2026</p>
          
          <ScrollArea className="h-auto">
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                  when you visit a website. They are widely used to make websites work more efficiently, 
                  provide a better user experience, and give website owners information about how their 
                  site is being used.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bloxwave uses cookies and similar tracking technologies for various purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>To keep you signed in to your account</li>
                  <li>To remember your preferences and settings</li>
                  <li>To understand how you use our Service</li>
                  <li>To improve and optimize our Service</li>
                  <li>To personalize content and recommendations</li>
                  <li>To provide security features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="text-xl font-medium mb-2 text-foreground">Essential Cookies</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Purpose:</strong> Required for the Service to function properly
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Duration:</strong> Session to 1 year
                    </p>
                    <p className="text-muted-foreground text-sm">
                      These cookies are necessary for you to browse and use features of the Service, 
                      such as accessing secure areas. Without these cookies, services like authentication 
                      cannot be provided.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="text-xl font-medium mb-2 text-foreground">Functional Cookies</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Purpose:</strong> Remember your preferences and choices
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Duration:</strong> Up to 1 year
                    </p>
                    <p className="text-muted-foreground text-sm">
                      These cookies allow us to remember choices you make (such as theme preference, 
                      language, or region) and provide enhanced, personalized features.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="text-xl font-medium mb-2 text-foreground">Performance Cookies</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Purpose:</strong> Analyze how the Service is used
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Duration:</strong> Up to 2 years
                    </p>
                    <p className="text-muted-foreground text-sm">
                      These cookies collect information about how visitors use our Service, such as 
                      which pages are visited most often. This data helps us improve the Service and 
                      user experience.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="text-xl font-medium mb-2 text-foreground">Targeting/Advertising Cookies</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Purpose:</strong> Deliver relevant content and ads
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Duration:</strong> Up to 2 years
                    </p>
                    <p className="text-muted-foreground text-sm">
                      These cookies may be used to deliver content more relevant to you and your 
                      interests. They may also be used to limit the number of times you see an 
                      advertisement and help measure the effectiveness of advertising campaigns.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Some cookies on our Service are placed by third-party services. These may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Analytics providers:</strong> To help us understand how users interact with our Service</li>
                  <li><strong>Authentication services:</strong> To enable secure sign-in functionality</li>
                  <li><strong>Content delivery networks:</strong> To serve content more efficiently</li>
                  <li><strong>Social media platforms:</strong> If you interact with social features</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  These third parties have their own privacy and cookie policies, which we encourage 
                  you to review.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Local Storage and Similar Technologies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In addition to cookies, we may use other similar technologies such as local storage 
                  (including HTML5 local storage), session storage, and IndexedDB to store information 
                  on your device. These technologies work similarly to cookies and are used for the 
                  same purposes, such as storing your preferences and improving your experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Managing Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have several options for managing cookies:
                </p>
                
                <h3 className="text-xl font-medium mb-3 text-foreground">Browser Settings</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most web browsers allow you to control cookies through their settings. You can 
                  typically find these settings in the "Options" or "Preferences" menu of your browser. 
                  You can set your browser to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                  <li>Block all cookies</li>
                  <li>Accept only first-party cookies</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>Notify you when a cookie is set</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-foreground">Impact of Disabling Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Please note that if you disable or block cookies, some features of our Service may 
                  not function properly. Essential cookies are required for the basic functionality 
                  of the Service, and disabling them may prevent you from using certain features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Do Not Track Signals</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some browsers have a "Do Not Track" feature that signals to websites that you do 
                  not want to have your online activity tracked. Our Service currently does not 
                  respond to "Do Not Track" signals because there is no consistent industry standard 
                  for compliance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our 
                  practices or for other operational, legal, or regulatory reasons. We will post 
                  the updated policy on this page with a new "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies or this Cookie Policy, please 
                  contact us through the appropriate channels available on our platform.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
