const iceCream = document.getElementById('ice-cream');
const ingredients = document.querySelectorAll('.item');
const resetButton = document.getElementById('reset');
const amountDisplay = document.getElementById('amount-display');

let coneSelected = false;
let totalPrice = 0;

const prices = {
    'Normal': 20,
    'Waffle': 30,
    'Vanilla': 40,
    'Chocolate': 50,
    'Strawberry': 60,
    'Butterscotch': 50,
    'Mango': 60,
    'Pistachio': 50,
    'Sprinkles': 10,
    'Syrup': 15,
    'Chocolate chips': 20,
    'Cereal': 15,
    'Oreo': 20
};

ingredients.forEach(item => {
    item.addEventListener('dragstart', dragStart);
});

iceCream.addEventListener('dragover', dragOver);
iceCream.addEventListener('dragleave', dragLeave);
iceCream.addEventListener('drop', drop);

function dragStart(event) {
    const ingredient = event.target.getAttribute('data-ingredient');
    event.dataTransfer.setData('text/plain', ingredient);
    event.dataTransfer.setData('class', event.target.className);
    event.dataTransfer.setData('id', event.target.src);
}

function dragOver(event) {
    event.preventDefault();
    iceCream.classList.add('dragover');
}

function dragLeave(event) {
    iceCream.classList.remove('dragover');
}

function drop(event) {
    event.preventDefault();
    iceCream.classList.remove('dragover');

    const text = event.dataTransfer.getData('text/plain');
    const className = event.dataTransfer.getData('class');
    const src = event.dataTransfer.getData('id');

    if (className.includes('cone')) {
        if (coneSelected) {
            alert('You can only select one cone!');
            return;
        }
        coneSelected = true;

        const coneImage = document.createElement('img');
        coneImage.src = src;
        coneImage.className = `${className} removable`;
        coneImage.style.width = '100%';
        coneImage.style.position = 'absolute';
        coneImage.style.bottom = '0';
        coneImage.addEventListener('click', removeItem);
        iceCream.appendChild(coneImage);

        totalPrice += prices[text];
        updateBill();
        return;
    }

    if (!coneSelected) {
        alert('Please select a cone first!');
        return;
    }

    const newImage = document.createElement('img');
    newImage.src = src;
    newImage.className = `${className} removable`;
    newImage.style.width = '80%';
    newImage.style.position = 'absolute';
    newImage.style.bottom = `${20 + iceCream.children.length * 50}px`;
    newImage.style.left = '10%';
    newImage.addEventListener('click', removeItem);
    iceCream.appendChild(newImage);

    totalPrice += prices[text];
    updateBill();
}

function removeItem(event) {
    const item = event.target;

    if (item.classList.contains('cone')) {
        coneSelected = false;
        iceCream.innerHTML = '';
        totalPrice = 0;
    } else {
        iceCream.removeChild(item);

        const text = item.getAttribute('alt') || 'Item';
        totalPrice -= prices[text];
    }

    updateBill();
}

function updateBill() {
    amountDisplay.innerText = `Total: ₹${totalPrice}`;
}

resetButton.addEventListener('click', () => {
    iceCream.innerHTML = '';
    coneSelected = false;
    totalPrice = 0;
    updateBill();
});
