// Referência aos elementos do DOM
const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");
const searchInput = document.getElementById("search");
const sortOptions = document.getElementById("sortOptions");

// Variáveis globais para armazenar o estado atual de ordenação e filtro
let currentOrder = "nome";
let currentFilter = "";

// Função para carregar os produtos com base na pesquisa e ordenação
async function loadProducts(order = "nome", filter = "") {
  try {
    // Construir a URL com base nos parâmetros 'order' e 'filter'
    let url = `http://localhost:8080/produto?order=${order}`;
    if (filter) {
      url += `&filter=${filter}`;
    }

    // Fazendo a requisição para a API
    const response = await fetch(url);

    // Verificando se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error("Erro ao acessar a API: " + response.status);
    }

    const products = await response.json();

    // Verificando o conteúdo recebido
    console.log(products);

    // Renderizando os produtos
    let htmlContent = "";
    products.forEach(product => {
      htmlContent += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card">
            <img src="${product.url}" class="card-img-top" alt="${product.nome || 'Imagem do produto'}">
            <div class="card-body">
              <h5 class="card-title">${product.nome || 'Produto sem nome'}</h5>
              <p class="card-text">Preço: R$ ${product.preco || '0,00'}</p>
            </div>
          </div>
        </div>
      `;
    });

    // Atualizando o DOM com os produtos
    productList.innerHTML = htmlContent;
    productCount.textContent = `Total de produtos: ${products.length}`;
  } catch (error) {
    console.error("Erro ao carregar os produtos:", error);
    productList.innerHTML = "<p class='text-danger'>Erro ao carregar produtos.</p>";
  }
}

// Carregando os produtos ao iniciar a página
window.onload = function() {
  loadProducts(); // Carregar os produtos sem filtro inicial
};

// Adicionando um evento de escuta para o campo de pesquisa
searchInput.addEventListener("input", function() {
  currentFilter = searchInput.value.trim(); // Atualiza o valor do filtro
  loadProducts(currentOrder, currentFilter); // Recarrega os produtos com ordenação e filtro atualizados
});

// Adicionando um evento de escuta para as opções de ordenação
sortOptions.addEventListener("change", (event) => {
  currentOrder = event.target.value; // Atualiza o valor da ordenação
  loadProducts(currentOrder, currentFilter); // Recarrega os produtos com ordenação e filtro atualizados
});
