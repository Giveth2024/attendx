import "./globals.css";
import { Lexend, Inter } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-lexend",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AttendX - Attendance Management System",
  description: "AttendX is an advanced attendance management system that leverages QR code technology to streamline and enhance the process of tracking student attendance in educational institutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lexend.variable} ${inter.variable}`}>
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}
