import React, { useState } from 'react';

export default function SimuladorFinanceiro() {
  // Estados para os valores do curso
  const [valorA-Vista, setValorAVista] = useState('');
  const [valorAPrazo, setValorAPrazo] = useState('');
  const [parcelas, setParcelas] = useState(12);

  // Estado para a lista de empresas/gateways de pagamento
  const [empresas, setEmpresas] = useState([
    { id: 1, nome: 'Stripe', taxaFixa: 0.39, taxaPorcentagem: 3.99 },
    { id: 2, nome: 'Pagar.me', taxaFixa: 0.50, taxaPorcentagem: 3.20 },
    { id: 3, nome: 'Mercado Pago', taxaFixa: 0.00, taxaPorcentagem: 4.99 },
  ]);

  // Estados para o cadastro de uma nova empresa
  const [novaEmpresa, setNovaEmpresa] = useState({ nome: '', taxaFixa: '', taxaPorcentagem: '' });

  // Funções de manipulação de inputs
  const handleAdicionarEmpresa = (e) => {
    e.preventDefault();
    if (!novaEmpresa.nome || novaEmpresa.taxaPorcentagem === '') return;

    setEmpresas([
      ...empresas,
      {
        id: Date.now(),
        nome: novaEmpresa.nome,
        taxaFixa: parseFloat(novaEmpresa.taxaFixa) || 0,
        taxaPorcentagem: parseFloat(novaEmpresa.taxaPorcentagem),
      },
    ]);
    setNovaEmpresa({ nome: '', taxaFixa: '', taxaPorcentagem: '' });
  };

  const handleRemoverEmpresa = (id) => {
    setEmpresas(empresas.filter((emp) => emp.id !== id));
  };

  // Cálculos básicos de parcelamento
  const numA-Vista = parseFloat(valorAVista) || 0;
  const numAPrazo = parseFloat(valorAPrazo) || 0;
  const valorDaParcela = numAPrazo > 0 ? numAPrazo / parcelas : 0;
  const diferencaAvistaPrazo = numAPrazo - numAVista;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Simulador Financeiro de Cursos
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Compare opções à vista, a prazo e descubra a melhor empresa de recebimento para o seu bolso.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA 1: Dados do Curso & Parcelamento */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">1. Dados do Curso</h2>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Valor Total à Vista (R$)
              </label>
              <input
                type="number"
                placeholder="Ex: 1200"
                value={valorAVista}
                onChange={(e) => setValorAVista(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Valor Total a Prazo (R$)
              </label>
              <input
                type="number"
                placeholder="Ex: 1500"
                value={valorAPrazo}
                onChange={(e) => setValorAPrazo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Número de Parcelas ({parcelas}x)
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={parcelas}
                onChange={(e) => setParcelas(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1x</span>
                <span>12x</span>
                <span>24x</span>
              </div>
            </div>

            {/* Resumo Rápido */}
            {numAPrazo > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm">
                <p className="font-medium text-blue-900">Resultado do Parcelamento:</p>
                <p className="mt-1">Cada parcela fica em: <strong className="text-blue-700">R$ {valorDaParcela.toFixed(2)}</strong></p>
                {numAVista > 0 && (
                  <p className="mt-1 text-xs text-gray-600">
                    Diferença total: R$ {diferencaAvistaPrazo.toFixed(2)} (+{((diferencaAvistaPrazo / numAVista) * 100).toFixed(1)}%)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* COLUNA 2 & 3: Comparativo de Empresas */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Bloco de Cadastro de Empresas */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">2. Adicionar Empresa de Recebimento</h2>
              <form onSubmit={handleAdicionarEmpresa} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    placeholder="Ex: Stripe, Hotmart"
                    value={novaEmpresa.nome}
                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Taxa %</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="3.99"
                    value={novaEmpresa.taxaPorcentagem}
                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, taxaPorcentagem: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Taxa Fixa (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.40"
                    value={novaEmpresa.taxaFixa}
                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, taxaFixa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-4 mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    + Incluir na Comparação
                  </button>
                </div>
              </form>
            </div>

            {/* Tabela de Comparação de Cenários */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">3. Comparativo de Taxas de Recebimento</h2>
              
              {empresas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">Nenhuma empresa cadastrada para comparação.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="p-3 font-semibold text-gray-600">Empresa</th>
                        <th className="p-3 font-semibold text-gray-600">Taxas Configuradas</th>
                        <th className="p-3 font-semibold text-gray-600 bg-green-50 text-green-900">Líquido À Vista</th>
                        <th className="p-3 font-semibold text-gray-600 bg-indigo-50 text-indigo-900">Líquido A Prazo</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {empresas.map((emp) => {
                        // Cálculos para o cenário À Vista
                        const taxaPorcentagemAvista = numAVista * (emp.taxaPorcentagem / 100);
                        const totalTaxasAvista = numAVista > 0 ? taxaPorcentagemAvista + emp.taxaFixa : 0;
                        const liquidoAvista = Math.max(0, numAVista - totalTaxasAvista);

                        // Cálculos para o cenário A Prazo
                        const taxaPorcentagemAprazo = numAPrazo * (emp.taxaPorcentagem / 100);
                        const totalTaxasAprazo = numAPrazo > 0 ? taxaPorcentagemAprazo + emp.taxaFixa : 0;
                        const liquidoAprazo = Math.max(0, numAPrazo - totalTaxasAprazo);

                        return (
                          <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium text-gray-900">{emp.nome}</td>
                            <td className="p-3 text-gray-500 text-xs">
                              {emp.taxaPorcentagem}% + R$ {emp.taxaFixa.toFixed(2)}
                            </td>
                            <td className="p-3 bg-green-50/50 font-semibold text-green-700">
                              R$ {liquidoAvista.toFixed(2)}
                              {numAVista > 0 && <span className="block text-[10px] font-normal text-gray-400">Taxa total: R$ {totalTaxasAvista.toFixed(2)}</span>}
                            </td>
                            <td className="p-3 bg-indigo-50/50 font-semibold text-indigo-700">
                              R$ {liquidoAprazo.toFixed(2)}
                              {numAPrazo > 0 && <span className="block text-[10px] font-normal text-gray-400">Taxa total: R$ {totalTaxasAprazo.toFixed(2)}</span>}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoverEmpresa(emp.id)}
                                className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors"
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-4 italic">
                * Nota: Este cálculo realiza uma simulação básica baseada na taxa padrão por transação (Taxa % + Fixa). Caso utilize modelos de antecipação de parcelas, lembre-se de somar a taxa de antecipação mensal na porcentagem da empresa.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}