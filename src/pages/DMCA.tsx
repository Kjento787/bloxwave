import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">DMCA Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 19, 2026</p>
          
          <ScrollArea className="h-auto">
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Important Notice</h3>
                      <p className="text-muted-foreground text-sm">
                        Bloxwave respects the intellectual property rights of others and expects users 
                        to do the same. We comply with the Digital Millennium Copyright Act (DMCA) and 
                        will respond to valid takedown notices.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Our Commitment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Bloxwave is committed to complying with U.S. copyright law and respecting the rights 
                  of copyright holders. We do not host any infringing content on our servers. Our 
                  Service provides information and links to content hosted by third-party providers. 
                  If you believe that any content accessible through our Service infringes your 
                  copyright, please follow the procedures outlined below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Filing a DMCA Takedown Notice</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you are a copyright owner or authorized to act on behalf of one, you may submit 
                  a DMCA takedown notice. Your notice must include the following information:
                </p>
                <ol className="list-decimal list-inside text-muted-foreground space-y-3 ml-4">
                  <li>
                    <strong>Identification of the copyrighted work:</strong> A description of the 
                    copyrighted work that you claim has been infringed, or if multiple works are 
                    covered by a single notification, a representative list of such works.
                  </li>
                  <li>
                    <strong>Identification of the infringing material:</strong> Identification of 
                    the material that is claimed to be infringing or to be the subject of infringing 
                    activity, including information reasonably sufficient to permit us to locate the 
                    material (e.g., URL or specific description).
                  </li>
                  <li>
                    <strong>Contact information:</strong> Your name, address, telephone number, and 
                    email address.
                  </li>
                  <li>
                    <strong>Good faith statement:</strong> A statement that you have a good faith 
                    belief that use of the material in the manner complained of is not authorized 
                    by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    <strong>Accuracy statement:</strong> A statement that the information in the 
                    notification is accurate, and under penalty of perjury, that you are authorized 
                    to act on behalf of the owner of an exclusive right that is allegedly infringed.
                  </li>
                  <li>
                    <strong>Signature:</strong> A physical or electronic signature of a person 
                    authorized to act on behalf of the owner of the exclusive right that is 
                    allegedly infringed.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How to Submit a Notice</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  DMCA takedown notices should be sent to our designated Copyright Agent. Please 
                  submit your notice using one of the following methods:
                </p>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-foreground">Copyright Agent Contact</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Email:</strong> devdebt1@gmail.com</p>
                    <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Please note that under Section 512(f) of the DMCA, any person who knowingly 
                  materially misrepresents that material is infringing may be subject to liability 
                  for damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Counter-Notification</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe that content you posted was removed or disabled by mistake or 
                  misidentification, you may file a counter-notification. Your counter-notification 
                  must include:
                </p>
                <ol className="list-decimal list-inside text-muted-foreground space-y-3 ml-4">
                  <li>Your physical or electronic signature</li>
                  <li>
                    Identification of the material that has been removed or disabled and the 
                    location at which the material appeared before it was removed or disabled
                  </li>
                  <li>
                    A statement under penalty of perjury that you have a good faith belief that 
                    the material was removed or disabled as a result of mistake or misidentification
                  </li>
                  <li>
                    Your name, address, and telephone number, and a statement that you consent to 
                    the jurisdiction of the federal court in your district and that you will accept 
                    service of process from the person who provided the original notification
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Repeat Infringers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In accordance with the DMCA and other applicable laws, we have adopted a policy 
                  of terminating, in appropriate circumstances and at our sole discretion, users 
                  who are deemed to be repeat infringers. We may also, at our sole discretion, 
                  limit access to our Service and/or terminate the accounts of any users who 
                  infringe any intellectual property rights of others, whether or not there is 
                  any repeat infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Third-Party Content</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Bloxwave does not host video content directly on our servers. We provide links 
                  and embed codes to content hosted by third-party services. If you have a copyright 
                  complaint about content hosted by a third party, we recommend contacting that 
                  third party directly. However, we will still process DMCA notices that identify 
                  specific content accessible through our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Modifications</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify this DMCA Policy at any time. Any changes will 
                  be posted on this page with an updated "Last updated" date. We encourage you 
                  to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This DMCA Policy is provided for informational purposes and does not constitute 
                  legal advice. If you have questions about your rights or obligations under 
                  copyright law, you should consult with a qualified attorney.
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

export default DMCA;
