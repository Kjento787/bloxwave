import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 font-display">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 19, 2026</p>
          
          <ScrollArea className="h-auto">
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Bloxwave ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
                  Policy explains how we collect, use, disclose, and safeguard your information when you 
                  use our streaming service. Please read this policy carefully to understand our practices 
                  regarding your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium mb-3 text-foreground">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                  <li>Account information (email address, display name, password)</li>
                  <li>Profile information (avatar, preferences)</li>
                  <li>Reviews and ratings you submit</li>
                  <li>Content added to your watchlist</li>
                  <li>Communications with us (support requests, feedback)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-foreground">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                  <li>Device information (browser type, operating system, device identifiers)</li>
                  <li>IP address and approximate location</li>
                  <li>Usage data (pages visited, features used, viewing history)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log data (access times, error reports)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-foreground">2.3 Third-Party Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may receive information about you from third-party services if you choose to link 
                  your account or sign in using social login providers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>To provide, maintain, and improve our Service</li>
                  <li>To personalize your experience and provide content recommendations</li>
                  <li>To process your account registration and maintain your profile</li>
                  <li>To communicate with you about updates, features, and support</li>
                  <li>To monitor and analyze usage patterns and trends</li>
                  <li>To detect, prevent, and address technical issues and fraud</li>
                  <li>To enforce our Terms of Service and protect user safety</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With third-party vendors who assist in operating our Service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
                  <li><strong>Safety:</strong> To protect the rights, safety, and property of users and others</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  These measures include encryption, secure servers, and access controls. However, no method 
                  of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as your account is active or as needed 
                  to provide you with our Service. We may also retain and use your information to comply 
                  with legal obligations, resolve disputes, and enforce our agreements. When you delete 
                  your account, we will delete or anonymize your personal information within a reasonable 
                  timeframe, unless retention is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Your Rights and Choices</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain processing of your data</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us or access your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service is not intended for children under the age of 13. We do not knowingly 
                  collect personal information from children under 13. If we discover that a child 
                  under 13 has provided us with personal information, we will take steps to delete 
                  such information promptly. If you believe a child has provided us with personal 
                  information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">9. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your 
                  country of residence. These countries may have different data protection laws. 
                  When we transfer your data, we take appropriate safeguards to ensure your information 
                  remains protected in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Third-Party Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service may contain links to third-party websites or services. We are not 
                  responsible for the privacy practices of these third parties. We encourage you 
                  to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new Privacy Policy on this page with an updated 
                  "Last updated" date. We encourage you to review this Policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please 
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

export default PrivacyPolicy;
