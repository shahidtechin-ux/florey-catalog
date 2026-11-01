import Link from 'next/link';

export default function ActionBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-black py-12 my-12 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-center gap-6 px-8 border border-gray-800">
      <h3 className="text-white text-3xl font-bold md:mr-10 tracking-wide">
        Start Business with <span className="text-red-500">FLOREY</span>
      </h3>
      <Link href="/distributorship">
        <button className="bg-red-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-300">
          Get Distributorship
        </button>
      </Link>
      <Link href="/products">
        <button className="bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300">
          View All Products
        </button>
      </Link>
      <Link href="/contact">
        <button className="border-2 border-red-600 text-red-500 font-bold px-8 py-3 rounded-full hover:bg-red-600 hover:text-white hover:scale-105 transition-all duration-300">
          Contact Admin
        </button>
      </Link>
    </div>
  );
}