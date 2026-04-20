"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const categorias = ["Serviços Contábeis", "Serviços Jurídicos", "Consultoria", "Auditoria", "Tecnologia", "RH", "Marketing", "Outro"];
const unidades = ["Por hora", "Por mês", "Por projeto", "Por demanda"];

export default function NovoServicoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "", categoria: "", unidade: "" });
  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const salvar = async () => {
    if (!form.nome) return alert("Nome é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("servicos").insert([form]);
    if (error) { alert("Erro ao salvar: " + error.message); setSaving(false); return; }
    router.push("/servicos");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/servicos" className="text-slate-400 hover:text-slate-600">← Serviços</Link>
        <h2 className="text-2xl font-bold text-slate-800">Novo Serviço</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Serviço *</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex: Escrituração Fiscal Mensal" />
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
          <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Descreva o serviço..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={salvar} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar Serviço"}
          </button>
          <Link href="/servicos">
            <button className="border border-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancelar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
