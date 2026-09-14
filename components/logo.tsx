import Link from "next/link";
import { Righteous } from "next/font/google";

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
});

export const Logo = () => (
  <Link
    href="/"
    className={`${righteous.variable} font-(family-name:--font-righteous) text-2xl text-orange-600`}
  >
    unbonprof
  </Link>
);
