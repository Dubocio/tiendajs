const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
addToShoppingCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', addToCartClicked);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector(
  '.shoppingCartItemsContainer'
);

function addToCartClicked(event) {
  const button = event.target;
  const item = button.closest('.item');

  const itemTitle = item.querySelector('.item-title').textContent;
  const itemPrice = item.querySelector('.item-price').textContent;
  const itemImage = item.querySelector('.item-image').src;

  addItemToShoppingCart(itemTitle, itemPrice, itemImage);
}

function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
    'shoppingCartItemTitle'
  );
  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      let elementQuantity = elementsTitle[
        i
      ].parentElement.parentElement.parentElement.querySelector(
        '.shoppingCartItemQuantity'
      );
      elementQuantity.value++;
      $('.toast').toast('show');
      updateShoppingCartTotal();
      return;
    }
  }

  const shoppingCartRow = document.createElement('div');
  const shoppingCartContent = `
  <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
  shoppingCartRow.innerHTML = shoppingCartContent;
  shoppingCartItemsContainer.append(shoppingCartRow);

  shoppingCartRow
    .querySelector('.buttonDelete')
    .addEventListener('click', removeShoppingCartItem);

  shoppingCartRow
    .querySelector('.shoppingCartItemQuantity')
    .addEventListener('change', quantityChanged);

  updateShoppingCartTotal();
}

function updateShoppingCartTotal() {
  let total = 0;
  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

  shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      '.shoppingCartItemPrice'
    );
    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace('$', '')
    );
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      '.shoppingCartItemQuantity'
    );
    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.value
    );
    total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
  });
  shoppingCartTotal.innerHTML = `${total.toFixed(2)}$`;
}

function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  buttonClicked.closest('.shoppingCartItem').remove();
  updateShoppingCartTotal();
}

function quantityChanged(event) {
  const input = event.target;
  input.value <= 0 ? (input.value = 1) : null;
  updateShoppingCartTotal();
}

function comprarButtonClicked() {
  shoppingCartItemsContainer.innerHTML = '';
  updateShoppingCartTotal();
}


const comments = [];
const inputContainer = document.createElement('div');
const input = document.createElement('input');
const commentsContainer = document.querySelector("#comments-container");

input.classList.add("input");

input.addEventListener("keydown", (e) => {
  handleEnter(e, null);
});

commentsContainer.appendChild(inputContainer);
inputContainer.appendChild(input);

function handleEnter(e, current){
  if(e.key == 'Enter' &&  e.target.value != '')
  {
    const newComment = {
      text: e.target.value,
      likes: 0,
      responses: []
    }
    if(current == null){
      comments.unshift(newComment);
    }else{
      current.responses.unshift(newComment);
    }
    e.target.value= '';
    commentsContainer.innerHTML = '';
    commentsContainer.appendChild(inputContainer);
    renderComments(comments, commentsContainer);
  }
}

function renderComments(arr, parent){
  arr.forEach(element => {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('commentContainer');

    const responsesContainer = document.createElement('div');
    responsesContainer.classList.add('responses-container');

    const replyButton = document.createElement('button');

    const likeButton = document.createElement('button');
    const textContainer = document.createElement('div');
    textContainer.textContent = element.text;

    const actionsContainer = document.createElement('div');
    replyButton.textContent= "Reply";
    likeButton.textContent = `${element.likes > 0? `${element.likes} likes`: "like"}`;
    replyButton.addEventListener('click', (e) =>{
      const newInput = inputContainer.cloneNode(true);
      newInput.value = '';
      newInput.focus();
      newInput.addEventListener('keydown', (e) => {handleEnter(e, element)});
      commentContainer.insertBefore(newInput, responsesContainer);
    });
    likeButton.addEventListener('click', (e) =>{
      element.likes++;
      likeButton.textContent = `${element.likes > 0? `${element.likes} likes`: "like"}`;
    });
    commentContainer.appendChild(textContainer);
    commentContainer.appendChild(actionsContainer);
    actionsContainer.appendChild(replyButton);
    actionsContainer.appendChild(likeButton);

    commentContainer.appendChild(responsesContainer);

    if(element.responses.length > 0){
      renderComments(element.responses, responsesContainer);
    }
    parent.appendChild(commentContainer);
  });
}

guardarLocalStorage();

function guardarLocalStorage(){
  let creador = {
    nombre: "Marcio",
    apellido: "Dubokovic",
    curso: "Javascript",
    comision: "30380",
    mail: "dubokovic7@gmail.com"
  }
  localStorage.setItem( "creador", JSON.stringify(creador))
  console.log("Creador de la tienda")
  console.log(creador)
};


document.getElementById('fundador').addEventListener('click', cargarJson);

function cargarJson(){
  fetch('fundador.json')
  .then(function(res){
    return res.json();
  })
  .then(function(fundador){
    console.log(fundador);
    document.getElementById('resultado').innerHTML = JSON.stringify(fundador);
  })
  .catch(function(error){
    console.log(error);
  });
}
