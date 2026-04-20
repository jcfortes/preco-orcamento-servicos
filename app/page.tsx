"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  porte: string;
  origem: string;
  regime_tributario: string;
  segmento_id: string;
};

type Segmento = { id: string; nome: string; pai_id: string | null };

function contar(arr: string[]): { label: string; count: number }[] {
  const map: Record<string, number> = {};
  arr.forEach((v) => { if (v) map[v] = (map[v] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
}

function BarChart({ dados, cor }: { dados: { label: string; count: number }[]; cor: string }) {
  const max = Math.max(...dados.map((d) => d.count), 1);
  return (
    <div className="space-y-2">
      {dados.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span className="truncate max-w-[70%]">{d.label}</span>
            <span className="font-semibold">{d.count}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${cor}`} style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon, href, color }: { title: string; value: number; icon: string; href: string; color: string }) {
  return (
    <Link href={href}>
      <div className={`rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer ${color}`}>
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500 mt-1">{title}</div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [totalServicos, setTotalServicos] = useState(0);
  const [totalSegmentos, setTotalSegmentos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("clientes").select("id, porte, origem, regime_tributario, segmento_id"),
      supabase.from("segmentos").select("id, nome, pai_id"),
      supabase.from("servicos").select("id", { count: "exact", head: true }),
    ]).then(([{ data: c }, { data: s }, { count }]) => {
      setClientes(c || []);
      setSegmentos(s || []);
      setTotalServicos(count || 0);
      setTotalSegmentos((s || []).filter((seg) => !seg.pai_id).length);
      setLoading(false);
    });
  }, []);

  const porDado = (campo: keyof Cliente) => contar(clientes.map((c) => c[campo] as string));

  const porSegmento = () => {
    const filhos = segmentos.filter((s) => s.pai_id);
    return contar(
      clientes.map((c) => {
        const seg = filhos.find((s) => s.id === c.segmento_id);
        return seg?.nome || "";
      })
    );
  };

  if (loading) return <p className="text-slate-500">Carregando dashboard...</p>;

  const semSegmento = clientes.filter((c) => !c.segmento_id).length;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Cards de totais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Clientes" value={clientes.length} icon="👥" href="/clientes" color="bg-blue-50 border-blue-200" />
        <StatCard title="Serviços" value={totalServicos} icon="🔧" href="/servicos" color="bg-green-50 border-green-200" />
        <StatCard title="Segmentos" value={totalSegmentos} icon="🏷️" href="/segmentos" color="bg-purple-50 border-purple-200" />
        <StatCard title="Sem segmento" value={semSegmento} icon="⚠️" href="/clientes" color="bg-amber-50 border-amber-200" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Clientes por Segmento</h3>
          {porSegmento().length === 0
            ? <p className="text-slate-400 text-sm">Nenhum dado disponível</p>
            : <BarChart dados={porSegmento()} cor="bg-purple-400" />}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Clientes por Porte</h3>
          {porDado("porte").length === 0
            ? <p className="text-slate-400 text-sm">Nenhum dado disponível</p>
            : <BarChart dados={porDado("porte")} cor="bg-blue-400" />}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Clientes por Origem</h3>
          {porDado("origem").length === 0
            ? <p className="text-slate-400 text-sm">Nenhum dado disponível</p>
            : <BarChart dados={porDado("origem")} cor="bg-green-400" />}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Clientes por Regime Tributário</h3>
          {porDado("regime_tributario").length === 0
            ? <p className="text-slate-400 text-sm">Nenhum dado disponível</p>
            : <BarChart dados={porDado("regime_tributario")} cor="bg-amber-400" />}
        </div>
      </div>
    </div>
  );
}
