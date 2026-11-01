import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  // 🟢 NAYA: Yahan title clean aur chota kar diya hai
  title: 'FLOREY | Complete Electrical Solutions',
  description: "Explore FLOREY's premium range of modular switches, sockets, LED lighting, MCBs, electrical accessories and wires. Connect with Shajjad Electronics for product enquiries and distributorship opportunities",
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