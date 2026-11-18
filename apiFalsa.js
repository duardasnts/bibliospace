export const usuarios = [
    {
        id: 2,
        nome: "João",
        email: "joao@gmail.com",
        senha: "654321",
        tipoUsuario: "aluno",
        matricula: "2023001",
        turma: "2º INFO",
        telefone: "(99) 99999-9999",
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Ana",
        email: "ana@gmail.com",
        senha: "987654",
        tipoUsuario: "coordenador",
        matricula: "2023010",
        turma: "1º MIN",
        telefone: "(99) 99999-8888",
        status: "Ativo"
    },
    {
        id: 4,
        nome: "Lucas H.",
        email: "lucas@gmail.com",
        senha: "123456",
        tipoUsuario: "aluno",
        matricula: "2022045",
        turma: "2º INFO ",
        telefone: "(99) 99999-7777",
        status: "Ativo"
    }
];

const livrosIniciais = [
    {
        id: 1,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        isbn: "975889710923",
        status: "Disponível"
    },
    {
        id: 2,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry",
        isbn: "9758875891023",
        status: "Disponível"
    },
    {
        id: 3,
        titulo: "Harry Potter",
        autor: "J.K. Rowling",
        isbn: "9788532530783",
        status: "Emprestado"
    },
    {
        id: 4,
        titulo: "Noites Brancas",
        autor: "Fiódor Dostoiévski",
        isbn: "9788573263169",
        status: "Emprestado"
    },
    {
        id: 5,
        titulo: "O Alienista",
        autor: "Machado de Assis",
        isbn: "9788525406958",
        status: "Emprestado"
    }
];

const emprestimosIniciais = [
    {
        id: 1,
        usuario: "Lucas H.",
        livro: "Harry Potter",
        dataEmprestimo: "15/06/2026",
        dataDevolucao: "25/06/2026",
        situacao: "Ativo"
    },
    {
        id: 2,
        usuario: "Joelma S.",
        livro: "Noites Brancas",
        dataEmprestimo: "19/06/2026",
        dataDevolucao: "29/06/2026",
        situacao: "Ativo"
    },
    {
        id: 3,
        usuario: "João",
        livro: "O Alienista",
        dataEmprestimo: "08/06/2026",
        dataDevolucao: "18/06/2026",
        situacao: "ATRASADO"
    },
    {
        id: 4,
        usuario: "Lucas.H",
        livro: "A Casa de Papel",
        dataEmprestimo: "06/06/2026",
        dataDevolucao: "16/06/2026",
        situacao: "ATRASADO"
    }
];

const multasIniciais = [
    {
        id: 1,
        usuario: "João",
        livro: "O Alienista",
        diasAtraso: 5,
        valor: 10.00,
        situacao: "PENDENTE"
    },
    {
        id: 2,
        usuario: "Lucas.H",
        livro: "A Casa de Papel",
        diasAtraso: 10,
        valor: 20.00,
        situacao: "PAGA"
    },
    {
        id: 3,
        usuario: "Lucas H.",
        livro: "Harry Potter",
        diasAtraso: 2,
        valor: 4.00,
        situacao: "PENDENTE"
    }
];

function carregarDados(chave, padrao) {
    const salvo = localStorage.getItem(chave);
    if (salvo) {
        return JSON.parse(salvo);
    }
    localStorage.setItem(chave, JSON.stringify(padrao));
    return padrao;
}

function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

export const rotasApi = {
    login: "/api/auth/login",
    livros: "/api/livros",
    emprestimos: "/api/emprestimos",
    usuarios: "/api/usuarios",
    multas: "/api/multas",
    relatorios: "/api/relatorios"
};

export const apiFalsa = {
    fazerLogin: async (identificador, senha) => {
        const lista = carregarDados("bibliospace_usuarios", usuarios);
        const encontrado = lista.find(
            (u) =>
                (u.email.toLowerCase() === identificador.toLowerCase() ||
                    u.nome.toLowerCase() === identificador.toLowerCase()) &&
                u.senha === senha
        );
        if (!encontrado) {
            throw new Error("Usuário ou senha inválidos.");
        }
        return encontrado;
    },

    cadastrarUsuario: async (novoUsuario) => {
        const lista = carregarDados("bibliospace_usuarios", usuarios);
        const criado = {
            id: Date.now(),
            matricula: String(Math.floor(2026000 + Math.random() * 999)),
            turma: novoUsuario.turma || "1º INFO",
            telefone: novoUsuario.telefone || "(99) 99999-0000",
            status: "Ativo",
            tipoUsuario: novoUsuario.tipoUsuario || "aluno",
            ...novoUsuario
        };
        const atualizada = [...lista, criado];
        salvarDados("bibliospace_usuarios", atualizada);
        return criado;
    },

    listarLivros: async () => carregarDados("bibliospace_livros", livrosIniciais),

    adicionarLivro: async (livro) => {
        const lista = carregarDados("bibliospace_livros", livrosIniciais);
        const novo = { id: Date.now(), status: "Disponível", ...livro };
        salvarDados("bibliospace_livros", [novo, ...lista]);
        return novo;
    },

    editarLivro: async (id, dados) => {
        const lista = carregarDados("bibliospace_livros", livrosIniciais);
        const atualizada = lista.map((item) => (item.id === id ? { ...item, ...dados } : item));
        salvarDados("bibliospace_livros", atualizada);
    },

    excluirLivro: async (id) => {
        const lista = carregarDados("bibliospace_livros", livrosIniciais);
        salvarDados("bibliospace_livros", lista.filter((item) => item.id !== id));
    },

    listarEmprestimos: async () => carregarDados("bibliospace_emprestimos", emprestimosIniciais),

    adicionarEmprestimo: async (emprestimo) => {
        const lista = carregarDados("bibliospace_emprestimos", emprestimosIniciais);
        const novo = { id: Date.now(), situacao: "Ativo", ...emprestimo };
        salvarDados("bibliospace_emprestimos", [novo, ...lista]);
        return novo;
    },

    devolverEmprestimo: async (id) => {
        const lista = carregarDados("bibliospace_emprestimos", emprestimosIniciais);
        const atualizada = lista.map((item) =>
            item.id === id ? { ...item, situacao: "Devolvido" } : item
        );
        salvarDados("bibliospace_emprestimos", atualizada);
    },

    listarUsuarios: async () => carregarDados("bibliospace_usuarios", usuarios),

    editarUsuario: async (id, dados) => {
        const lista = carregarDados("bibliospace_usuarios", usuarios);
        const atualizada = lista.map((u) => (u.id === id ? { ...u, ...dados } : u));
        salvarDados("bibliospace_usuarios", atualizada);
    },

    excluirUsuario: async (id) => {
        const lista = carregarDados("bibliospace_usuarios", usuarios);
        salvarDados("bibliospace_usuarios", lista.filter((u) => u.id !== id));
    },

    listarMultas: async () => carregarDados("bibliospace_multas", multasIniciais),

    adicionarMulta: async (multa) => {
        const lista = carregarDados("bibliospace_multas", multasIniciais);
        const nova = {
            id: Date.now(),
            situacao: "PENDENTE",
            valor: Number(multa.diasAtraso) * 2,
            ...multa
        };
        salvarDados("bibliospace_multas", [nova, ...lista]);
        return nova;
    },

    pagarMulta: async (id) => {
        const lista = carregarDados("bibliospace_multas", multasIniciais);
        const atualizada = lista.map((m) => (m.id === id ? { ...m, situacao: "PAGA" } : m));
        salvarDados("bibliospace_multas", atualizada);
    }
};