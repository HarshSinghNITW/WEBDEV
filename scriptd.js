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

        this.cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const productId = parseInt(e.target.dataset.productId);
                this.removeItem(productId);
            }
        });
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

const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const meridiemEl = document.getElementById('meridiem');
const dateEl = document.getElementById('date');
const stopwatchEl = document.getElementById('stopwatch');
const countdownEl = document.getElementById('countdown');
const progressEl = document.getElementById('progress');
const countdownMinutesEl = document.getElementById('countdownMinutes');
const countdownSecondsEl = document.getElementById('countdownSeconds');
const alarmsListEl = document.getElementById('alarmsList');

let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;

let countdownInterval;
let countdownTotal = 0;
let countdownRemaining = 0;
let countdownRunning = false;

let alarms = [];
let alarmSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');

function setTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('clockTheme', theme);
    
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim().toLowerCase().includes(theme)) {
            btn.classList.add('active');
        }
    });
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('clockTheme') || 'light';
    setTheme(savedTheme);
}

function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
    meridiemEl.textContent = meridiem;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
    
    checkAlarms(now);
}

function setAlarm() {
    const alarmTimeInput = document.getElementById('alarmTime');
    if (!alarmTimeInput.value) {
        alert('Please select a time for the alarm');
        return;
    }
    
    const [hoursStr, minutesStr] = alarmTimeInput.value.split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    
    const alarm = {
        id: Date.now(),
        hours,
        minutes,
        enabled: true
    };
    
    alarms.push(alarm);
    saveAlarms();
    displayAlarms();
        
    alert(`Alarm set for ${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`);
}

function saveAlarms() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

function loadAlarms() {
    const savedAlarms = localStorage.getItem('alarms');
    if (savedAlarms) {
        alarms = JSON.parse(savedAlarms);
        displayAlarms();
    }
}

function displayAlarms() {
    if (alarms.length === 0) {
        alarmsListEl.innerHTML = '<div class="no-alarms">No alarms set</div>';
        return;
    }
    
    alarmsListEl.innerHTML = '';
    alarms.forEach(alarm => {
        const hours12 = alarm.hours > 12 ? alarm.hours - 12 : alarm.hours;
        const meridiem = alarm.hours >= 12 ? 'PM' : 'AM';
        const hoursDisplay = hours12 === 0 ? 12 : hours12;
        
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.innerHTML = `
            <div>
                <span>${hoursDisplay.toString().padStart(2, '0')}:${alarm.minutes.toString().padStart(2, '0')} ${meridiem}</span>
            </div>
            <div>
                <button onclick="toggleAlarm(${alarm.id})" class="btn">
                    ${alarm.enabled ? 'ON' : 'OFF'}
                </button>
                <button onclick="deleteAlarm(${alarm.id})" class="delete-btn">
                    X
                </button>
            </div>
        `;
        alarmsListEl.appendChild(alarmItem);
    });
}

function toggleAlarm(id) {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
        alarm.enabled = !alarm.enabled;
        saveAlarms();
        displayAlarms();
    }
}

function deleteAlarm(id) {
    alarms = alarms.filter(a => a.id !== id);
    saveAlarms();
    displayAlarms();
}

function clearAlarms() {
    alarms = [];
    saveAlarms();
    displayAlarms();
}

function checkAlarms(now) {
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    alarms.forEach(alarm => {
        if (alarm.enabled && 
            currentHours === alarm.hours && 
            currentMinutes === alarm.minutes && 
            currentSeconds === 0) {
            triggerAlarm(alarm);
        }
    });
}

function triggerAlarm(alarm) {
    alarmSound.loop = true;
    alarmSound.play();
    
    const clockEl = document.querySelector('.clock');
    clockEl.classList.add('shake');
    
    const hours12 = alarm.hours > 12 ? alarm.hours - 12 : alarm.hours;
    const meridiem = alarm.hours >= 12 ? 'PM' : 'AM';
    const hoursDisplay = hours12 === 0 ? 12 : hours12;
    
    const confirmStop = confirm(`Alarm: ${hoursDisplay}:${alarm.minutes.toString().padStart(2, '0')} ${meridiem}`);
    if (confirmStop) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        clockEl.classList.remove('shake');
    }
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        document.getElementById('startStopwatch').innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function pauseStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
    document.getElementById('startStopwatch').innerHTML = '<i class="fas fa-play"></i> Start';
}

function updateStopwatch() {
    stopwatchTime++;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600);
    const minutes = Math.floor((stopwatchTime % 3600) / 60);
    const seconds = stopwatchTime % 60;
    
    stopwatchEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startCountdown() {
    if (countdownRunning) {
        clearInterval(countdownInterval);
        countdownRunning = false;
        document.querySelector('.countdown-section .btn').innerHTML = '<i class="fas fa-play"></i> Resume Countdown';
        return;
    }
    
    if (countdownRemaining <= 0) {
        const minutes = parseInt(countdownMinutesEl.value) || 0;
        const seconds = parseInt(countdownSecondsEl.value) || 0;
        
        if (minutes === 0 && seconds === 0) {
            alert('Please enter time for countdown');
            return;
        }
        
        countdownTotal = (minutes * 60) + seconds;
        countdownRemaining = countdownTotal;
    }
    
    updateCountdownDisplay();
    countdownRunning = true;
    document.querySelector('.countdown-section .btn').innerHTML = '<i class="fas fa-pause"></i> Pause Countdown';
    
    countdownInterval = setInterval(() => {
        countdownRemaining--;
        
        if (countdownRemaining <= 0) {
            clearInterval(countdownInterval);
            countdownRunning = false;
            alert('Countdown finished!');
            
            countdownMinutesEl.value = '';
            countdownSecondsEl.value = '';
            document.querySelector('.countdown-section .btn').innerHTML = '<i class="fas fa-play"></i> Start Countdown';
            
            progressEl.style.width = '0%';
        }
        
        updateCountdownDisplay();
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownRunning = false;
    countdownRemaining = 0;
    countdownMinutesEl.value = '';
    countdownSecondsEl.value = '';
    countdownEl.textContent = '00:00';
    progressEl.style.width = '0%';
    document.querySelector('.countdown-section .btn').innerHTML = '<i class="fas fa-play"></i> Start Countdown';
}

function updateCountdownDisplay() {
    const minutes = Math.floor(countdownRemaining / 60);
    const seconds = countdownRemaining % 60;
    
    countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const progressPercent = (countdownRemaining / countdownTotal) * 100;
    progressEl.style.width = `${progressPercent}%`;
}

function setupKeypress() {
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const alarmTimeInput = document.getElementById('alarmTime');
            if (document.activeElement === alarmTimeInput) {
                setAlarm();
            }
        }
    });
}

function initialize() {
    updateClock();
    setInterval(updateClock, 1000);
    
    loadSavedTheme();
    loadAlarms();
    setupKeypress();
    
    updateStopwatchDisplay();
    
    const savedTheme = localStorage.getItem('clockTheme') || 'light';
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase().includes(savedTheme)) {
            btn.classList.add('active');
        }
    });
}

window.onload = initialize;