import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuLateral from "../componentes/MenuLateral";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/layout.css";
import "../estilos/inicio.css";

export default function Inicio({ usuario, aoSair }) {
    const [livros, setLivros] = useState([]);
    const [emprestimos, setEmprestimos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const ehAdm = usuario?.tipoUsuario === "coordenador";

    useEffect(() => {
        async function carregar() {
            const [listaLivros, listaEmprestimos, listaUsuarios] = await Promise.all([
                apiFalsa.listarLivros(),
                apiFalsa.listarEmprestimos(),
                apiFalsa.listarUsuarios()
            ]);
            setLivros(listaLivros);
            setEmprestimos(listaEmprestimos);
            setUsuarios(listaUsuarios);
        }
        carregar();
    }, []);

    const emprestimosVisiveis = ehAdm
        ? emprestimos
        : emprestimos.filter((e) => e.usuario.toLowerCase() === usuario.nome.toLowerCase());

    const totalEmprestados = emprestimosVisiveis.filter((e) => e.situacao !== "Devolvido").length;
    const totalAtrasados = emprestimosVisiveis.filter((e) => e.situacao === "ATRASADO").length;

    return (
        <div className="pagina-sistema">
            <MenuLateral usuario={usuario} aoSair={aoSair} />

            <main className="conteudo-principal">
                <h1 className="titulo-pagina">Início</h1>

                <div className="grade-cartoes">
                    <div className="cartao-resumo">
                        <span className="cartao-rotulo">Livros Cadastrados</span>
                        <strong className="cartao-numero">{livros.length}</strong>
                    </div>

                    <div className="cartao-resumo">
                        <span className="cartao-rotulo">
                            {ehAdm ? "Livros Emprestados" : "Meus Empréstimos"}
                        </span>
                        <strong className="cartao-numero">{totalEmprestados}</strong>
                    </div>

                    {ehAdm && (
                        <div className="cartao-resumo">
                            <span className="cartao-rotulo">Usuários Cadastrados</span>
                            <strong className="cartao-numero">{usuarios.length}</strong>
                        </div>
                    )}

                    <div className="cartao-resumo">
                        <span className="cartao-rotulo">Em Atraso</span>
                        <strong className="cartao-numero numero-alerta">{totalAtrasados}</strong>
                    </div>
                </div>

                <section className="caixa-tabela">
                    <div className="cabecalho-secao">
                        <h2>Empréstimos Recentes</h2>
                        <Link to="/emprestimos" className="link-ver-todos">
                            Ver todos
                        </Link>
                    </div>

                    <table className="tabela-dados">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Livro</th>
                                <th>Data E.</th>
                                <th>Data D.</th>
                                <th>Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emprestimosVisiveis.slice(0, 4).map((item) => (
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
                                                    : "etiqueta ativo"
                                            }
                                        >
                                            {item.situacao}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}