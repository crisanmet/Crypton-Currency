const $templateTabla = document.querySelector(".template-tabla").content;
const $contenedorTabla = document.querySelector(".tabla-coins");
const $fragment = document.createDocumentFragment();
const $inputBtn = document.querySelector(".search");
const $opcionSeleccionada = document.querySelector(".form-select");

const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";

document.addEventListener("DOMContentLoaded", () => {
  obtenerCripto();
});

const obtenerCripto = () => {
  fetch(URL)
    .then((res) => res.json())
    .then((coins) => renderizarCripto(coins))
    .catch((err) => console.log(err));
};

const renderizarCripto = (coins) => {
  $contenedorTabla.innerHTML = "";
  coins.forEach((coin) => {
    $templateTabla.querySelector(".rank").textContent = coin.market_cap_rank;
    $templateTabla.querySelector(".img-fluid").setAttribute("src", coin.image);
    $templateTabla.querySelector(".name").textContent = coin.name;
    $templateTabla.querySelector(".price").textContent = Intl.NumberFormat(
      "en-US",
      { style: "currency", currency: "USD" }
    ).format(coin.current_price);
    $templateTabla.querySelector(".capitalize").textContent = Intl.NumberFormat(
      "en-US",
      { style: "currency", currency: "USD" }
    ).format(coin.market_cap);
    $templateTabla.querySelector(
      ".price-change"
    ).textContent = `${coin.price_change_percentage_24h}%`;

    const clone = $templateTabla.cloneNode(true);
    $fragment.appendChild(clone);
  });
  $contenedorTabla.appendChild($fragment);
};

$opcionSeleccionada.addEventListener("change", (e) => {
  const $monedaSeleccionada = $opcionSeleccionada.value;
  obtenerCriptoMonedaElegida($monedaSeleccionada);
});

const obtenerCriptoMonedaElegida = (moneda) => {
  fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${moneda}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
  )
    .then((res) => res.json())
    .then((coins) => renderizarCripto(coins))
    .catch((err) => console.log(err));
};

$contenedorTabla.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("tr-coins")) {
    modalSweetAlert(e.target.parentElement);
  }
});

const modalSweetAlert = async (e) => {
  const name = e.childNodes[5].firstChild.nodeValue;

  const { value: fecha } = await Swal.fire({
    title: `Obtener Historico de: ${name}`,

    html: `<form>
               <label>Ingrese la fecha:</label>
               <input type="date" max="2021-12-31">
           </form>
    `,
    confirmButtonText: "Ver resultado",
    showLoaderOnConfirm: true,
    preConfirm: (fecha) => {
      return fetch(
        `https://api.coingecko.com/api/v3/coins/${name}/history?date=${fecha}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.current_price}`,
      });
    }
  });
};
$inputBtn.addEventListener("keyup", (e) => {
  if (e.key === "Escape") e.target.value = "";
  document
    .querySelectorAll(".tr-coins")
    .forEach((el) =>
      el.textContent.toLowerCase().includes(e.target.value)
        ? el.classList.remove("filter")
        : el.classList.add("filter")
    );
});
