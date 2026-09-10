import Link from "next/link";

interface FooterProps {
  isLoggedIn: boolean;
}

export default function Footer({ isLoggedIn }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="text-xl font-bold text-white tracking-tight">GearUp</span>
          <p className="mt-2 text-sm text-slate-400">
            Your trusted platform for outdoor gear rental.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#gears" className="hover:text-white transition-colors">
                Explore Gears
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link href="/provider-dashboard" className="hover:text-white transition-colors">
                  Provider Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Support
          </h4>
          <p className="text-sm text-slate-400">Need help with your booking?</p>
          <p className="text-sm text-indigo-400 mt-2">support@gearup.com</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
        &copy; {new Date().getFullYear()} GearUp Platform. All rights reserved.
      </div>
    </footer>
  );
}