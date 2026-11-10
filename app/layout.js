import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'FLOREY | Complete Electrical Solutions',
  description: "Explore FLOREY's premium range of modular switches, sockets, LED lighting, MCBs, electrical accessories and wires. Connect with Shajjad Electronics for product enquiries and distributorship opportunities.",
  keywords: ['FLOREY', 'Shajjad Electronics', 'FLOREY Switches', 'Modular Switches', 'Electrical Accessories Noida', 'Best Electrical Brand', 'LED Lighting'],
  metadataBase: new URL('https://florey.vercel.app'),
  openGraph: {
    title: 'FLOREY | Complete Electrical Solutions',
    description: "Explore FLOREY's premium range of modular switches, sockets, LED lighting, MCBs, electrical accessories and wires.",
    url: 'https://florey.vercel.app', 
    siteName: 'FLOREY',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  // 🟢 YAHAN CODE DAALNA HAI:
  verification: {
    google: "ZyMUuNP_dZH07cyC5nEpQ0WZKw5L8lF_Fz5_y5mzUP0", // Yahan wo exact code daalein jo aapne GSC se copy kiya hai
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}