"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Segmento = { id: string; nome: string };

export default function NovoSegmentoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [pais, setPais] = useState<Segmento[]>([]);
  const [nome, setNome] = useState("");
  const [paiId, setPaiId] = useState("");

  useEffect(() => {
    supabase.from("segmentos").select("id, nome").is("pai_id", null).order("nome").then(({ data }) => {
      setPais(data || []);
    });
  }, []);

  const salvar = async () => {
    if (!nome) return alert("Nome é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("segmentos").insert([{ nome, pai_id: paiId || null }]);
    if (error) { alert("Erro ao salvar: " + error.message); setSaving(false); return; }
    router.push("/segmentos");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/segmentos" className="text-slate-400 hover:text-slate-600">← Segmentos</Link>
        <h2 className="text-2xl font-bold text-slate-800">Novo Segmento</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Segmento Pai (Nível 1)</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={paiId} onChange={(e) => setPaiId(e.target.value)}>
            <option value="">— Nenhum (este é um segmento pai) —</option>
            {pais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            {paiId ? "Este será um sub-segmento (Nível 2)" : "Este será um segmento principal (Nível 1)"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Segmento *</label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={paiId ? "Ex: Comércio Varejista" : "Ex: Comércio"}
          />
        </div>

        <div className={`p-3 rounded-lg text-sm ${paiId ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-600"}`}>
          {paiId
            ? `Sub-segmento de: ${pais.find(p => p.id === paiId)?.nome}`
            : "Segmento principal — poderá ter sub-segmentos filhos"}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={salvar} disabled={saving} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar Segmento"}
          </button>
          <Link href="/segmentos">
            <button className="border border-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancelar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
