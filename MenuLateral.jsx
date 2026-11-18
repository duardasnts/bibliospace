import { NavLink } from "react-router-dom";

export default function MenuLateral({ usuario, aoSair }) {
    const ehAdm = usuario?.tipoUsuario === "coordenador";

    return (
        <aside className="menu-lateral">
            <div>
                <div className="logo-caixa">
                    <div className="logo-icone">📖</div>
                    <div className="logo-texto">
                        <span>BIBLIOTECA</span>
                        <span>ESCOLAR</span>
                    </div>
                </div>

                <nav className="menu-navegacao">
                    <NavLink
                        to="/inicio"
                        className={({ isActive }) => (isActive ? "menu-item ativo" : "menu-item")}
                    >
                        <span>🏠</span>
                        <span>Início</span>
                    </NavLink>

                    <NavLink
                        to="/livros"
                        className={({ isActive }) => (isActive ? "menu-item ativo" : "menu-item")}
                    >
                        <span>📚</span>
                        <span>Livros</span>
                    </NavLink>

                    <NavLink
                        to="/emprestimos"
                        className={({ isActive }) => (isActive ? "menu-item ativo" : "menu-item")}
                    >
                        <span>⇄</span>
                        <span>{ehAdm ? "Empréstimos" : "Meus Empréstimos"}</span>
                    </NavLink>

                    {ehAdm && (
                        <NavLink
                            to="/usuarios"
                            className={({ isActive }) => (isActive ? "menu-item ativo" : "menu-item")}
                        >
                            <span>👥</span>
                            <span>Usuários</span>
                        </NavLink>
                    )}

                    <NavLink
                        to="/multas"
                        className={({ isActive }) => (isActive ? "menu-item ativo" : "menu-item")}
                    >
                        <span>💲</span>
                        <span>{ehAdm ? "Multas" : "Minhas Multas"}</span>
                    </NavLink>

                    {ehAdm && (
                        <NavLink
                            to="/relatorios"
                            className={({ isActive }) => (isActive ? "menu-item ativo" : "menu-item")}
                        >
                            <span>📊</span>
                            <span>Relatórios</span>
                        </NavLink>
                    )}
                </nav>
            </div>

            <div className="menu-rodape">
                <div className="usuario-logado">
                    <strong>{usuario?.nome}</strong>
                    <span>{ehAdm ? "Administrador" : "Aluno"}</span>
                </div>
                <button className="botao-sair" onClick={aoSair}>
                    Sair
                </button>
            </div>
        </aside>
    );
}