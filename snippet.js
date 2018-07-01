(function justBounce(){
  console.log('Gainor was here..');
  let subTotal = 0;

  const itemsInCart = document.querySelector('.minicart-quantity').textContent;
  if(!!document.querySelector('.order-subtotal')) { 
    subTotal = document.querySelector('.order-subtotal').childNodes[3].textContent;
  }
  const itemNodeList = document.querySelectorAll('.mini-cart-product');
  const items = [...itemNodeList].map(item => {
    return {
      name: item.children[2].innerText,
      color: item.children[3].children["0"].innerText,
      size: item.children[3].children[1].innerText,
      image: item.children[1].children["0"].children["0"].outerHTML,
      price: item.children[4].children[2].textContent,
      qty: item.children[4].children[1].innerText
    }
  });

  // CREATE GRID FOR ITEM DATA
  itemNodeList.forEach((item, idx) => {
    let itemsDiv = document.createElement('div');
    itemsDiv.classList.add(`item-container-${idx}`);
    itemsDiv.setAttribute('style', "display: grid; grid-template-columns: auto 1fr; grid-gap: 10px; border-bottom: 1px solid #cbcbcb; margin-bottom: 10px;");
    let imgDiv = document.createElement('div');
    imgDiv.classList.add(`img-container-${idx}`);
    let itemDesc = document.createElement('div');
    itemDesc.classList.add(`desc-container-${idx}`);
    itemDesc.setAttribute('style', "align-self: center; padding: 10px; font-size: 15px;");
    
    itemsDiv.appendChild(imgDiv);
    itemsDiv.appendChild(itemDesc);
    document.body.appendChild(itemsDiv);
  });

  function setStorage(){
    const storageObj = {
      itemsInCart,
      subTotal,
      items
    }

    return localStorage.setItem('bounceX', JSON.stringify(storageObj));
  }

  function getStorage(){
    return JSON.parse(localStorage.getItem('bounceX'));
  }

  function createModal(){
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.setAttribute("style", "display: none; position: fixed; z-index: 10000; left: 0; top: 0; height: 100%; width: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.5);");
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.setAttribute("style", "border: 2px solid #c6d7e7; position: relative; background-color: #fff; margin: 20% auto; width: 70%; box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.2);");
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.setAttribute("style", "padding: 10px 20px;")
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalFooter.setAttribute("style", "padding: 10px; color: black; text-align: center;");

    const closeButton = createButton("Close");
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    const atcButton = createButton("Proceed to Cart");
    const atcLink = document.querySelector('.minicart-link').getAttribute('href');
    atcButton.addEventListener('click', () => location.href = atcLink);

    modalFooter.appendChild(closeButton);
    modalFooter.appendChild(atcButton);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);
    return document.body.appendChild(modal);
  }

  function createButton(buttonText){
    const button = document.createElement('button');
    const span = document.createElement('span');
    button.setAttribute('style', "margin-left: 10px;");
    button.classList.add('submit-btn');
    span.textContent = buttonText;
    span.classList.add('primary-button');
    button.appendChild(span);
    return button;
  }

  function addContentToModal(){
    const storage = getStorage();
    const modalBody = document.querySelector('.modal-body');

    storage.items.forEach(renderItems);

    const priceDiv = document.createElement('div');
    priceDiv.setAttribute("style", "font-size: 16px; letter-spacing: .6px; text-align: center;");
    if(storage.itemsInCart === '0'){
      priceDiv.innerHTML = `You have ${storage.itemsInCart} item(s) in your cart.`;
    } else {
      priceDiv.innerHTML = `You have ${storage.itemsInCart} item(s) in your cart, with a subtotal of ${storage.subTotal}.`;
    }
    modalBody.appendChild(priceDiv);
    return modalBody;
  }

  function renderItems(item, index, arr){
    const modalBody = document.querySelector('.modal-body');
    const itemContainer = document.querySelector(`.item-container-${index}`);
    const imgContainer = document.querySelector(`.img-container-${index}`);
    const descContainer = document.querySelector(`.desc-container-${index}`);
    imgContainer.innerHTML = arr[index].image;
    descContainer.innerHTML += `<p style="margin: 5px; font-size: 18px;"><strong>${item.name}</strong></p>
                                <p style="margin: 5px;">${item.color}</p>
                                <p style="margin: 5px;">${item.size}</p>
                                <p style="margin: 5px;">Qty: ${item.qty}</p>
                                <p style="margin: 5px;">Price: ${item.price}</p>`;

    itemContainer.appendChild(imgContainer);
    itemContainer.appendChild(descContainer);
    return modalBody.appendChild(itemContainer);
  }

  function showModal() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * .9) {
      return modal.style.display = 'block';
    }
  }

  function clickOutside(e) {
    if (e.target == modal) {
      return modal.style.display = 'none';
    }
  }

  setStorage();
  const modal = createModal();
  addContentToModal();
  window.addEventListener('click', clickOutside);
  window.addEventListener('scroll', showModal);
})();