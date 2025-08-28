let contador = 0;

function atualizar(){
    document.getElementById("contador").textContent = contador;
}
function aumentar(){
    contador++;
    atualizar();
}
function diminuir(){
    contador--;
    atualizar();
}