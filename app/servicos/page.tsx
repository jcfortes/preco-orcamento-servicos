"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Servico = { id: string; nome: string; descricao: string; categoria: string; unidade: string };

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("servicos").select("*").order("nome").then(({ data }) => {
      setServicos(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Serviços</h2>
          <p className="text-slate-500 mt-1">{servicos.length} serviço(s) cadastrado(s)</p>
        </div>
        <Link href="/servicos/novo">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            + Novo Serviço
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : servicos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 text-lg">Nenhum serviço cadastrado</p>
          <Link href="/servicos/novo">
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Cadastrar primeiro serviço
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Unidade</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Descrição</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{s.nome}</td>
                  <td className="px-4 py-3 text-slate-600">{s.categoria}</td>
                  <td className="px-4 py-3 text-slate-600">{s.unidade}</td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-xs">{s.descricao}</td>
                  <td className="px-4 py-3">
                    <Link href={`/servicos/${s.id}`} className="text-blue-600 hover:underline">Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
