import { useEffect, useState } from "react";
import MenuLateral from "../componentes/MenuLateral";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/layout.css";
import "../estilos/tabelas.css";

export default function Livros({ usuario, aoSair }) {
    const [livros, setLivros] = useState([]);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [livroEditando, setLivroEditando] = useState(null);

    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [status, setStatus] = useState("Disponível");

    const ehAdm = usuario?.tipoUsuario === "coordenador";

    async function carregar() {
        const lista = await apiFalsa.listarLivros();
        setLivros(lista);
    }

    useEffect(() => {
        carregar();
    }, []);

    function abrirNovo() {
        setLivroEditando(null);
        setTitulo("");
        setAutor("");
        setIsbn("");
        setStatus("Disponível");
        setModalAberto(true);
    }

    function abrirEdicao(livro) {
        setLivroEditando(livro);
        setTitulo(livro.titulo);
        setAutor(livro.autor);
        setIsbn(livro.isbn);
        setStatus(livro.status);
        setModalAberto(true);
    }

    async function salvarLivro(e) {
        e.preventDefault();
        if (livroEditando) {
            await apiFalsa.editarLivro(livroEditando.id, { titulo, autor, isbn, status });
        } else {
            await apiFalsa.adicionarLivro({ titulo, autor, isbn, status });
        }
        setModalAberto(false);
        carregar();
    }

    async function removerLivro(id) {
        await apiFalsa.excluirLivro(id);
        carregar();
    }

    async function reservarLivro(livro) {
        await apiFalsa.editarLivro(livro.id, { status: "Emprestado" });
        await apiFalsa.adicionarEmprestimo({
            usuario: usuario.nome,
            livro: livro.titulo,
            dataEmprestimo: "17/11/2026",
            dataDevolucao: "27/11/2026"
        });
        alert(`Livro "${livro.titulo}" reservado com sucesso!`);
        carregar();
    }

    const filtrados = livros.filter(
        (l) =>
            l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            l.autor.toLowerCase().includes(busca.toLowerCase()) ||
            l.isbn.includes(busca)
    );

    return (
        <div className="pagina-sistema">
            <MenuLateral usuario={usuario} aoSair={aoSair} />

            <main className="conteudo-principal">
                <div className="topo-pagina">
                    <h1 className="titulo-pagina">Livros</h1>
                    {ehAdm && (
                        <button className="botao-primario" onClick={abrirNovo}>
                            + NOVO LIVRO
                        </button>
                    )}
                </div>

                <div className="barra-busca">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar título, autor ou ISBN..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <section className="caixa-tabela">
                    <table className="tabela-dados">
                        <thead>
                            <tr>
                                <th>Capa</th>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>ISBN</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map((livro) => (
                                <tr key={livro.id}>
                                    <td>
                                        <div className="miniatura-capa">📘</div>
                                    </td>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.autor}</td>
                                    <td>{livro.isbn}</td>
                                    <td>
                                        <span
                                            className={
                                                livro.status === "Disponível"
                                                    ? "etiqueta ativo"
                                                    : "etiqueta atrasado"
                                            }
                                        >
                                            {livro.status}
                                        </span>
                                    </td>
                                    <td className="coluna-acoes">
                                        {ehAdm ? (
                                            <>
                                                <button
                                                    className="botao-icone"
                                                    title="Editar"
                                                    onClick={() => abrirEdicao(livro)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="botao-icone"
                                                    title="Excluir"
                                                    onClick={() => removerLivro(livro.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </>
                                        ) : livro.status === "Disponível" ? (
                                            <button
                                                className="botao-acao-texto"
                                                onClick={() => reservarLivro(livro)}
                                            >
                                                Pegar emprestado
                                            </button>
                                        ) : (
                                            <span>Indisponível</span>
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
                            <h2>{livroEditando ? "Editar Livro" : "Novo Livro"}</h2>
                            <form onSubmit={salvarLivro} className="formulario-modal">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                />

                                <label>Autor</label>
                                <input
                                    type="text"
                                    value={autor}
                                    onChange={(e) => setAutor(e.target.value)}
                                    required
                                />

                                <label>ISBN</label>
                                <input
                                    type="text"
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                    required
                                />

                                <label>Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Disponível">Disponível</option>
                                    <option value="Emprestado">Emprestado</option>
                                </select>

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