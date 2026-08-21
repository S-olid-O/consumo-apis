
const divContenedor = document.querySelector(".galeria");
const btnCargar = document.querySelector(".btn-cargar");
const estado = document.querySelector(".estado");

btnCargar.addEventListener("click", async () => {
    btnCargar.disabled = true;
    estado.className = "estado";
    estado.textContent = "Buscando una nueva selección...";
    try {
        const respuesta = await fetch("https://picsum.photos/v2/list?limit=24");

        if (!respuesta.ok) throw new Error("No se pudo consultar la galería");
        const datos = await respuesta.json();

        divContenedor.replaceChildren();

        // Cada tarjeta nace del dato recibido, sin mezclar contenido con la plantilla.
        datos.forEach((foto, indice) => {
            const tarjeta = document.createElement("article");
            const imagen = document.createElement("img");
            const titulo = document.createElement("h2");

            tarjeta.className = "img-card";
            tarjeta.style.animationDelay = `${indice * 35}ms`;
            imagen.src = foto.download_url;
            imagen.alt = `Fotografía de ${foto.author}`;
            imagen.loading = "lazy";
            titulo.textContent = foto.author;

            tarjeta.append(imagen, titulo);
            divContenedor.appendChild(tarjeta);
        });
        estado.textContent = `${datos.length} fotografías seleccionadas.`;
    } catch (error) {
        estado.className = "estado error";
        estado.textContent = "No pudimos cargar la colección. Inténtalo de nuevo.";
        console.error("Error al cargar la galería:", error);
    } finally {
        btnCargar.disabled = false;
    }
});