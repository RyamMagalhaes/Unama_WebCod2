const form = document.getElementById("cadastroForm");
const sucessoMsg = document.getElementById("sucesso");

// 1. Mensagem animada de sucesso
form.addEventListener("submit", function(event) {
    event.preventDefault(); // impede envio real para teste
    sucessoMsg.style.display = "block";
    sucessoMsg.style.opacity = "1";
    setTimeout(() => {
        sucessoMsg.style.opacity = "0";
    }, 3000);
});

// 2. Validação em tempo real (borda vermelha/verde)
const inputs = document.querySelectorAll("#cadastroForm input[required], textarea[required], select[required]");
inputs.forEach(input => {
    input.addEventListener("input", () => {
        if (!input.checkValidity()) {
            input.style.border = "2px solid red";
        } else {
            input.style.border = "2px solid green";
        }
    });
});

// 3. Mostrar/ocultar senha
const toggleSenha = document.getElementById("toggleSenha");
toggleSenha.addEventListener("click", () => {
    const senha = document.getElementById("senha");
    if (senha.type === "password") {
        senha.type = "text";
        toggleSenha.textContent = "🙈 Ocultar";
    } else {
        senha.type = "password";
        toggleSenha.textContent = "👁 Mostrar";
    }
});

// 4. Confirmação antes de limpar
const btnLimpar = document.getElementById("sub2");
btnLimpar.addEventListener("click", (event) => {
    const confirmar = confirm("Tem certeza que deseja limpar o formulário?");
    if (!confirmar) {
        event.preventDefault(); // cancela o reset
        return;
    }

    // Se confirmou, limpa bordas e mensagem
    inputs.forEach(input => {
        input.style.border = "";
    });
    sucessoMsg.style.display = "none";
});
