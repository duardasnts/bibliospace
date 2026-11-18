import { useState } from "react";
import { apiFalsa } from "../api/apiFalsa";
import "../estilos/login.css";

export default function Login({ aoLogar }) {
    const [identificador, setIdentificador] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [modoCadastro, setModoCadastro] = useState(false);

    const [nomeCadastro, setNomeCadastro] = useState("");
    const [emailCadastro, setEmailCadastro] = useState("");
    const [senhaCadastro, setSenhaCadastro] = useState("");
    const [turmaCadastro, setTurmaCadastro] = useState("");

    async function enviarLogin(e) {
        e.preventDefault();
        setErro("");
        try {
            const usuario = await apiFalsa.fazerLogin(identificador, senha);
            aoLogar(usuario);
        } catch (err) {
            setErro(err.message);
        }
    }

    async function enviarCadastro(e) {
        e.preventDefault();
        if (!nomeCadastro || !emailCadastro || !senhaCadastro) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }
        const novo = await apiFalsa.cadastrarUsuario({
            nome: nomeCadastro,
            email: emailCadastro,
            senha: senhaCadastro,
            turma: turmaCadastro,
            tipoUsuario: "aluno"
        });
        aoLogar(novo);
    }

    return (
        <div className="tela-login">
            <div className="cartao-login">
                <div className="lado-esquerdo-login">
                    <div className="icone-livro-login">📖</div>
                    <h1>Biblioteca Escolar</h1>
                    <p>BiblioSpace</p>
                </div>

                <div className="lado-direito-login">
                    {!modoCadastro ? (
                        <>
                            <h2>Acesse sua conta</h2>
                            <p className="subtitulo-login">Faça login para acessar o sistema.</p>

                            <form className="formulario-login" onSubmit={enviarLogin}>
                                <div className="campo-icone">
                                    <span>👤</span>
                                    <input
                                        type="text"
                                        placeholder="Usuário ou E-mail"
                                        value={identificador}
                                        onChange={(e) => setIdentificador(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="campo-icone">
                                    <span>🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="linha-esqueci">
                                    <button
                                        type="button"
                                        className="link-texto"
                                        onClick={() =>
                                            alert("Solicite a redefinição de senha na coordenação da biblioteca.")
                                        }
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>

                                {erro && <p className="mensagem-erro">{erro}</p>}

                                <button type="submit" className="botao-entrar">
                                    ENTRAR
                                </button>
                            </form>

                            <p className="rodape-login">
                                Não tem uma conta?{" "}
                                <button
                                    type="button"
                                    className="link-destaque"
                                    onClick={() => {
                                        setErro("");
                                        setModoCadastro(true);
                                    }}
                                >
                                    Cadastre-se
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>Crie sua conta</h2>
                            <p className="subtitulo-login">Cadastro de aluno no BiblioSpace.</p>

                            <form className="formulario-login" onSubmit={enviarCadastro}>
                                <div className="campo-icone">
                                    <span>👤</span>
                                    <input
                                        type="text"
                                        placeholder="Nome completo"
                                        value={nomeCadastro}
                                        onChange={(e) => setNomeCadastro(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="campo-icone">
                                    <span>✉️</span>
                                    <input
                                        type="email"
                                        placeholder="E-mail"
                                        value={emailCadastro}
                                        onChange={(e) => setEmailCadastro(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="campo-icone">
                                    <span>🎓</span>
                                    <input
                                        type="text"
                                        placeholder="Turma (ex: 2º INFO)"
                                        value={turmaCadastro}
                                        onChange={(e) => setTurmaCadastro(e.target.value)}
                                    />
                                </div>

                                <div className="campo-icone">
                                    <span>🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Senha"
                                        value={senhaCadastro}
                                        onChange={(e) => setSenhaCadastro(e.target.value)}
                                        required
                                    />
                                </div>

                                {erro && <p className="mensagem-erro">{erro}</p>}

                                <button type="submit" className="botao-entrar">
                                    CADASTRAR
                                </button>
                            </form>

                            <p className="rodape-login">
                                Já possui conta?{" "}
                                <button
                                    type="button"
                                    className="link-destaque"
                                    onClick={() => {
                                        setErro("");
                                        setModoCadastro(false);
                                    }}
                                >
                                    Fazer login
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}