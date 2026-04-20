"use client";
import { useState } from "react";

export default function PrecificacaoPage() {
  const [custo, setCusto] = useState("");
  const [margem, setMargem] = useState("30");
  const [horas, setHoras] = useState("");
  const [valorHora, setValorHora] = useState("");

  const custoNum = parseFloat(custo) || 0;
  const margemNum = parseFloat(margem) || 0;
  const horasNum = parseFloat(horas) || 0;
  const valorHoraNum = parseFloat(valorHora) || 0;

  const precoVenda = custoNum > 0 ? custoNum / (1 - margemNum / 100) : 0;
  const precoHoras = horasNum > 0 && valorHoraNum > 0 ? horasNum * valorHoraNum : 0;
  const lucro = precoVenda - custoNum;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Precificação</h2>
        <p className="text-slate-500 mt-1">Calcule o preço de venda dos seus serviços</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Cálculo por Custo + Margem</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Custo do Serviço (R$)</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={custo} onChange={(e) => setCusto(e.target.value)} placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Margem de Lucro (%)</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={margem} onChange={(e) => setMargem(e.target.value)} placeholder="30" />
            </div>
          </div>

          {precoVenda > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Custo:</span>
                <span className="font-medium">{fmt(custoNum)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Lucro ({margem}%):</span>
                <span className="font-medium text-green-600">{fmt(lucro)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-blue-200 pt-2">
                <span className="text-slate-700">Preço de Venda:</span>
                <span className="text-blue-700 text-lg">{fmt(precoVenda)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Cálculo por Hora</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Horas Estimadas</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={horas} onChange={(e) => setHoras(e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Valor por Hora (R$)</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={valorHora} onChange={(e) => setValorHora(e.target.value)} placeholder="0,00" />
            </div>
          </div>

          {precoHoras > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Horas:</span>
                <span className="font-medium">{horasNum}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Valor/hora:</span>
                <span className="font-medium">{fmt(valorHoraNum)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-amber-200 pt-2">
                <span className="text-slate-700">Total:</span>
                <span className="text-amber-700 text-lg">{fmt(precoHoras)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
