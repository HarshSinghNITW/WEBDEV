class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }

    createProductCard() {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${this.image}" alt="${this.name}">
            <h3>${this.name}</h3>
            <p>$${this.price.toFixed(2)}</p>
            <button data-product-id="${this.id}">Add to Cart</button>
        `;
        return card;
    }
}

class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
        this.addedAt = new Date();
    }

    getFormattedDateTime() {
        return this.addedAt.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

class Cart {
    constructor() {
        this.items = new Map();
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartCountElement = document.getElementById('cart-count');
        this.totalPriceElement = document.getElementById('total-price');
        this.cartSection = document.getElementById('cart-section');
        this.viewCartBtn = document.getElementById('view-cart-btn');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCartBtn = document.getElementById('close-cart-btn');

        this.viewCartBtn.addEventListener('click', () => this.toggleCart());
        this.checkoutBtn.addEventListener('click', () => this.checkout());
        this.closeCartBtn.addEventListener('click', () => this.toggleCart());
    }

    addItem(product) {
        if (this.items.has(product.id)) {
            const existingItem = this.items.get(product.id);
            existingItem.quantity++;
        } else {
            this.items.set(product.id, new CartItem(product, 1));
        }
        this.updateCart();
    }

    removeItem(productId) {
        this.items.delete(productId);
        this.updateCart();
    }

    updateCart() {
        this.cartItemsContainer.innerHTML = '';

        let totalPrice = 0;
        this.items.forEach((cartItem) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div>
                    <img src="${cartItem.product.image}" alt="${cartItem.product.name}">
                    ${cartItem.product.name} x ${cartItem.quantity}
                </div>
                <div>
                    <p>$${cartItem.getTotalPrice().toFixed(2)}</p>
                    <small>Added: ${cartItem.getFormattedDateTime()}</small>
                    <button class="remove-item" data-product-id="${cartItem.product.id}">🗑️</button>
                </div>
            `;
            this.cartItemsContainer.appendChild(cartItemElement);
            totalPrice += cartItem.getTotalPrice();
        });

        this.totalPriceElement.textContent = totalPrice.toFixed(2);
        this.cartCountElement.textContent = Array.from(this.items.values())
            .reduce((total, item) => total + item.quantity, 0);

        this.cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                this.removeItem(productId);
            });
        });
    }

    toggleCart() {
        this.cartSection.classList.toggle('show');
    }

    checkout() {
        if (this.items.size === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const checkoutSummary = Array.from(this.items.values()).map(cartItem => 
            `${cartItem.product.name} x ${cartItem.quantity} - $${cartItem.getTotalPrice().toFixed(2)} (Added: ${cartItem.getFormattedDateTime()})`
        ).join('\n');

        alert(`Checkout Summary:\n${checkoutSummary}\n\nTotal: $${this.calculateTotal().toFixed(2)}`);
        
        this.items.clear();
        this.updateCart();
        this.toggleCart();
    }

    calculateTotal() {
        return Array.from(this.items.values())
            .reduce((total, cartItem) => total + cartItem.getTotalPrice(), 0);
    }
}

const products = [
    new Product(1, 'Wireless Earbuds', 79.99, 'https://th.bing.com/th/id/OIP.C12s3armk2TpmvW8kjdvAgHaHa?rs=1&pid=ImgDetMain'),
    new Product(2, 'Smart Watch', 199.99, 'https://wonderfulengineering.com/wp-content/uploads/2020/11/10-best-Smart-Watches-Under-50-3.jpg'),
    new Product(3, 'Portable Charger', 49.99, 'https://images-na.ssl-images-amazon.com/images/I/616pFIyxdIL._AC_SL1500_.jpg'),
    new Product(4, 'Bluetooth Speaker', 89.99, 'https://m.media-amazon.com/images/I/81PZVF0WosS.jpg'),
    new Product(5, 'Noise-Canceling Headphones', 249.99, 'https://m.media-amazon.com/images/I/61wo5E8QmPL._AC_.jpg'),
    new Product(6, 'Fitness Tracker', 129.99, 'https://www.bhphotovideo.com/images/images1500x1500/polar_90064907_a370_fitness_tracker_medium_large_1340414.jpg')
];

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cart = new Cart();

    products.forEach(product => {
        const productCard = product.createProductCard();
        productList.appendChild(productCard);

        productCard.querySelector('button').addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const selectedProduct = products.find(p => p.id === productId);
            cart.addItem(selectedProduct);
        });
    });
});