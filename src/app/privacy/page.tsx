import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - RankPilot AI",
  description: "How RankPilot AI collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-xs text-accent hover:underline">&larr; Back to home</Link>
        <h1 className="font-heading font-black text-4xl text-white mt-6 mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-sm text-neutral-300">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Overview</h2>
            <p>
              RankPilot AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This policy describes
              what information we collect, how we use it, and what choices you have.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Account information:</strong> Email address and display name when you sign up.</li>
              <li><strong className="text-white">Usage data:</strong> Pages visited, features used, and audit results.</li>
              <li><strong className="text-white">Project data:</strong> Domains you submit for analysis and the audit reports generated.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">How we use your information</h2>
            <p>
              We use the information we collect to provide and improve our services, generate
              AI-powered audits, and personalize your experience. We do not sell your data to
              third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Cookies and tracking</h2>
            <p>
              For details on how we use cookies, see our{" "}
              <Link href="/cookies" className="text-accent hover:underline">Cookie Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Data security</h2>
            <p>
              We use industry-standard security measures including Firebase App Check,
              reCAPTCHA v3 verification, and encrypted data transmission to protect your
              information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Your rights</h2>
            <p>
              You can request access to, correction of, or deletion of your personal data at
              any time by contacting us.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
