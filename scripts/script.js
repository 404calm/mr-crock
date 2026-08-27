const menuButton = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu_nav_items");

menuButton.addEventListener("click", () => {
    menu.classList.toggle("menu_open");
});