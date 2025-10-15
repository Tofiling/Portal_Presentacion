type CardProps = {
  title: string;
  value: number;
};

export default function Card({ title, value }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
