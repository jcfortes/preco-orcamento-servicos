"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Segmento = { id: string; nome: string; pai_id: string | null };

export default function EditarSegmentoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pais, setPais] = useState<Segmento[]>([]);
  const [nome, setNome] = useState("");
  const [paiId, setPaiId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("segmentos").select("*").eq("id", id).single(),
      supabase.from("segmentos").select("id, nome").is("pai_id", null).order("nome"),
    ]).then(([{ data: seg }, { data: paisData }]) => {
      if (seg) { setNome(seg.nome); setPaiId(seg.pai_id || ""); }
      setPais((paisData || []).filter((p) => p.id !== id));
      setLoading(false);
    });
  }, [id]);

  const salvar = async () => {
    if (!nome) return alert("Nome é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("segmentos").update({ nome, pai_id: paiId || null }).eq("id", id);
    if (error) { alert("Erro ao salvar: " + error.message); setSaving(false); return; }
    router.push("/segmentos");
  };

  const excluir = async () => {
    if (!confirm("Tem certeza que deseja excluir este segmento?")) return;
    setDeleting(true);
    const { error } = await supabase.from("segmentos").delete().eq("id", id);
    if (error) { alert("Erro ao excluir: " + error.message); setDeleting(false); return; }
    router.push("/segmentos");
  };

  if (loading) return <p className="text-slate-500">Carregando...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/segmentos" className="text-slate-400 hover:text-slate-600">← Segmentos</Link>
        <h2 className="text-2xl font-bold text-slate-800">Editar Segmento</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Segmento Pai (Nível 1)</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={paiId} onChange={(e) => setPaiId(e.target.value)}>
            <option value="">— Nenhum (este é um segmento pai) —</option>
            {pais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Segmento *</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={salvar} disabled={saving} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <Link href="/segmentos">
            <button className="border border-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancelar
            </button>
          </Link>
          <button onClick={excluir} disabled={deleting} className="ml-auto bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50">
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
