import { useEffect, useState } from "react";
import MenuLateral from "../componentes/MenuLateral";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/layout.css";
import "../estilos/tabelas.css";

export default function Usuarios({ usuario, aoSair }) {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("123456");
    const [matricula, setMatricula] = useState("");
    const [turma, setTurma] = useState("");
    const [telefone, setTelefone] = useState("");
    const [status, setStatus] = useState("Ativo");
    const [tipoUsuario, setTipoUsuario] = useState("aluno");

    async function carregar() {
        const dados = await apiFalsa.listarUsuarios();
        setListaUsuarios(dados);
    }

    useEffect(() => {
        carregar();
    }, []);

    function abrirNovo() {
        setEditando(null);
        setNome("");
        setEmail("");
        setSenha("123456");
        setMatricula("2026100");
        setTurma("1º INFO");
        setTelefone("(99) 99999-9999");
        setStatus("Ativo");
        setTipoUsuario("aluno");
        setModalAberto(true);
    }

    function abrirEdicao(u) {
        setEditando(u);
        setNome(u.nome);
        setEmail(u.email);
        setSenha(u.senha);
        setMatricula(u.matricula);
        setTurma(u.turma);
        setTelefone(u.telefone);
        setStatus(u.status);
        setTipoUsuario(u.tipoUsuario);
        setModalAberto(true);
    }

    async function salvar(e) {
        e.preventDefault();
        if (editando) {
            await apiFalsa.editarUsuario(editando.id, {
                nome,
                email,
                senha,
                matricula,
                turma,
                telefone,
                status,
                tipoUsuario
            });
        } else {
            await apiFalsa.cadastrarUsuario({
                nome,
                email,
                senha,
                matricula,
                turma,
                telefone,
                status,
                tipoUsuario
            });
        }
        setModalAberto(false);
        carregar();
    }

    async function remover(id) {
        await apiFalsa.excluirUsuario(id);
        carregar();
    }

    const filtrados = listaUsuarios.filter(
        (u) =>
            u.nome.toLowerCase().includes(busca.toLowerCase()) ||
            (u.matricula && u.matricula.includes(busca))
    );

    return (
        <div className="pagina-sistema">
            <MenuLateral usuario={usuario} aoSair={aoSair} />

            <main className="conteudo-principal">
                <div className="topo-pagina">
                    <h1 className="titulo-pagina">Usuários</h1>
                    <button className="botao-primario" onClick={abrirNovo}>
                        + NOVO USUÁRIO
                    </button>
                </div>

                <div className="barra-busca">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar usuário ou matrícula..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <section className="caixa-tabela">
                    <table className="tabela-dados">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Matrícula</th>
                                <th>Turma</th>
                                <th>Telefone</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.nome}</td>
                                    <td>{u.matricula}</td>
                                    <td>{u.turma}</td>
                                    <td>{u.telefone}</td>
                                    <td>
                                        <span
                                            className={
                                                u.status === "Ativo"
                                                    ? "etiqueta ativo"
                                                    : "etiqueta atrasado"
                                            }
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="coluna-acoes">
                                        <button
                                            className="botao-icone"
                                            title="Editar"
                                            onClick={() => abrirEdicao(u)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="botao-icone"
                                            title="Excluir"
                                            onClick={() => remover(u.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {modalAberto && (
                    <div className="fundo-modal">
                        <div className="caixa-modal">
                            <h2>{editando ? "Editar Usuário" : "Novo Usuário"}</h2>
                            <form onSubmit={salvar} className="formulario-modal">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />

                                <label>E-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <label>Matrícula</label>
                                <input
                                    type="text"
                                    value={matricula}
                                    onChange={(e) => setMatricula(e.target.value)}
                                    required
                                />

                                <label>Turma</label>
                                <input
                                    type="text"
                                    value={turma}
                                    onChange={(e) => setTurma(e.target.value)}
                                    required
                                />

                                <label>Telefone</label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    required
                                />

                                <label>Perfil</label>
                                <select
                                    value={tipoUsuario}
                                    onChange={(e) => setTipoUsuario(e.target.value)}
                                >
                                    <option value="aluno">Aluno</option>
                                    <option value="coordenador">Coordenador (ADM)</option>
                                </select>

                                <label>Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Bloq.">Bloq.</option>
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