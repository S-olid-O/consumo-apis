const inputCiudad = document.querySelector(".input-ciudad");
const btnBuscar = document.querySelector(".btn-buscar");
const resultadoDiv = document.querySelector(".resultado");
const traductorPaises = new Intl.DisplayNames(['es'], { type: 'region' });
const apiKey = "2e7d0b502ab90feb9a8565ab92f81c88";

async function mostrarClima(ciudad) {
    const ciudadBuscada = ciudad.trim();

    if (!ciudadBuscada) {
        resultadoDiv.innerHTML = '<div class="estado-inicial"><p>Escribe el nombre de una ciudad.</p></div>';
        inputCiudad.focus();
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudadBuscada)}&appid=${apiKey}&units=metric&lang=es`;
    btnBuscar.disabled = true;
    btnBuscar.querySelector('span').textContent = 'Buscando...';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Ciudad no encontrada');
        }

        const data = await response.json();
        const clima = data.weather[0];

        // La respuesta se inserta como texto para mantener el contenido controlado.
        resultadoDiv.innerHTML = `
            <h2></h2>
            <div class="detalle-clima">
                <div class="dato"><small>Temperatura</small><strong class="temperatura"></strong></div>
                <div class="dato"><small>Sensación</small><strong class="sensacion"></strong></div>
                <div class="dato"><small>Humedad</small><strong class="humedad"></strong></div>
            </div>
            <p class="descripcion"></p>
        `;
        resultadoDiv.querySelector('h2').textContent = `${data.name}, ${data.sys.country}`;
        resultadoDiv.querySelector('.temperatura').textContent = `${Math.round(data.main.temp)}°C`;
        resultadoDiv.querySelector('.sensacion').textContent = `${Math.round(data.main.feels_like)}°C`;
        resultadoDiv.querySelector('.humedad').textContent = `${data.main.humidity}%`;
        resultadoDiv.querySelector('.descripcion').textContent = `${clima.description} · ${traductorPaises.of(data.sys.country)}`;
    } catch (error) {
        resultadoDiv.innerHTML = '<div class="estado-inicial"><p>No se encontró la ciudad. Prueba con otro nombre.</p></div>';
    } finally {
        btnBuscar.disabled = false;
        btnBuscar.querySelector('span').textContent = 'Buscar clima';
    }
}

document.querySelector('.busqueda').addEventListener('submit', (event) => {
    event.preventDefault();
    mostrarClima(inputCiudad.value);
});