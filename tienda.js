/* ========================================
   Aura Blanca — Tienda (index)
   ======================================== */

(function () {
  'use strict';

  /* ---------- Productos de ejemplo ---------- */
  var defaultProducts = [
    {
      id: 1,
      nombre: 'Vela Aromática Lavanda',
      descripcion: 'Vela artesanal de cera de soja con esencia de lavanda. Ideal para relajarte después de un largo día. Duración aproximada de 40 horas.',
      precio: 2500,
      imagen: 'https://images.unsplash.com/photo-1602607742877-3834785ec3e7?w=600&h=600&fit=crop',
      categoria: 'Velas',
      stock: 15
    },
    {
      id: 2,
      nombre: 'Difusor de Bambú',
      descripcion: 'Difusor con varillas de bambú natural y aceite esencial de vainilla. Perfuma tu espacio de forma continua y elegante.',
      precio: 3200,
      imagen: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop',
      categoria: 'Aromaterapia',
      stock: 8
    },
    {
      id: 3,
      nombre: 'Jabón Artesanal de Rosas',
      descripcion: 'Jabón elaborado a mano con pétalos de rosa y aceite de coco. Limpieza suave y aroma delicado para tu piel.',
      precio: 1200,
      imagen: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=600&fit=crop',
      categoria: 'Cuidado Personal',
      stock: 25
    },
    {
      id: 4,
      nombre: 'Set de Sales de Baño',
      descripcion: 'Sales minerales con lavanda, eucalipto y menta. Transformá tu baño en una experiencia spa en casa.',
      precio: 1800,
      imagen: 'https://images.unsplash.com/photo-1620756236308-65c3ef5d25f3?w=600&h=600&fit=crop',
      categoria: 'Cuidado Personal',
      stock: 12
    },
    {
      id: 5,
      nombre: 'Vela de Soja Vainilla',
      descripcion: 'Vela de cera de soja 100% natural con aroma a vainilla. Contenedor de cerámica reutilizable hecho a mano.',
      precio: 2800,
      imagen: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop',
      categoria: 'Velas',
      stock: 10
    },
    {
      id: 6,
      nombre: 'Aceite Esencial de Eucalipto',
      descripcion: 'Aceite esencial puro de eucalipto, ideal para difusores y aromaterapia. Frasco de 15 ml con gotero.',
      precio: 1500,
      imagen: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop',
      categoria: 'Aromaterapia',
      stock: 20
    }
  ];

  /* ---------- Inicializar productos en localStorage ---------- */
  function initProducts() {
    var stored = localStorage.getItem('aurablanca_products');
    if (!stored) {
      localStorage.setItem('aurablanca_products', JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(stored);
  }

  /* ---------- Obtener carrito ---------- */
  function getCart() {
    return JSON.parse(localStorage.getItem('aurablanca_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('aurablanca_cart', JSON.stringify(cart));
    updateCartCount();
  }

  /* ---------- Actualizar contador del carrito ---------- */
  function updateCartCount() {
    var cart = getCart();
    var total = cart.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
    var el = document.getElementById('cart-count');
    if (el) el.textContent = total;
  }

  function getLogo() {
    return localStorage.getItem('aurablanca_logo');
  }

  function renderLogo() {
    var logoAnchor = document.querySelector('.logo');
    if (!logoAnchor) return;
    var logo = getLogo();
    if (logo) {
      logoAnchor.innerHTML = '';
      var img = document.createElement('img');
      img.src = logo;
      img.alt = 'Aura Blanca';
      img.className = 'logo-img';
      img.onerror = function () {
        logoAnchor.textContent = 'Aura Blanca';
      };
      logoAnchor.appendChild(img);
    }
  }

  /* ---------- Toast ---------- */
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () { toast.classList.add('show'); }, 50);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2500);
  }

  /* ---------- Agregar al carrito ---------- */
  function addToCart(productId) {
    var cart = getCart();
    var existing = cart.find(function (item) { return item.id === productId; });

    if (existing) {
      existing.cantidad += 1;
    } else {
      cart.push({ id: productId, cantidad: 1 });
    }

    saveCart(cart);
    showToast('Producto agregado al carrito');
  }

  /* ---------- Renderizar productos ---------- */
  function renderProducts(products, category) {
    var grid = document.getElementById('product-grid');
    if (!grid) return;

    var filtered = category === 'todos'
      ? products
      : products.filter(function (p) { return p.categoria === category; });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:#6b6b6b;grid-column:1/-1;">No hay productos en esta categoría.</p>';
      return;
    }

    filtered.forEach(function (product) {
      var stockHtml = product.stock === 0
        ? '<div class="product-card-stock"><span class="stock-unavailable">Sin stock</span></div>'
        : '';

      var card = document.createElement('div');
      card.className = 'product-card';
      if (product.stock === 0) {
        card.classList.add('product-card-out');
      }
      card.innerHTML =
        '<img class="product-card-img" src="' + product.imagen + '" alt="' + product.nombre + '" onerror="this.style.background=\'#f5f0eb\';this.alt=\'Imagen no disponible\'">' +
        '<div class="product-card-body">' +
          '<div class="product-card-category">' + product.categoria + '</div>' +
          '<div class="product-card-name">' + product.nombre + '</div>' +
          '<div class="product-card-price">$' + product.precio.toLocaleString('es-AR') + '</div>' +
          stockHtml +
          (product.stock > 0
            ? '<button class="btn btn-primary btn-add-cart" data-id="' + product.id + '">Agregar al Carrito</button>'
            : '') +
        '</div>';

      card.querySelector('.product-card-img').addEventListener('click', function () {
        window.location.href = 'producto.html?id=' + product.id;
      });
      card.querySelector('.product-card-name').addEventListener('click', function () {
        window.location.href = 'producto.html?id=' + product.id;
      });
      card.querySelector('.product-card-name').style.cursor = 'pointer';

      if (product.stock > 0) {
        card.querySelector('.btn-add-cart').addEventListener('click', function (e) {
          e.stopPropagation();
          addToCart(product.id);
        });
      }

      grid.appendChild(card);
    });
  }

  /* ---------- Renderizar filtros ---------- */
  function renderFilters(products) {
    var filtersContainer = document.querySelector('.filters');
    if (!filtersContainer) return;

    var categories = [];
    products.forEach(function (p) {
      if (categories.indexOf(p.categoria) === -1) {
        categories.push(p.categoria);
      }
    });

    filtersContainer.innerHTML = '<button class="filter-btn active" data-category="todos">Todos</button>';
    categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.setAttribute('data-category', cat);
      btn.textContent = cat;
      filtersContainer.appendChild(btn);
    });

    filtersContainer.addEventListener('click', function (e) {
      if (!e.target.classList.contains('filter-btn')) return;
      filtersContainer.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      e.target.classList.add('active');
      renderProducts(products, e.target.getAttribute('data-category'));
    });
  }

  /* ---------- Carrusel de Novedades ---------- */
  function getNovedades() {
    return JSON.parse(localStorage.getItem('aurablanca_novedades') || '[]');
  }

  function renderCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;

    var container = carousel.querySelector('.carousel-container');
    var indicatorsContainer = carousel.querySelector('.carousel-indicators');

    var novedades = getNovedades();

    // Si no hay novedades, mostrar mensaje predeterminado
    if (novedades.length === 0) {
      container.innerHTML = `
        <div class="carousel-slide">
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+Tm92ZWRhZGVzPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZmIiBmb250LXNpemU9IjE0Ij5Qcm9udG8gZW4gQXVyYSBCbGFuY2E8L3RleHQ+Cjwvc3ZnPg==" alt="Próximamente">
        </div>
      `;
      indicatorsContainer.innerHTML = '<span class="indicator active" data-slide="0"></span>';
      initCarousel();
      return;
    }

    // Generar slides dinámicamente
    var slidesHtml = '';
    var indicatorsHtml = '';

    novedades.forEach(function (novedad, index) {
      slidesHtml += `
        <div class="carousel-slide">
          <img src="${novedad.imagen}" alt="${novedad.titulo}" data-index="${index}" class="carousel-slide-img">
          <div class="carousel-caption">
            <h3>${novedad.titulo}</h3>
            <p>${novedad.descripcion}</p>
          </div>
        </div>
      `;
      indicatorsHtml += `<span class="indicator${index === 0 ? ' active' : ''}" data-slide="${index}"></span>`;
    });

    container.innerHTML = slidesHtml;
    indicatorsContainer.innerHTML = indicatorsHtml;

    // Agregar event listeners para abrir modal
    container.querySelectorAll('.carousel-slide-img').forEach(function (img, index) {
      img.addEventListener('click', function () {
        openImageModal(novedades[index]);
      });
    });

    initCarousel();
  }

  function initCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;

    var container = carousel.querySelector('.carousel-container');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prevBtn = carousel.querySelector('.carousel-btn-prev');
    var nextBtn = carousel.querySelector('.carousel-btn-next');
    var indicators = carousel.querySelectorAll('.indicator');

    var currentSlide = 0;
    var totalSlides = slides.length;

    function updateCarousel() {
      container.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      indicators.forEach(function (ind, index) {
        ind.classList.toggle('active', index === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    function goToSlide(slideIndex) {
      currentSlide = slideIndex;
      updateCarousel();
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    indicators.forEach(function (ind, index) {
      ind.addEventListener('click', function () {
        goToSlide(index);
      });
    });

    // Auto-play
    var autoPlayInterval = setInterval(nextSlide, 4000);

    // Pause on hover
    carousel.addEventListener('mouseenter', function () {
      clearInterval(autoPlayInterval);
    });

    carousel.addEventListener('mouseleave', function () {
      autoPlayInterval = setInterval(nextSlide, 4000);
    });

    // Initialize
    updateCarousel();
  }

  /* ---------- Modal de Imágenes ---------- */
  function openImageModal(novedad) {
    var modal = document.getElementById('image-modal');
    var modalImg = document.getElementById('modal-image');
    var modalTitle = document.getElementById('modal-title');
    var modalDescription = document.getElementById('modal-description');

    modalImg.src = novedad.imagen;
    modalImg.alt = novedad.titulo;
    modalTitle.textContent = novedad.titulo;
    modalDescription.textContent = novedad.descripcion;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeImageModal() {
    var modal = document.getElementById('image-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initImageModal() {
    var modal = document.getElementById('image-modal');
    var overlay = document.getElementById('modal-overlay');
    var closeBtn = document.getElementById('modal-close');

    if (overlay) {
      overlay.addEventListener('click', closeImageModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeImageModal);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeImageModal();
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var products = initProducts();
    renderLogo();
    updateCartCount();
    renderFilters(products);
    renderProducts(products, 'todos');
    renderCarousel();
    initImageModal();
  });
})();
