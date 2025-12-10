interface Props {
  title: string;
  value: string | number;
  color?: string;
}

export default function CardMetric({ title, value, color = "bg-blue-500" }: Props) {
  return (
    <div className="p-6 rounded-lg shadow text-white font-semibold text-lg flex items-center justify-between cursor-pointer hover:scale-105 transition"
         style={{ backgroundColor: color }}>
      <h3>{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
