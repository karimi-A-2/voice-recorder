console.log("Running...");

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // var test = document.getElementsByClassName('upload-btn')
    // for (var i = 0; i < test.length; i++) {
    //     console.log(test[i]);
    //     test[i].addEventListener('click', upload)
    // }
    var uploadButton = document.getElementsByClassName('upload-btn')
    uploadButton[0].addEventListener('click', upload)

    var recordButton = document.getElementsByClassName('record-btn')
    recordButton[0].addEventListener('click', record)

    var addClassButton = document.getElementsByClassName('add-class-btn')
    addClassButton[0].addEventListener('click', addClass)
}

function upload(event) {
    alert('uploading');
    console.log("upload");
}

function record(event) {
    alert('recording');
    console.log("record");
}

function addClass(event) {
    // alert('addClass');
    var checkbox = document.createElement('label')
    checkbox.classList.add('checkbox-container')
    var continer = document.getElementsByClassName('class-checkbox')[0];
    className = 'hey'
    checkboxContent = `
    ${className}
    <input type="checkbox" checked="checked">
    <span class="checkmark"></span>
    `
    checkbox.innerHTML = checkboxContent
    continer.append(checkbox)
    console.log("added");
}

// function addItemToCart(title, price, imageSrc) {
//     var cartRow = document.createElement('div')
//     cartRow.classList.add('cart-row')
//     var cartItems = document.getElementsByClassName('cart-items')[0]
//     var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
//     for (var i = 0; i < cartItemNames.length; i++) {
//         if (cartItemNames[i].innerText == title) {
//             alert('This item is already added to the cart')
//             return
//         }
//     }
//     var cartRowContents = `
//         <div class="cart-item cart-column">
//             <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
//             <span class="cart-item-title">${title}</span>
//         </div>
//         <span class="cart-price cart-column">${price}</span>
//         <div class="cart-quantity cart-column">
//             <input class="cart-quantity-input" type="number" value="1">
//             <button class="btn btn-danger" type="button">REMOVE</button>
//         </div>`
//     cartRow.innerHTML = cartRowContents
//     cartItems.append(cartRow)
//     cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
//     cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
// }

