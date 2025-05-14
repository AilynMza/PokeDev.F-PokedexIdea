//* URL base de la API
const BASE_URL = "https://pokeapi.co/api/v2";

//* Pokemones que se van a mostrar en pantalla
const limit = 20;

//* Elementos DOM
const cardsContainer = document.getElementById("cardsContainer");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
// const searchInput = document.getElementById("searchInput");
// const searchBtn = document.getElementById("searchBtn");

//* variables para llevar el control de la paginación
let currentPage = 1;

//* Usamos fetch - Funcion principal para obtener los Pokemon
async function getCharacters(page = 1) {
  try {
    // solicitar los datos a la API usando el número de la página
    const offset = (page - 1) * limit;
    console.log(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    const response = await fetch(
      `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
    );
    // Error si no fue satisfactoria la respuesta
    if (!response.ok)
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    // Extraer data de respuesta, almacenar y pasar a json
    const data = await response.json();
    console.log(data.results);

    // Calcular de acuerdo a la cantidad de pokemones que hay
    totalPages = Math.ceil(data.count / limit);
    console.log(totalPages);
    //Renderizar los personajes
    renderCharacters(data.results);
    // Actualizar los botones de paginación
    updateButtons();
  } catch (error) {
    // en caso de error, se muestra un mensaje en el contenedor de los personajes
    cardsContainer.innerHTML = `<p> ❌ Error al obtener personajes: ${error.message}</p>`;
  }
}

//* Funcion para crear las cartas de los pokemon
async function renderCharacters(characters) {
  console.log(characters);
  //! Limpia el contenedor antes de insertar los pokemon
  cardsContainer.innerHTML = "";

  //* Iterar sobre cada personaje en el array
  //? for nombre-a-elegir of arreglo-a-recorrer
  for (const p of characters) {
    try {
      console.log(p.url);
      //Intenta obtener los datos del pokemon
      const res = await fetch(p.url);
      const pokemon = await res.json();
      console.log(pokemon);

      // Extraer los tipos
      let types = pokemon.types;
      types = types.map(
        (t) => `<span class="type-${t.type.name}">${t.type.name}</span>`
      );
      types = types.join(", ");

      // Crear cartas
      const card = document.createElement("div");
      card.className = "card";

      //* Cartas de los pokemon
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
          </div>
          <div class="card-back">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <p><strong>ID:</strong> ${pokemon.id}</p>
            <p><strong>Tipo:</strong> ${types}</p>
            <p class="pokemon-description">${" "}</p>
          </div>
        </div>
      `;
      // agregar la tarjeta al contenedor de personajes
      cardsContainer.appendChild(card); // Añadir la tarjeta al contenedor de personajes
    } catch (error) {
      console.error("❌ Error al obtener el Pokémon:", error);
    }
  }
}

//* Funcion para botones de paginacion
function updateButtons() {
  prevBtn.disabled = currentPage === 1; // Deshabilitar el botón "anterior" si estamos en la primera página
  nextBtn.disabled = currentPage === totalPages; // Deshabilitar el botón "siguiente" si estamos en la última página
}

//* Evento botón "anterior"
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--; // Decrementar la página actual
    getCharacters(currentPage);
  }
});

//* Eventobotón "siguiente"
nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++; // Incrementar la página actual
    getCharacters(currentPage);
  }
});

//* Llamada inicial para mostrar la primera página de personajes al cargar la app
getCharacters();
