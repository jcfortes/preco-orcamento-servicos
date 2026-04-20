import Link from "next/link";

const cards = [
  { href: "/clientes", title: "Clientes", desc: "Gerencie sua base de clientes", icon: "👥", color: "bg-blue-50 border-blue-200" },
  { href: "/servicos", title: "Serviços", desc: "Tipos de serviços prestados", icon: "🔧", color: "bg-green-50 border-green-200" },
  { href: "/precificacao", title: "Precificação", desc: "Calcule preços de venda", icon: "💰", color: "bg-amber-50 border-amber-200" },
];

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Bem-vindo ao sistema</h2>
        <p className="text-slate-500 mt-1">Gerencie seus serviços e calcule preços de venda</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className={`border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer ${card.color}`}>
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-slate-800 text-lg">{card.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
