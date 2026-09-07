import Link from "next/link";

export const metadata = {
  title: "Cookie Policy - RankPilot AI",
  description: "How RankPilot AI uses cookies and similar technologies on our website.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-xs text-accent hover:underline">&larr; Back to home</Link>
        <h1 className="font-heading font-black text-4xl text-white mt-6 mb-4">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-sm text-neutral-300">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">What are cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website.
              They are widely used to make websites work more efficiently and to provide information
              to the site owners.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">How we use cookies</h2>
            <p className="mb-3">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Necessary cookies:</strong> Required for basic site functionality, including authentication and security.</li>
              <li><strong className="text-white">Analytics cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
              <li><strong className="text-white">Advertising cookies:</strong> Used to deliver relevant advertisements and track ad performance across platforms like Google AdSense and Meta.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Managing your preferences</h2>
            <p>
              You can change your cookie preferences at any time by clicking the &quot;Manage&quot; button
              in the cookie banner, or by clearing your browser&apos;s cookies which will re-show the banner
              on your next visit.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Third-party cookies</h2>
            <p>
              Some cookies are placed by third-party services we use, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Google AdSense (advertising)</li>
              <li>Meta Pixel (advertising and analytics)</li>
              <li>Firebase Authentication (necessary)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Contact</h2>
            <p>
              If you have questions about our use of cookies, please contact us through our{" "}
              <Link href="/" className="text-accent hover:underline">homepage</Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
