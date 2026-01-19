import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 19, 2026</p>
          
          <ScrollArea className="h-auto">
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using Bloxwave ("the Service"), you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our Service. We reserve the right to 
                  modify these terms at any time, and your continued use of the Service constitutes acceptance 
                  of any modifications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Bloxwave provides a streaming platform that allows users to discover, browse, and watch 
                  movies and TV shows. The Service may include features such as user accounts, watchlists, 
                  reviews, and personalized recommendations. We do not host any content directly; we aggregate 
                  and provide access to content from third-party sources.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features of the Service, you may be required to create an account. 
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information during registration</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Prohibited Conduct</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Use the Service for any unlawful purpose or in violation of any laws</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                  <li>Use automated systems or software to extract data from the Service</li>
                  <li>Upload, post, or transmit any harmful, threatening, or offensive content</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Circumvent any measures we use to restrict access to the Service</li>
                  <li>Share your account with others or create multiple accounts</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Content and Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content available through the Service, including but not limited to text, graphics, 
                  logos, images, and software, is the property of Bloxwave or its content suppliers and is 
                  protected by intellectual property laws. Movie and TV show metadata is provided by TMDB 
                  (The Movie Database). You may not reproduce, distribute, modify, or create derivative 
                  works from any content without prior written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. User-Generated Content</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By submitting reviews, comments, or other content to the Service, you grant Bloxwave a 
                  non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display 
                  such content. You represent that you own or have the necessary rights to submit such 
                  content and that it does not violate any third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Account Suspension and Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your account and access to the Service at 
                  our sole discretion, without notice, for conduct that we believe violates these Terms 
                  or is harmful to other users, us, or third parties, or for any other reason. This includes 
                  IP-based restrictions when necessary to maintain the integrity of our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, 
                  ERROR-FREE, OR SECURE. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, BLOXWAVE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR 
                  REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, 
                  OR OTHER INTANGIBLE LOSSES.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless Bloxwave, its officers, directors, employees, 
                  and agents from any claims, damages, losses, liabilities, and expenses (including 
                  attorneys' fees) arising out of your use of the Service or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  jurisdiction in which Bloxwave operates, without regard to its conflict of law provisions. 
                  Any disputes arising under these Terms shall be subject to the exclusive jurisdiction 
                  of the courts in that jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any 
                  material changes by posting the updated Terms on the Service with a new "Last updated" 
                  date. Your continued use of the Service after such changes constitutes acceptance of 
                  the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through the 
                  appropriate channels available on our platform.
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

export default TermsOfService;
