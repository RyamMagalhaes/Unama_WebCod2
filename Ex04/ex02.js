const botao = document.getElementById("enviar");

botao.addEventListener("click", function(event) {
    event.preventDefault();

    const texto = document.getElementById("meutexto").value.trim();
    if (texto === "") {
        alert("Por favor, digite algo antes de enviar.");
    } else {
        alert("Olá, mundo " + texto);
    }
});