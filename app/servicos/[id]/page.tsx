"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const categorias = ["Serviços Contábeis", "Serviços Jurídicos", "Consultoria", "Auditoria", "Tecnologia", "RH", "Marketing", "Outro"];
const unidades = ["Por hora", "Por mês", "Por projeto", "Por demanda"];

export default function EditarServicoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nome: "", descricao: "", categoria: "", unidade: "" });
  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    supabase.from("servicos").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm({ nome: data.nome || "", descricao: data.descricao || "", categoria: data.categoria || "", unidade: data.unidade || "" });
      setLoading(false);
    });
  }, [id]);

  const salvar = async () => {
    if (!form.nome) return alert("Nome é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("servicos").update(form).eq("id", id);
    if (error) { alert("Erro ao salvar: " + error.message); setSaving(false); return; }
    router.push("/servicos");
  };

  const excluir = async () => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    setDeleting(true);
    const { error } = await supabase.from("servicos").delete().eq("id", id);
    if (error) { alert("Erro ao excluir: " + error.message); setDeleting(false); return; }
    router.push("/servicos");
  };

  if (loading) return <p className="text-slate-500">Carregando...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/servicos" className="text-slate-400 hover:text-slate-600">← Serviços</Link>
        <h2 className="text-2xl font-bold text-slate-800">Editar Serviço</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Serviço *</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
            <option value="">Selecione...</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Unidade de Cobrança</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.unidade} onChange={(e) => set("unidade", e.target.value)}>
            <option value="">Selecione...</option>
            {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
          <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.descricao} onChange={(e) => set("descricao", e.target.value)} />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={salvar} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <Link href="/servicos">
            <button className="border border-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancelar
            </button>
          </Link>
          <button onClick={excluir} disabled={deleting} className="ml-auto bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50">
            {deleting ? "Excluindo..." : "Excluir Serviço"}
          </button>
        </div>
      </div>
    </div>
  );
}
