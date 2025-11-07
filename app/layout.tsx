import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cheapest Forex Prop Firm Finder",
  description: "Rank and find the cheapest forex prop firm across multiple cost metrics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Cheapest Forex Prop Firm Finder</h1>
            <p className="tagline">Sort firms by fees, drawdown-normalized cost, and payout terms.</p>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <p>
              Data is curated and may be outdated. Always verify on the firm's website before purchasing.
            </p>
            <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
