"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Segmento = { id: string; nome: string; pai_id: string | null };

export default function SegmentosPage() {
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("segmentos").select("*").order("nome").then(({ data }) => {
      setSegmentos(data || []);
      setLoading(false);
    });
  }, []);

  const pais = segmentos.filter((s) => !s.pai_id);
  const filhos = (paiId: string) => segmentos.filter((s) => s.pai_id === paiId);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Segmentos de Atividade</h2>
          <p className="text-slate-500 mt-1">{pais.length} segmento(s) pai cadastrado(s)</p>
        </div>
        <Link href="/segmentos/novo">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
            + Novo Segmento
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : pais.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 text-lg">Nenhum segmento cadastrado</p>
          <Link href="/segmentos/novo">
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
              Cadastrar primeiro segmento
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pais.map((pai) => (
            <div key={pai.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-slate-400">Nível 1</span>
                  <span className="font-semibold text-slate-800">{pai.nome}</span>
                </div>
                <Link href={`/segmentos/${pai.id}`} className="text-blue-600 text-sm hover:underline">Editar</Link>
              </div>
              {filhos(pai.id).length === 0 ? (
                <p className="px-6 py-3 text-sm text-slate-400 italic">Nenhum sub-segmento cadastrado</p>
              ) : (
                <div>
                  {filhos(pai.id).map((filho) => (
                    <div key={filho.id} className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">└</span>
                        <span className="text-xs font-semibold uppercase text-purple-400">Nível 2</span>
                        <span className="text-slate-700">{filho.nome}</span>
                      </div>
                      <Link href={`/segmentos/${filho.id}`} className="text-blue-600 text-sm hover:underline">Editar</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
