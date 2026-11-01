export default function ProductCard({ title, code, price }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
      <div className="w-32 h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 shadow-inner">
        <span className="text-sm font-medium">Product Image</span> 
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">Code: {code}</p>
      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-300">{price}</span>
    </div>
  );
}