import Link from "next/link";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const Logo = () => (
  <Link
    href="/"
    className={`${pacifico.variable} font-(family-name:--font-pacifico) text-2xl text-orange-500`}
  >
    unbonprof
  </Link>
);
