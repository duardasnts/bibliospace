import { useEffect, useState } from "react";
import MenuLateral from "../componentes/MenuLateral";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/layout.css";
import "../estilos/tabelas.css";

export default function Emprestimos({ usuario, aoSair }) {
    const [emprestimos, setEmprestimos] = useState([]);
    const [livros, setLivros] = useState([]);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);

    const [nomeUsuario, setNomeUsuario] = useState(usuario?.nome || "");
    const [livroSelecionado, setLivroSelecionado] = useState("");
    const [dataEmprestimo, setDataEmprestimo] = useState("17/11/2026");
    const [dataDevolucao, setDataDevolucao] = useState("27/11/2026");

    const ehAdm = usuario?.tipoUsuario === "coordenador";

    async function carregar() {
        const [listaEmp, listaLiv] = await Promise.all([
            apiFalsa.listarEmprestimos(),
            apiFalsa.listarLivros()
        ]);
        setEmprestimos(listaEmp);
        setLivros(listaLiv);
        if (listaLiv.length > 0) {
            setLivroSelecionado(listaLiv[0].titulo);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    async function registrarEmprestimo(e) {
        e.preventDefault();
        await apiFalsa.adicionarEmprestimo({
            usuario: ehAdm ? nomeUsuario : usuario.nome,
            livro: livroSelecionado,
            dataEmprestimo,
            dataDevolucao
        });
        setModalAberto(false);
        carregar();
    }

    async function marcarDevolvido(id) {
        await apiFalsa.devolverEmprestimo(id);
        carregar();
    }

    const listaFiltrada = emprestimos
        .filter((item) =>
            ehAdm ? true : item.usuario.toLowerCase() === usuario.nome.toLowerCase()
        )
        .filter(
            (item) =>
                item.usuario.toLowerCase().includes(busca.toLowerCase()) ||
                item.livro.toLowerCase().includes(busca.toLowerCase())
        );

    return (
        <div className="pagina-sistema">
            <MenuLateral usuario={usuario} aoSair={aoSair} />

            <main className="conteudo-principal">
                <div className="topo-pagina">
                    <h1 className="titulo-pagina">Empréstimos</h1>
                    <button className="botao-primario" onClick={() => setModalAberto(true)}>
                        + NOVO EMPRÉSTIMO
                    </button>
                </div>

                <div className="barra-busca">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por usuário ou livro..."
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
                                <th>Data E.</th>
                                <th>Data D.</th>
                                <th>Situação</th>
                                {ehAdm && <th>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {listaFiltrada.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.usuario}</td>
                                    <td>{item.livro}</td>
                                    <td>{item.dataEmprestimo}</td>
                                    <td>{item.dataDevolucao}</td>
                                    <td>
                                        <span
                                            className={
                                                item.situacao === "ATRASADO"
                                                    ? "etiqueta atrasado"
                                                    : item.situacao === "Devolvido"
                                                    ? "etiqueta neutro"
                                                    : "etiqueta ativo"
                                            }
                                        >
                                            {item.situacao}
                                        </span>
                                    </td>
                                    {ehAdm && (
                                        <td>
                                            {item.situacao !== "Devolvido" ? (
                                                <button
                                                    className="botao-acao-texto"
                                                    onClick={() => marcarDevolvido(item.id)}
                                                >
                                                    Devolver
                                                </button>
                                            ) : (
                                                <span>—</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {modalAberto && (
                    <div className="fundo-modal">
                        <div className="caixa-modal">
                            <h2>Novo Empréstimo</h2>
                            <form onSubmit={registrarEmprestimo} className="formulario-modal">
                                <label>Usuário</label>
                                <input
                                    type="text"
                                    value={ehAdm ? nomeUsuario : usuario.nome}
                                    onChange={(e) => setNomeUsuario(e.target.value)}
                                    disabled={!ehAdm}
                                    required
                                />

                                <label>Livro</label>
                                <select
                                    value={livroSelecionado}
                                    onChange={(e) => setLivroSelecionado(e.target.value)}
                                >
                                    {livros.map((l) => (
                                        <option key={l.id} value={l.titulo}>
                                            {l.titulo}
                                        </option>
                                    ))}
                                </select>

                                <label>Data de Empréstimo</label>
                                <input
                                    type="text"
                                    value={dataEmprestimo}
                                    onChange={(e) => setDataEmprestimo(e.target.value)}
                                    required
                                />

                                <label>Data de Devolução</label>
                                <input
                                    type="text"
                                    value={dataDevolucao}
                                    onChange={(e) => setDataDevolucao(e.target.value)}
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
                                        Salvar
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