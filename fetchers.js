export function getPrices() {
  return fetch("https://api.coinpaprika.com/v1/tickers").then((response) =>
    response.json()
  );
}
export function getCoins() {
  return fetch("https://api.coinpaprika.com/v1/coins").then((response) =>
    response.json()
  );
}
export function getNews() {
  return fetch(
    "https://hn.algolia.com/api/v1/search_by_date?query=cryptocurrency&tags=story&numericFilters=points>20"
  ).then((response) => response.json());
}
export function getDetail(id) {
  return fetch(`https://api.coinpaprika.com/v1/coins/${id}`).then((response) =>
    response.json()
  );
}
