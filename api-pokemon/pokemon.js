const listaPokemon = document.querySelector("#listaPokemon");
const searchInput = document.querySelector("#searchPokemon");
const URL = "https://pokeapi.co/api/v2/pokemon/";

const todosLosPokemon = [];
const tipoColores = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC"
};

const traduccionTipos = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  electric: "Eléctrico",
  grass: "Planta",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Insecto",
  rock: "Roca",
  ghost: "Fantasma",
  dragon: "Dragón",
  dark: "Siniestro",
  steel: "Acero",
  fairy: "Hada"
};

let terminoBusqueda = "";

async function cargarPokemon() {
  try {
    const promesas = Array.from({ length: 251 }, (_, index) =>
      fetch(`${URL}${index + 1}`).then((response) => {
        if (!response.ok) {
          throw new Error(`Error al cargar el Pokémon #${index + 1}`);
        }
        return response.json();
      })
    );

    const pokemons = await Promise.all(promesas);
    todosLosPokemon.push(...pokemons);
    renderizarLista();
  } catch (error) {
    console.error(error);
    listaPokemon.innerHTML = `
      <div class="sinResultados">
        <h3>Sin resultados</h3>
        <p>No se pudieron cargar los Pokémon. Intenta recargar la página.</p>
      </div>
    `;
  }
}

function renderizarLista() {
  listaPokemon.innerHTML = "";

  const resultados = todosLosPokemon.filter((poke) => {
    const texto = terminoBusqueda.trim().toLowerCase().replace("#", "");
    const coincideBusqueda =
      !texto ||
      poke.name.toLowerCase().includes(texto) ||
      poke.id.toString().includes(texto);

    return coincideBusqueda;
  });

  if (!resultados.length) {
    listaPokemon.innerHTML = `
      <div class="sinResultados">
        <h3>Sin resultados</h3>
        <p>No existe ningún Pokémon que coincida con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  resultados.forEach((poke) => mostrarPokemon(poke));
}

function mostrarPokemon(poke) {
  const div = document.createElement("article");
  const idFormateado = poke.id.toString().padStart(3, "0");
  const tiposPokemon = poke.types.map((tipo) => tipo.type.name);
  const tipoPrimario = tiposPokemon[0] || "normal";
  const tipoSecundario = tiposPokemon[1] || tipoPrimario;
  const colorPrimario = tipoColores[tipoPrimario] || "#6B7280";
  const colorSecundario = tipoColores[tipoSecundario] || colorPrimario;

  div.classList.add("pokemon");
  div.style.setProperty("--type-primary", colorPrimario);
  div.style.setProperty("--type-secondary", colorSecundario);

  div.innerHTML = `
    <p class="pokemonIdFondo">#${idFormateado}</p>
    <div class="pokemonImagen">
      <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}" />
    </div>
    <div class="pokemonInfo">
      <p class="pokemonId">#${idFormateado}</p>
      <h2 class="pokemonNombre">${capitalize(poke.name)}</h2>
    </div>
  `;

  listaPokemon.appendChild(div);
}

function tipos(pokemon) {
  return pokemon.types
    .map((tipo) => `<span class="tipo ${tipo.type.name}">${traduccionTipos[tipo.type.name] || tipo.type.name}</span>`)
    .join("");
}

function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    terminoBusqueda = event.target.value;
    renderizarLista();
  });
}

cargarPokemon();
