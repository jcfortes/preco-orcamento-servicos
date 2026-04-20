"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  email: string;
  cnpj: string;
  regime_tributario: string;
  porte: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("clientes").select("*").order("nome").then(({ data }) => {
      setClientes(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
          <p className="text-slate-500 mt-1">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
        <Link href="/clientes/novo">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Novo Cliente
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : clientes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 text-lg">Nenhum cliente cadastrado</p>
          <Link href="/clientes/novo">
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Cadastrar primeiro cliente
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Cidade/UF</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">CNPJ</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Regime</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Porte</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.nome}</td>
                  <td className="px-4 py-3 text-slate-600">{c.cidade}/{c.estado}</td>
                  <td className="px-4 py-3 text-slate-600">{c.cnpj}</td>
                  <td className="px-4 py-3 text-slate-600">{c.regime_tributario}</td>
                  <td className="px-4 py-3 text-slate-600">{c.porte}</td>
                  <td className="px-4 py-3">
                    <Link href={`/clientes/${c.id}`} className="text-blue-600 hover:underline">Editar</Link>
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
