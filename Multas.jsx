import { useEffect, useState } from "react";
import MenuLateral from "../componentes/MenuLateral";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/layout.css";
import "../estilos/tabelas.css";

export default function Multas({ usuario, aoSair }) {
    const [multas, setMultas] = useState([]);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [livro, setLivro] = useState("");
    const [diasAtraso, setDiasAtraso] = useState(1);

    const ehAdm = usuario?.tipoUsuario === "coordenador";

    async function carregar() {
        const dados = await apiFalsa.listarMultas();
        setMultas(dados);
    }

    useEffect(() => {
        carregar();
    }, []);

    async function salvarMulta(e) {
        e.preventDefault();
        await apiFalsa.adicionarMulta({
            usuario: nomeUsuario,
            livro,
            diasAtraso: Number(diasAtraso)
        });
        setNomeUsuario("");
        setLivro("");
        setDiasAtraso(1);
        setModalAberto(false);
        carregar();
    }

    async function registrarPagamento(id) {
        await apiFalsa.pagarMulta(id);
        carregar();
    }

    const filtradas = multas
        .filter((m) => (ehAdm ? true : m.usuario.toLowerCase() === usuario.nome.toLowerCase()))
        .filter(
            (m) =>
                m.usuario.toLowerCase().includes(busca.toLowerCase()) ||
                m.livro.toLowerCase().includes(busca.toLowerCase())
        );

    return (
        <div className="pagina-sistema">
            <MenuLateral usuario={usuario} aoSair={aoSair} />

            <main className="conteudo-principal">
                <div className="topo-pagina">
                    <h1 className="titulo-pagina">Multas</h1>
                    {ehAdm && (
                        <button className="botao-primario" onClick={() => setModalAberto(true)}>
                            + NOVA MULTA
                        </button>
                    )}
                </div>

                <div className="barra-busca">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar multa por usuário ou livro..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <section className="caixa-tabela">
                    <table className="tabela-dados">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Livro</th>
                                <th>Dias Atraso</th>
                                <th>Valor</th>
                                <th>Situação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtradas.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.usuario}</td>
                                    <td>{m.livro}</td>
                                    <td>{m.diasAtraso} dias</td>
                                    <td>R$ {Number(m.valor).toFixed(2).replace(".", ",")}</td>
                                    <td>
                                        <span
                                            className={
                                                m.situacao === "PENDENTE"
                                                    ? "etiqueta atrasado"
                                                    : "etiqueta ativo"
                                            }
                                        >
                                            {m.situacao}
                                        </span>
                                    </td>
                                    <td className="coluna-acoes">
                                        {m.situacao === "PENDENTE" ? (
                                            <button
                                                className="botao-acao-texto"
                                                onClick={() => registrarPagamento(m.id)}
                                            >
                                                💲 Quitar
                                            </button>
                                        ) : (
                                            <button
                                                className="botao-icone"
                                                title="Visualizar comprovante"
                                                onClick={() =>
                                                    alert(
                                                        `Comprovante: Multa de ${m.usuario} (${m.livro}) paga.`
                                                    )
                                                }
                                            >
                                                👁️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {modalAberto && (
                    <div className="fundo-modal">
                        <div className="caixa-modal">
                            <h2>Nova Multa</h2>
                            <form onSubmit={salvarMulta} className="formulario-modal">
                                <label>Usuário</label>
                                <input
                                    type="text"
                                    placeholder="Ex: João"
                                    value={nomeUsuario}
                                    onChange={(e) => setNomeUsuario(e.target.value)}
                                    required
                                />

                                <label>Livro</label>
                                <input
                                    type="text"
                                    placeholder="Ex: O Alienista"
                                    value={livro}
                                    onChange={(e) => setLivro(e.target.value)}
                                    required
                                />

                                <label>Dias de Atraso (R$ 2,00/dia)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={diasAtraso}
                                    onChange={(e) => setDiasAtraso(e.target.value)}
                                    required
                                />

                                <div className="acoes-modal">
                                    <button
                                        type="button"
                                        className="botao-secundario"
                                        onClick={() => setModalAberto(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="botao-primario">
                                        Registrar Multa
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}