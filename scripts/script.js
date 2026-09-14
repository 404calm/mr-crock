document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-btn");
  const menu = document.querySelector(".menu_nav_items");

  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove("menu_open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
      menuButton.textContent = "menu";
    };

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = menu.classList.toggle("menu_open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      menuButton.textContent = open ? "close" : "menu";
    });

    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  }

  document.querySelectorAll(".product_gallery").forEach(gallery => {
    let images = [];
    try { images = JSON.parse(gallery.dataset.gallery || "[]"); } catch (_) { images = []; }
    const image = gallery.querySelector(".gallery_image");
    const prev = gallery.querySelector(".gallery_prev");
    const next = gallery.querySelector(".gallery_next");
    if (!image || !prev || !next) return;
    if (!images.length) images = [image.getAttribute("src")];
    let index = 0;
    const render = () => { image.src = images[index]; };
    if (images.length <= 1) { prev.hidden = true; next.hidden = true; }
    prev.addEventListener("click", () => { index = (index - 1 + images.length) % images.length; render(); });
    next.addEventListener("click", () => { index = (index + 1) % images.length; render(); });
  });

  const form = document.querySelector("#contact-form");
  if (form) {
    const status = document.querySelector("#form-status");
    const submit = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const originalText = submit.textContent;
      submit.disabled = true;
      submit.textContent = "ENVIANDO…";
      if (status) { status.textContent = ""; status.className = "form_status"; }
      try {
        const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } });
        if (!response.ok) throw new Error("No se pudo enviar el formulario");
        form.reset();
        if (status) { status.textContent = "Mensaje enviado correctamente. Nos pondremos en contacto contigo lo antes posible."; status.className = "form_status form_status--success"; }
      } catch (error) {
        if (status) { status.textContent = "No hemos podido enviar el mensaje. Escríbenos a katrin@catersum.com o inténtalo de nuevo."; status.className = "form_status form_status--error"; }
      } finally {
        submit.disabled = false;
        submit.textContent = originalText;
      }
    });
  }
});
