document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     MENÚ PRINCIPAL / HAMBURGUESA
     ========================================================= */

  const menuButton = document.querySelector(".menu-btn");
  const menu = document.querySelector(".menu_nav_items");

  if (menuButton && menu) {

    const closeMenu = () => {
      menu.classList.remove("menu_open");

      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
    };


    menuButton.addEventListener("click", (event) => {

      event.stopPropagation();

      const open = menu.classList.toggle("menu_open");

      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

      menuButton.setAttribute(
        "aria-label",
        open ? "Cerrar menú" : "Abrir menú"
      );

    });


    menu.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", closeMenu);

    });


    document.addEventListener("click", (event) => {

      if (
        !menu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }

    });


    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

  }


  /* =========================================================
     GALERÍAS DE PRODUCTO
     ========================================================= */

  document.querySelectorAll(".product_gallery").forEach(gallery => {

    let images = [];

    try {

      images = JSON.parse(
        gallery.dataset.gallery || "[]"
      );

    } catch (_) {

      images = [];

    }


    const image = gallery.querySelector(".gallery_image");
    const prev = gallery.querySelector(".gallery_prev");
    const next = gallery.querySelector(".gallery_next");


    if (!image || !prev || !next) {
      return;
    }


    if (!images.length) {

      images = [
        image.getAttribute("src")
      ];

    }


    let index = 0;


    const render = () => {

      image.src = images[index];

    };


    if (images.length <= 1) {

      prev.hidden = true;
      next.hidden = true;

    }


    prev.addEventListener("click", () => {

      index =
        (index - 1 + images.length) %
        images.length;

      render();

    });


    next.addEventListener("click", () => {

      index =
        (index + 1) %
        images.length;

      render();

    });

  });


  /* =========================================================
     FORMULARIO DE CONTACTO
     Sin JS el formulario se envía de forma nativa a FormSubmit y
     redirige a /contacto/gracias/. Con JS se valida en línea y se
     envía por AJAX.
     ========================================================= */

  const form = document.querySelector("#contact-form");


  if (form) {

    const status =
      document.querySelector("#form-status");

    const submit =
      form.querySelector('button[type="submit"]');

    const nextField =
      form.querySelector('input[name="_next"]');

    const nextUrl =
      nextField ? nextField.value : "/contacto/gracias/";

    const ajaxAction =
      form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");


    /* Precarga el motivo desde la URL: /contacto/?motivo=muestras */

    const motivoParam =
      new URLSearchParams(window.location.search).get("motivo");

    const motivos = {
      llamada: "Llamada con ventas",
      muestras: "Muestras",
      pedido: "Pedido"
    };

    if (motivoParam && motivos[motivoParam]) {

      const radio = form.querySelector(
        `input[name="motivo"][value="${motivos[motivoParam]}"]`
      );

      if (radio) {
        radio.checked = true;
      }

    }


    /* Validación accesible en línea */

    form.noValidate = true;

    const errorMessages = {
      nombre: "Escribe tu nombre.",
      empresa: "Indica el nombre de tu empresa.",
      email: "Escribe un email válido, por ejemplo nombre@empresa.com.",
      canal: "Selecciona el canal en el que vendes.",
      mensaje: "Cuéntanos brevemente qué necesitas."
    };

    const validateField = (field) => {

      const error =
        document.getElementById(`${field.id}-error`);

      const valid = field.checkValidity();

      field.setAttribute("aria-invalid", String(!valid));

      if (error) {
        error.textContent = valid ? "" : (errorMessages[field.name] || "Revisa este campo.");
      }

      return valid;

    };

    const requiredFields =
      Array.from(form.querySelectorAll("[required]"));

    requiredFields.forEach(field => {

      field.addEventListener("blur", () => {

        if (field.value) {
          validateField(field);
        }

      });

      field.addEventListener("input", () => {

        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }

      });

    });


    form.addEventListener("submit", async (event) => {

      event.preventDefault();


      const invalid =
        requiredFields.filter(field => !validateField(field));

      if (invalid.length) {

        invalid[0].focus();

        if (status) {
          status.textContent = "Revisa los campos marcados.";
          status.className = "form_status form_status--error";
        }

        return;

      }


      const originalText =
        submit.textContent;


      submit.disabled = true;
      submit.textContent = "Enviando…";


      if (status) {

        status.textContent = "";
        status.className = "form_status";

      }


      try {

        const response = await fetch(
          ajaxAction,
          {
            method: "POST",

            body: new FormData(form),

            headers: {
              "Accept": "application/json"
            }
          }
        );


        if (!response.ok) {

          throw new Error(
            "No se pudo enviar el formulario"
          );

        }


        window.location.assign(nextUrl);

      }

      catch (error) {

        if (status) {

          status.textContent =
            "No hemos podido enviar tu solicitud. Llámanos al +34 684 812 408 o escríbenos a katrin@catersum.com.";

          status.className =
            "form_status form_status--error";

        }

        submit.disabled = false;
        submit.textContent = originalText;

      }

    });

  }


  /* =========================================================
     SELECTOR DE IDIOMA
     ========================================================= */

  const languageSelector =
    document.querySelector(".language_selector");

  const languageButton =
    document.querySelector(".language_btn");

  const languageMenu =
    document.querySelector(".language_menu");

  const currentLanguage =
    document.querySelector(".current_language");

  const languageLinks =
    document.querySelectorAll(
      ".language_menu a[data-lang]"
    );


  if (
    languageSelector &&
    languageButton &&
    languageMenu &&
    currentLanguage
  ) {

    const languageRoutes = {

      home: {
        es: "/",
        en: "/en/",
        fr: "/fr/"
      },


      products: {
        es: "/productos/",
        en: "/en/products/",
        fr: "/fr/produits/"
      },


      classicSandwiches: {
        es: "/productos/bocadillos-clasicos/",
        en: "/en/products/classic-sandwiches/",
        fr: "/fr/produits/sandwichs-classiques/"
      },


      readyToEat: {
        es: "/productos/ready-to-eat/",
        en: "/en/products/ready-to-eat/",
        fr: "/fr/produits/pret-a-manger/"
      },


      burgers: {
        es: "/productos/hamburguesas-&-hotdogs/",
        en: "/en/products/burgers/",
        fr: "/fr/produits/burgers/"
      },


      sandwiches: {
        es: "/productos/sandwiches/",
        en: "/en/products/sandwiches/",
        fr: "/fr/produits/sandwichs/"
      },


      paninis: {
        es: "/productos/paninis/",
        en: "/en/products/paninis/",
        fr: "/fr/produits/paninis/"
      },


      focaccias: {
        es: "/productos/focaccias/",
        en: "/en/products/focaccias/",
        fr: "/fr/produits/focaccias/"
      },


      clients: {
        es: "/clientes/",
        en: "/en/clients/",
        fr: "/fr/clients/"
      },


      vending: {
        es: "/clientes/vending/",
        en: "/en/clients/vending/",
        fr: "/fr/clients/distribution-automatique/"
      },


      retail: {
        es: "/clientes/retail-supermercados/",
        en: "/en/clients/retail-supermarkets/",
        fr: "/fr/clients/grande-distribution/"
      },


      about: {
        es: "/nosotros/",
        en: "/en/about-us/",
        fr: "/fr/a-propos/"
      },


      manufacturing: {
        es: "/fabricacion/",
        en: "/en/manufacturing/",
        fr: "/fr/fabrication/"
      },


      contact: {
        es: "/contacto/",
        en: "/en/contact/",
        fr: "/fr/contact/"
      }

    };

    function normalizePath(path) {

      if (!path) {
        return "/";
      }


      let normalized = path;

      normalized =
        normalized.replace(/index\.html$/, "");

      if (!normalized.startsWith("/")) {

        normalized =
          "/" + normalized;

      }

      if (
        normalized !== "/" &&
        !normalized.endsWith("/")
      ) {

        normalized += "/";

      }


      return normalized;

    }

    const routeIndex = new Map();


    Object.entries(languageRoutes).forEach(
      ([pageName, translations]) => {

        Object.entries(translations).forEach(
          ([language, path]) => {

            routeIndex.set(
              normalizePath(path),
              {
                page: pageName,
                language: language
              }
            );

          }
        );

      }
    );

    const currentPath =
      normalizePath(
        window.location.pathname
      );


    const currentRoute =
      routeIndex.get(currentPath);

    function detectLanguageFromURL() {

      if (
        currentPath === "/en/" ||
        currentPath.startsWith("/en/")
      ) {

        return "en";

      }


      if (
        currentPath === "/fr/" ||
        currentPath.startsWith("/fr/")
      ) {

        return "fr";

      }


      return "es";

    }


    const detectedLanguage =
      currentRoute
        ? currentRoute.language
        : detectLanguageFromURL();

    currentLanguage.textContent =
      detectedLanguage.toUpperCase();

    languageLinks.forEach(link => {

      const targetLanguage =
        link.dataset.lang;


      if (!targetLanguage) {
        return;
      }


      let targetPath;


      if (
        currentRoute &&
        languageRoutes[currentRoute.page]
      ) {

        targetPath =
          languageRoutes[currentRoute.page][
          targetLanguage
          ];

      }

      else {

        targetPath =
          languageRoutes.home[
          targetLanguage
          ];

      }


      link.href = targetPath;


      /* Marcar idioma actual */

      if (
        targetLanguage ===
        detectedLanguage
      ) {

        link.classList.add("active");

        link.setAttribute(
          "aria-current",
          "true"
        );

      }

      else {

        link.classList.remove("active");

        link.removeAttribute(
          "aria-current"
        );

      }

    });

    const closeLanguageMenu = () => {

      languageSelector.classList.remove(
        "active"
      );

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );

    };


    languageButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        event.stopPropagation();


        const isOpen =
          languageSelector.classList.toggle(
            "active"
          );


        languageButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );

    languageMenu.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

      }
    );

    document.addEventListener(
      "click",
      (event) => {

        if (
          !languageSelector.contains(
            event.target
          )
        ) {

          closeLanguageMenu();

        }

      }
    );

    document.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Escape") {

          closeLanguageMenu();

          languageButton.focus();

        }

      }
    );

  }

});