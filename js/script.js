// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu') || document.createElement('nav');
const productsGrid = document.getElementById('products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCount = document.querySelector('.cart-count');
const backToTop = document.getElementById('back-to-top');

// Create mobile menu if not exists
if (!document.querySelector('.mobile-menu')) {
    mobileMenu.classList.add('mobile-menu');
    mobileMenu.innerHTML = `
    `;
    document.body.appendChild(mobileMenu);
}

// Variables
let products = [];
let cartItems = 0;
let countdownInterval;

// Countdown Timer
function startCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;

    let hours = 2;
    let minutes = 15;
    let seconds = 45;

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    clearInterval(countdownInterval);
                    countdownElement.innerHTML = '<span>00</span>:<span>00</span>:<span>00</span>';
                    return;
                }
            }
        }
        countdownElement.innerHTML = `
            <span>${hours.toString().padStart(2, '0')}</span>:<span>${minutes.toString().padStart(2, '0')}</span>:<span>${seconds.toString().padStart(2, '0')}</span>
        `;
    }, 1000);
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display Products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'fade-in');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                ${product.oldPrice ? `<span class="sale-badge">SALE</span>` : ''}
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}${product.oldPrice ? ` <span class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}</p>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    // Trigger fade-in animation
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }, 100);
}

// Filter Products
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(product => product.category === category);
        displayProducts(filtered);
    }
}

// Add to Cart
function addToCart(event) {
    cartItems++;
    cartCount.textContent = cartItems;
    // Simple animation
    event.target.textContent = 'Adicionado!';
    setTimeout(() => {
        event.target.textContent = 'Adicionar ao Carrinho';
    }, 1000);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Scroll Events
function handleScroll() {
    // Navbar background change
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
}

// Event Listeners
hamburger.addEventListener('click', toggleMobileMenu);
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProducts(btn.dataset.filter);
    });
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', handleScroll);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    startCountdown();
    handleScroll(); // Initial check
});