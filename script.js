
const formulario = document.getElementById("form-contato");
const aviso = document.getElementById("aviso");

// CONFIGURAÇÃO DO EMAILJS
// Vamos preencher estas três informações depois.
const EMAILJS_PUBLIC_KEY = "zFMwKThjLyUT0niel";
const EMAILJS_SERVICE_ID = "service_acme6zl";
const EMAILJS_TEMPLATE_ID = "template_qqo1g2b";
// 20 registros de teste
const exemplos = [
    ["Ana Silva", "ana@email.com", "Gostei do portfólio!"],
    ["Julia Santos", "julia@email.com", "Gostaria de saber mais sobre seus projetos."],
    ["Mariana Costa", "mariana@email.com", "Parabéns pelo trabalho!"],
    ["Lucas Oliveira", "lucas@email.com", "Tenho interesse em conversar."],
    ["Pedro Souza", "pedro@email.com", "Gostei dos seus projetos."],
    ["Beatriz Lima", "beatriz@email.com", "Como posso entrar em contato?"],
    ["Gabriel Alves", "gabriel@email.com", "Muito interessante!"],
    ["Laura Mendes", "laura@email.com", "Gostaria de conhecer seu trabalho."],
    ["Rafael Rocha", "rafael@email.com", "Parabéns pelo portfólio."],
    ["Camila Ferreira", "camila@email.com", "Adorei a apresentação!"],
    ["Bruno Martins", "bruno@email.com", "Tenho uma dúvida sobre seus projetos."],
    ["Isabela Ribeiro", "isabela@email.com", "Seu trabalho ficou ótimo!"],
    ["Felipe Gomes", "felipe@email.com", "Gostaria de conversar."],
    ["Manuela Barros", "manuela@email.com", "Muito bom o site!"],
    ["Enzo Carvalho", "enzo@email.com", "Gostei da galeria."],
    ["Sofia Pereira", "sofia@email.com", "Parabéns pela dedicação."],
    ["Daniel Castro", "daniel@email.com", "Gostaria de saber mais."],
    ["Helena Dias", "helena@email.com", "Adorei seus trabalhos escolares."],
    ["Vitor Nunes", "vitor@email.com", "Seu portfólio está interessante."],
    ["Alice Moreira", "alice@email.com", "Gostaria de entrar em contato."]
];

// INICIALIZAÇÃO DO LOCALSTORAGE
let contatos = [];

try {
    const dadosSalvos = localStorage.getItem("contatos");

    if (dadosSalvos === null) {
        contatos = exemplos.map((exemplo, indice) => ({
            id: Date.now() + indice,
            nome: exemplo[0],
            email: exemplo[1],
            mensagem: exemplo[2]
        }));

        salvarContatos();
    } else {
        contatos = JSON.parse(dadosSalvos);

        if (!Array.isArray(contatos)) {
            contatos = [];
        }
    }
} catch (erro) {
    contatos = [];
}

function salvarContatos() {
    localStorage.setItem("contatos", JSON.stringify(contatos));
}

// CRIAÇÃO DO PAINEL ADMINISTRATIVO
const painel = document.createElement("section");
painel.id = "painelAdmin";
painel.className = "container py-5";
painel.hidden = true;

painel.innerHTML = `
    <div class="card p-4 shadow">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2>Painel administrativo</h2>
            <button id="fecharAdmin" class="btn btn-secondary">
                Fechar painel
            </button>
        </div>

        <p class="mt-2">Gerenciamento das mensagens recebidas.</p>

        <h4 id="totalMensagens"></h4>

        <div id="listaMensagens"></div>
    </div>
`;

document.querySelector("main").appendChild(painel);

const lista = document.getElementById("listaMensagens");

// ACESSO AO PAINEL
function abrirPainel() {
    painel.hidden = false;
    mostrarContatos();
    painel.scrollIntoView({ behavior: "smooth" });
}

function fecharPainel() {
    painel.hidden = true;
}

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();

        if (painel.hidden) {
            abrirPainel();
        } else {
            fecharPainel();
        }
    }
});

document.getElementById("fecharAdmin").addEventListener("click", fecharPainel);

// MOSTRAR MENSAGENS
function mostrarContatos() {
    lista.innerHTML = "";

    document.getElementById("totalMensagens").textContent =
        "Total de mensagens: " + contatos.length;

    if (contatos.length === 0) {
        lista.textContent = "Nenhuma mensagem cadastrada.";
        return;
    }

    contatos.forEach(contato => {
        const bloco = document.createElement("div");
        bloco.className = "card p-3 mb-3";

        const nome = document.createElement("p");
        nome.textContent = "Nome: " + contato.nome;

        const email = document.createElement("p");
        email.textContent = "E-mail: " + contato.email;

        const mensagem = document.createElement("p");
        mensagem.textContent = "Mensagem: " + contato.mensagem;

        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.className = "btn btn-warning btn-sm me-2";
        editar.addEventListener("click", () => editarContato(contato.id));

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.className = "btn btn-danger btn-sm";
        excluir.addEventListener("click", () => excluirContato(contato.id));

        bloco.append(nome, email, mensagem, editar, excluir);
        lista.appendChild(bloco);
    });
}

// CADASTRAR MENSAGEM
formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) {
        aviso.textContent = "Preencha todos os campos.";
        return;
    }

    const novoContato = {
        id: Date.now(),
        nome: nome,
        email: email,
        mensagem: mensagem
    };

    contatos.push(novoContato);
    salvarContatos();

    formulario.reset();

    aviso.textContent = "Mensagem salva com sucesso!";

    // ENVIO AUTOMÁTICO POR EMAIL
    if (
        EMAILJS_PUBLIC_KEY !== "SUA_PUBLIC_KEY" &&
        EMAILJS_SERVICE_ID !== "SEU_SERVICE_ID" &&
        EMAILJS_TEMPLATE_ID !== "SEU_TEMPLATE_ID"
    ) {
        try {
            await enviarEmail(novoContato);
            aviso.textContent = "Mensagem salva e enviada com sucesso!";
        } catch (erro) {
            aviso.textContent =
                "Mensagem salva, mas não foi possível enviar o e-mail.";
            console.error("Erro no envio:", erro);
        }
    } else {
        aviso.textContent =
            "Mensagem salva! O envio de e-mail será ativado após a configuração.";
    }

    if (!painel.hidden) {
        mostrarContatos();
    }
});

// CARREGAR EMAILJS
function carregarEmailJS() {
    return new Promise((resolve, reject) => {
        if (window.emailjs) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

        script.onload = () => {
            emailjs.init({
                publicKey: EMAILJS_PUBLIC_KEY
            });
            resolve();
        };

        script.onerror = reject;

        document.head.appendChild(script);
    });
}

// ENVIAR EMAIL
async function enviarEmail(contato) {
    await carregarEmailJS();

    return emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
            from_name: contato.nome,
            reply_to: contato.email,
            message: contato.mensagem,
            to_name: "Maria Cristina"
        }
    );
}

// EDITAR MENSAGEM
function editarContato(id) {
    const contato = contatos.find(item => item.id === id);

    if (!contato) return;

    const novoNome = prompt("Novo nome:", contato.nome);
    if (novoNome === null) return;

    const novoEmail = prompt("Novo e-mail:", contato.email);
    if (novoEmail === null) return;

    const novaMensagem = prompt("Nova mensagem:", contato.mensagem);
    if (novaMensagem === null) return;

    if (!novoNome.trim() || !novoEmail.trim() || !novaMensagem.trim()) {
        alert("Preencha todos os campos!");
        return;
    }

    contato.nome = novoNome.trim();
    contato.email = novoEmail.trim();
    contato.mensagem = novaMensagem.trim();

    salvarContatos();
    mostrarContatos();

    alert("Mensagem atualizada com sucesso!");
}

// EXCLUIR MENSAGEM
function excluirContato(id) {
    const confirmar = confirm("Deseja realmente excluir esta mensagem?");

    if (!confirmar) return;

    contatos = contatos.filter(item => item.id !== id);

    salvarContatos();
    mostrarContatos();

    alert("Mensagem excluída com sucesso!");
}
