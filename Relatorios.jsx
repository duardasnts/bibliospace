import { useState } from "react";
import MenuLateral from "../componentes/MenuLateral";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/layout.css";
import "../estilos/relatorios.css";

const modelosRelatorios = [
    "Empréstimos realizados",
    "Livros mais emprestados",
    "Usuários com mais empréstimos",
    "Livros atrasados",
    "Multas pendentes",
    "Acervo completo"
];

export default function Relatorios({ usuario, aoSair }) {
    const [dataInicio, setDataInicio] = useState("2026-06-01");
    const [dataFim, setDataFim] = useState("2026-11-30");
    const [tipo, setTipo] = useState("Empréstimos realizados");
    const [dadosPrevia, setDadosPrevia] = useState([]);
    const [relatorioGerado, setRelatorioGerado] = useState(false);

    async function gerarOuVisualizar() {
        const [livros, emprestimos, usuarios, multas] = await Promise.all([
            apiFalsa.listarLivros(),
            apiFalsa.listarEmprestimos(),
            apiFalsa.listarUsuarios(),
            apiFalsa.listarMultas()
        ]);

        if (tipo === "Empréstimos realizados" || tipo === "Livros mais emprestados") {
            setDadosPrevia(
                emprestimos.map((e) => ({
                    coluna1: e.usuario,
                    coluna2: e.livro,
                    coluna3: e.situacao
                }))
            );
        } else if (tipo === "Livros atrasados") {
            setDadosPrevia(
                emprestimos
                    .filter((e) => e.situacao === "ATRASADO")
                    .map((e) => ({
                        coluna1: e.usuario,
                        coluna2: e.livro,
                        coluna3: `Devolução: ${e.dataDevolucao}`
                    }))
            );
        } else if (tipo === "Multas pendentes") {
            setDadosPrevia(
                multas
                    .filter((m) => m.situacao === "PENDENTE")
                    .map((m) => ({
                        coluna1: m.usuario,
                        coluna2: m.livro,
                        coluna3: `R$ ${Number(m.valor).toFixed(2).replace(".", ",")}`
                    }))
            );
        } else if (tipo === "Usuários com mais empréstimos") {
            setDadosPrevia(
                usuarios.map((u) => ({
                    coluna1: u.nome,
                    coluna2: u.turma,
                    coluna3: u.status
                }))
            );
        } else {
            setDadosPrevia(
                livros.map((l) => ({
                    coluna1: l.titulo,
                    coluna2: l.autor,
                    coluna3: l.status
                }))
            );
        }
        setRelatorioGerado(true);
    }

    function exportarPdf() {
        if (!relatorioGerado) {
            gerarOuVisualizar();
        }
        setTimeout(() => {
            window.print();
        }, 200);
    }

    return (
        <div className="pagina-sistema">
            <MenuLateral usuario={usuario} aoSair={aoSair} />

            <main className="conteudo-principal">
                <div className="topo-pagina">
                    <h1 className="titulo-pagina">Relatórios</h1>
                    <button className="botao-primario" onClick={gerarOuVisualizar}>
                        GERAR RELATÓRIO
                    </button>
                </div>

                <div className="painel-filtros-relatorio">
                    <div className="linha-filtro">
                        <label>Período:</label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                        <span>até</span>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </div>

                    <div className="linha-filtro">
                        <label>Tipo:</label>
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            {modelosRelatorios.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <section className="caixa-lista-relatorios">
                    <h3>RELATÓRIOS DISPONÍVEIS</h3>
                    <ul className="lista-modelos">
                        {modelosRelatorios.map((modelo) => (
                            <li
                                key={modelo}
                                className={tipo === modelo ? "modelo-item selecionado" : "modelo-item"}
                                onClick={() => setTipo(modelo)}
                            >
                                <span>📄</span>
                                <span>{modelo}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="botoes-rodape-relatorio">
                    <button className="botao-secundario" onClick={gerarOuVisualizar}>
                        VISUALIZAR
                    </button>
                    <button className="botao-primario" onClick={exportarPdf}>
                        EXPORTAR PDF
                    </button>
                </div>

                {relatorioGerado && (
                    <section className="caixa-previa-relatorio">
                        <h3>
                            Prévia: {tipo} ({dataInicio} a {dataFim})
                        </h3>
                        {dadosPrevia.length === 0 ? (
                            <p>Nenhum registro encontrado para este filtro.</p>
                        ) : (
                            <ul className="lista-previa">
                                {dadosPrevia.map((item, idx) => (
                                    <li key={idx}>
                                        <strong>{item.coluna1}</strong> — {item.coluna2} (
                                        {item.coluna3})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}