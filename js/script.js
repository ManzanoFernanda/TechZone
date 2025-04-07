document.addEventListener('DOMContentLoaded', function() {
    // Selectors
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const navLinks = document.querySelectorAll('.menu a');
    const contactForm = document.querySelector('#contact-form');
    const formMessage = document.querySelector('#form-message');
    const productsContainer = document.querySelector('#products-container');
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            
            // Smooth scrolling
            const target = this.getAttribute('href');
            const targetElement = document.querySelector(target);
            
            if (targetElement) {
                event.preventDefault();
                
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const message = document.querySelector('#message').value.trim();
            
            // Validate form
            if (name === '' || email === '' || message === '') {
                showFormMessage('Por favor completa todos los campos', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Por favor ingresa un email válido', 'error');
                return;
            }
            
            // Form is valid - simulate submission
            showFormMessage('¡Mensaje enviado con éxito!', 'success');
            contactForm.reset();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 3000);
        });
    }
    
    // Display form message
    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = type;
        formMessage.style.display = 'block';
    }
    
    // Fetch products from API
    fetchProducts();
    
    function fetchProducts() {
        fetch('https://fakestoreapi.com/products?limit=4')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron cargar los productos');
                }
                return response.json();
            })
            .then(data => {
                displayProducts(data);
            })
            .catch(error => {
                productsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            });
    }
    
    function displayProducts(products) {
        // Clear loading message
        productsContainer.innerHTML = '';
        
        // Create product cards
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn add-to-cart" data-id="${product.id}">Agregar al carrito</button>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to "Add to cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                console.log(`Producto agregado al carrito: ID ${productId}`);
                
                // Animate button to provide visual feedback
                this.textContent = '¡Agregado!';
                this.style.backgroundColor = '#27ae60';
                
                // Reset button after 1 second
                setTimeout(() => {
                    this.textContent = 'Agregar al carrito';
                    this.style.backgroundColor = '';
                }, 1000);
            });
        });
    }
});
