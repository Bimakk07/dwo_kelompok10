export default function CardStats({ title, value }) {
  return (
    <div className="p-6 rounded-xl shadow-lg text-white 
                    bg-gradient-to-r from-blue-500 to-teal-400
                    hover:scale-105 transform transition duration-300">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <div className="mt-2 h-1 w-12 bg-white rounded-full"></div>
    </div>
  );
}
