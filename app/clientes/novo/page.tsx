"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const regimes = ["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"];
const portes = ["MEI", "Microempresa", "Pequena Empresa", "Média Empresa", "Grande Empresa"];
const origens = ["Redes Sociais", "Busca Google", "Indicação de Parceiro", "Indicação de Cliente", "Evento", "Outro"];

type Segmento = { id: string; nome: string; pai_id: string | null };

export default function NovoClientePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [segmentoPaiId, setSegmentoPaiId] = useState("");
  const [form, setForm] = useState({
    nome: "", endereco: "", cidade: "", estado: "", contato: "",
    email: "", cnpj: "", inscricao_municipal: "", segmento_id: "",
    regime_tributario: "", porte: "", origem: "",
  });

  useEffect(() => {
    supabase.from("segmentos").select("*").order("nome").then(({ data }) => setSegmentos(data || []));
  }, []);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const pais = segmentos.filter((s) => !s.pai_id);
  const filhos = segmentos.filter((s) => s.pai_id === segmentoPaiId);

  const salvar = async () => {
    if (!form.nome) return alert("Nome é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("clientes").insert([form]);
    if (error) { alert("Erro ao salvar: " + error.message); setSaving(false); return; }
    router.push("/clientes");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/clientes" className="text-slate-400 hover:text-slate-600">← Clientes</Link>
        <h2 className="text-2xl font-bold text-slate-800">Novo Cliente</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl space-y-6">
        <section>
          <h3 className="font-semibold text-slate-700 mb-4 pb-2 border-b">Dados Básicos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome / Razão Social *</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Endereço</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.endereco} onChange={(e) => set("endereco", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Cidade</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Estado (UF)</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" maxLength={2} value={form.estado} onChange={(e) => set("estado", e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Contato</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.contato} onChange={(e) => set("contato", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">E-mail</label>
              <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">CNPJ</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.cnpj} onChange={(e) => set("cnpj", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Inscrição Municipal</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.inscricao_municipal} onChange={(e) => set("inscricao_municipal", e.target.value)} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-slate-700 mb-4 pb-2 border-b">Classificação</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Segmento (Nível 1)</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={segmentoPaiId} onChange={(e) => { setSegmentoPaiId(e.target.value); set("segmento_id", ""); }}>
                <option value="">Selecione...</option>
                {pais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Sub-segmento (Nível 2)</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.segmento_id} onChange={(e) => set("segmento_id", e.target.value)} disabled={!segmentoPaiId}>
                <option value="">Selecione...</option>
                {filhos.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Regime Tributário</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.regime_tributario} onChange={(e) => set("regime_tributario", e.target.value)}>
                <option value="">Selecione...</option>
                {regimes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Porte da Empresa</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.porte} onChange={(e) => set("porte", e.target.value)}>
                <option value="">Selecione...</option>
                {portes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Origem do Cliente</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.origem} onChange={(e) => set("origem", e.target.value)}>
                <option value="">Selecione...</option>
                {origens.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button onClick={salvar} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar Cliente"}
          </button>
          <Link href="/clientes">
            <button className="border border-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancelar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
