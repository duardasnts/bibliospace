import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Livros from "./paginas/Livros";
import Emprestimos from "./paginas/Emprestimos";
import Usuarios from "./paginas/Usuarios";
import Multas from "./paginas/Multas";
import Relatorios from "./paginas/Relatorios";

export default function App() {
    const [usuarioLogado, setUsuarioLogado] = useState(() => {
        const salvo = localStorage.getItem("bibliospace_sessao");
        return salvo ? JSON.parse(salvo) : null;
    });

    function entrar(usuario) {
        localStorage.setItem("bibliospace_sessao", JSON.stringify(usuario));
        setUsuarioLogado(usuario);
    }

    function sair() {
        localStorage.removeItem("bibliospace_sessao");
        setUsuarioLogado(null);
    }

    const ehAdm = usuarioLogado?.tipoUsuario === "coordenador";

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        usuarioLogado ? (
                            <Navigate to="/inicio" />
                        ) : (
                            <Login aoLogar={entrar} />
                        )
                    }
                />

                <Route
                    path="/inicio"
                    element={
                        usuarioLogado ? (
                            <Inicio usuario={usuarioLogado} aoSair={sair} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/livros"
                    element={
                        usuarioLogado ? (
                            <Livros usuario={usuarioLogado} aoSair={sair} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/emprestimos"
                    element={
                        usuarioLogado ? (
                            <Emprestimos usuario={usuarioLogado} aoSair={sair} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        usuarioLogado && ehAdm ? (
                            <Usuarios usuario={usuarioLogado} aoSair={sair} />
                        ) : (
                            <Navigate to={usuarioLogado ? "/inicio" : "/login"} />
                        )
                    }
                />

                <Route
                    path="/multas"
                    element={
                        usuarioLogado ? (
                            <Multas usuario={usuarioLogado} aoSair={sair} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/relatorios"
                    element={
                        usuarioLogado && ehAdm ? (
                            <Relatorios usuario={usuarioLogado} aoSair={sair} />
                        ) : (
                            <Navigate to={usuarioLogado ? "/inicio" : "/login"} />
                        )
                    }
                />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}