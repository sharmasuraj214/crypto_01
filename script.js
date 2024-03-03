async function fetchAPI() {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
  
    let retries = 0;
    while (retries < 5) {
      try {
        const response = await fetch(url);
        const receivedData = await response.json();
        handleData(receivedData);
        return;
      } catch (err) {
        retries++;
      }
    }
  
    console.log("Couldn't get any data from coingecko.com");
  }
  
  function handleData(receivedData) {
    data.push(
      ...receivedData.map((item) => ({
        rank: item.market_cap_rank,
        image: item.image,
        name: item.name,
        symbol: item.symbol,
        currentPrice: item.current_price,
        totalVolume: item.total_volume,
        priceChangePercentage: item.price_change_percentage_24h,
        marketCap: item.market_cap,
      }))
    );
  
    displayData();
  }
  
  function displayData(sortBy = "rank", arr = data) {
    arr.sort((a, b) =>
      sortBy === "rank" ? a.rank - b.rank : b[sortBy] - a[sortBy]
    );
    display(arr);
  }
  
  function display(arr = data) {
    const container = document.querySelector("#display");
    container.innerHTML = arr
      .map(
        (item) => `
      <tr>
        <td>
          <div class="item-info">
            <img src="${item.image}" alt="${
          item.name
        } logo" width="30" height="30"/>
            <p>${item.name}</p>
          </div>
        </td>
        <td>${item.symbol.toUpperCase()}</td>
        <td>&dollar;${formatPrice(item.currentPrice)}</td>
        <td>&dollar;${formatPrice(item.totalVolume)}</td>
        <td class="percent">${item.priceChangePercentage}&percnt;</td>
        <td>Mkt Cap : &dollar;${formatPrice(item.marketCap)}</td>
      </tr>
    `
      )
      .join("");
  
    formatPercentage();
  }
  
  function formatPrice(price) {
    return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function formatPercentage() {
    document.querySelectorAll(".percent").forEach((item) => {
      const numberValue = parseFloat(item.innerText);
      item.style.color =
        numberValue < 0 ? "var(--negative-color)" : "var(--positive-color)";
    });
  }
  
  const data = [];
  
  document.addEventListener("DOMContentLoaded", async () => {
    fetchAPI();
  });
  
  document.querySelector("#marketCap").addEventListener("click", (e) => {
    displayData("marketCap");
  });
  
  document.querySelector("#percentage").addEventListener("click", (e) => {
    displayData("priceChangePercentage");
  });
  
  document
    .querySelector("#search-container input")
    .addEventListener("input", (e) => {
      const searchText = e.target.value.trim().toUpperCase();
      const filteredData = data.filter((item) => {
        return (
          item.name.toUpperCase().includes(searchText) ||
          item.symbol.toUpperCase().includes(searchText)
        );
      });
      displayData("rank", filteredData);
    });