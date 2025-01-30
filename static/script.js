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

// Adjust image size dynamically based on the number of ingredients
function getImageSize() {
    const currentItemCount = iceCream.children.length; // Get the current number of children in the container
    const baseSize = 100; // Base size for the first item (full size)
    
    let newSize = baseSize - (currentItemCount * 7); // Decrease size by 7% for each new item
    
    const minSize = 10; // Minimum size for each image (avoid it becoming too small)
    if (newSize < minSize) {
        newSize = minSize; // Prevent the image from becoming too small
    }
    
    return newSize;
}

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

    // For the cone (first item)
    if (className.includes('cone')) {
        if (coneSelected) {
            alert('You can only select one cone!');
            return;
        }
        coneSelected = true;

        const coneImage = document.createElement('img');
        coneImage.src = src;
        coneImage.className = `${className} removable`;

        // Add data-ingredient attribute to the cone
        coneImage.setAttribute('data-ingredient', text); // Set the ingredient for the cone

        // **Resize Cone Image Here:**
        const imageSize = getImageSize(); // Get the appropriate image size for cone
        coneImage.style.width = `${imageSize}%`; // Dynamically set the width for the cone

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

    // For scoops and toppings, adjust image size dynamically
    const newImage = document.createElement('img');
    newImage.src = src;
    newImage.className = `${className} removable`;

    // Add data-ingredient attribute to the ingredient (scoop/topping)
    newImage.setAttribute('data-ingredient', text); // Set the ingredient for the scoop/topping

    // **Resize Image Here for scoops/toppings:**
    const imageSize = getImageSize(); // Get the appropriate image size
    newImage.style.width = `${imageSize}%`; // Dynamically set the width for scoops/toppings

    // Get the bottom position dynamically by checking the last item's position
    let lastItemBottom = 0;
    if (iceCream.children.length > 0) {
        // Get the last ingredient (scoop/topping) position
        const lastItem = iceCream.children[iceCream.children.length - 1];
        lastItemBottom = parseInt(lastItem.style.bottom) || 0;
    }

    newImage.style.position = 'absolute';
    newImage.style.left = '10%';
    newImage.style.bottom = `${lastItemBottom + getImageSize()}px`; // Ensure the next item just touches the previous one
    newImage.addEventListener('click', removeItem);
    iceCream.appendChild(newImage);

    totalPrice += prices[text];
    updateBill();
}

function removeItem(event) {
    const item = event.target;
    
    // Get the ingredient name from the data-ingredient attribute
    const ingredient = item.getAttribute('data-ingredient');
    console.log('Removing item:', ingredient); // Debugging line

    // Check if ingredient exists in the prices object
    if (!prices[ingredient]) {
        console.error('Price not found for:', ingredient); // Debugging line
        return; // Prevent further action if the ingredient doesn't exist in the price list
    }

    // If the item is a cone, reset the entire ice cream and total price
    if (item.classList.contains('cone')) {
        coneSelected = false;
        iceCream.innerHTML = ''; // Reset everything in the container
        totalPrice = 0; // Reset total price
    } else {
        // Subtract the price for the removed ingredient
        totalPrice -= prices[ingredient];

        // Log to check price subtraction
        console.log('Total price after subtraction:', totalPrice); // Debugging line

        // Remove the item from the container
        iceCream.removeChild(item);
    }

    updateBill(); // Update the displayed total price
}

// Function to detect changes in the box
function updateBox() {
  const ingredients = iceCream.querySelectorAll('.removable'); // Check if there are any ingredients

  // If there are no ingredients, show the text "Drag ingredients here"
  const dragText = document.getElementById('drag-text');
  if (ingredients.length === 0) {
    dragText.style.display = 'block'; // Show the drag text
  } else {
    dragText.style.display = 'none'; // Hide the drag text
  }
}

function updateBill() {
    amountDisplay.innerText = `Total: ₹${totalPrice}`;
}

resetButton.addEventListener('click', () => {
    iceCream.innerHTML = '';
    coneSelected = false;
    totalPrice = 0;
    updateBill();
    updateBox(); // Update the visibility of drag text after reset
});
