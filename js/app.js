// seleciona elementos do DOM para manipulação
const form = document.querySelector(".grocery-form"); // formulário para adicionar itens
const alert = document.querySelector(".alert"); // elemento de alerta para mensagens ao usuário
const grocery = document.getElementById("grocery"); // campo de entrada de texto para itens
const submitBtn = document.querySelector(".submit-btn"); // botão de envio ou edição
const container = document.querySelector(".grocery-container"); // container que exibe a lista de itens
const list = document.querySelector(".grocery-list"); // lista onde os itens são exibidos
const clearBtn = document.querySelector(".clear-btn"); // botão para limpar todos os itens

// variáveis para controle de edição
let editElement; // referência ao elemento que está sendo editado
let editFlag = false; // flag para identificar se está no modo de edição
let editID = ""; // id do item que está sendo editado

// adiciona os ouvintes de eventos
form.addEventListener("submit", addItem); // evento de envio do formulário
clearBtn.addEventListener("click", clearItems); // evento para limpar itens da lista
window.addEventListener("DOMContentLoaded", setupItems); // carrega os itens salvos no localStorage ao carregar a página

// função para adicionar ou editar um item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value; // valor digitado no campo
  const id = new Date().getTime().toString(); // cria um id único baseado no timestamp atual

  // adiciona novo item
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); // cria um novo elemento
    let attr = document.createAttribute("data-id"); // cria um atributo personalizado para identificar o item
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

    // adiciona funcionalidade aos botões de editar e deletar
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element); // adiciona o item à lista
    displayAlert("item adicionado à lista", "success"); // exibe mensagem de sucesso
    container.classList.add("show-container"); // exibe o container da lista
    addToLocalStorage(id, value); // salva o item no localStorage
    setBackToDefault(); // reseta o formulário
  } else if (value !== "" && editFlag) {
    // edita item existente
    editElement.innerHTML = value; // altera o conteúdo do elemento
    displayAlert("valor alterado", "success"); // exibe mensagem de sucesso
    editLocalStorage(editID, value); // atualiza o item no localStorage
    setBackToDefault(); // reseta o formulário
  } else {
    displayAlert("por favor, insira um valor", "danger"); // mensagem de erro para entrada vazia
  }
}

// exibe alertas ao usuário
function displayAlert(text, action) {
  alert.textContent = text; // define o texto do alerta
  alert.classList.add(`alert-${action}`); // aplica estilo ao alerta
  setTimeout(function () {
    alert.textContent = ""; // remove o texto após 1 segundo
    alert.classList.remove(`alert-${action}`); // remove o estilo
  }, 1000);
}

// limpa todos os itens da lista
function clearItems() {
  const items = document.querySelectorAll(".grocery-item"); // seleciona todos os itens da lista
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item); // remove cada item
    });
  }
  container.classList.remove("show-container"); // esconde o container da lista
  displayAlert("lista vazia", "danger"); // exibe mensagem de aviso
  setBackToDefault(); // reseta o formulário
  localStorage.removeItem("list"); // remove todos os itens do localStorage
}

// remove um item da lista
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // obtém o elemento do item
  const id = element.dataset.id; // obtém o id do item

  list.removeChild(element); // remove o item da lista

  if (list.children.length === 0) {
    container.classList.remove("show-container"); // esconde o container da lista se estiver vazio
  }
  displayAlert("item removido", "danger"); // exibe mensagem de remoção
  setBackToDefault(); // reseta o formulário
  removeFromLocalStorage(id); // remove o item do localStorage
}

// entra no modo de edição para um item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // obtém o elemento do item
  editElement = e.currentTarget.parentElement.previousElementSibling; // referência ao conteúdo do item
  grocery.value = editElement.innerHTML; // preenche o campo de entrada com o valor do item
  editFlag = true; // ativa o modo de edição
  editID = element.dataset.id; // salva o id do item em edição
  submitBtn.textContent = "edit"; // altera o texto do botão para "edit"
}

// reseta o formulário e o estado para o padrão
function setBackToDefault() {
  grocery.value = ""; // limpa o campo de entrada
  editFlag = false; // desativa o modo de edição
  editID = ""; // reseta o id em edição
  submitBtn.textContent = "submit"; // altera o texto do botão para "submit"
}

// salva um item no localStorage
function addToLocalStorage(id, value) {
  const grocery = { id, value }; // cria objeto para o item
  let items = getLocalStorage(); // obtém os itens existentes
  items.push(grocery); // adiciona o novo item
  localStorage.setItem("list", JSON.stringify(items)); // salva os itens no localStorage
}

// obtém os itens do localStorage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list")) // retorna os itens como array
    : []; // retorna array vazio se não houver itens
}

// remove um item do localStorage
function removeFromLocalStorage(id) {
  let items = getLocalStorage(); // obtém os itens existentes
  items = items.filter(function (item) {
    return item.id !== id; // remove o item com o id correspondente
  });
  localStorage.setItem("list", JSON.stringify(items)); // atualiza o localStorage
}

// edita um item no localStorage
function editLocalStorage(id, value) {
  let items = getLocalStorage(); // obtém os itens existentes
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value; // atualiza o valor do item correspondente
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items)); // salva as alterações no localStorage
}

// configura a lista inicial com os itens salvos no localStorage
function setupItems() {
  let items = getLocalStorage(); // obtém os itens existentes
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value); // cria um elemento para cada item
    });
    container.classList.add("show-container"); // exibe o container da lista
  }
}

// cria um elemento para a lista
function createListItem(id, value) {
  const element = document.createElement("article"); // cria um elemento artigo
  let attr = document.createAttribute("data-id"); // cria atributo personalizado
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem); // adiciona funcionalidade ao botão de deletar
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem); // adiciona funcionalidade ao botão de editar

  list.appendChild(element); // adiciona o elemento à lista
}
