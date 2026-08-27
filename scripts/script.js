console.log("script.js cargado correctamente");

// ========== MENÚ HAMBURGUESA ==========
const botonMenu = document.querySelector(".menu-btn");  // ← Selector correcto
const menuContenido = document.querySelector(".menuNavItems");

if (botonMenu && menuContenido) {
    botonMenu.addEventListener("click", () => {
        menuContenido.classList.toggle("mostrar");
    });
}
//LINK SABER +//(".textLink");
const botones = document.querySelectorAll(".textLink");

botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
        e.preventDefault();

        const tarjeta = boton.closest(".cardItem");

        if (!tarjeta) return;

        const texto = tarjeta.querySelector(".textoOculto");

        texto.classList.toggle("show");

        if (texto.classList.contains("show")) {
            boton.textContent = "OCULTAR";
        } else {
            boton.textContent = "SABER MÁS +";
        }
    });
});

