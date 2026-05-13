/* ========================================
   Aura Blanca — Detalle de Producto
   ======================================== */

(function () {
  'use strict';

  function getCart() {
    return JSON.parse(localStorage.getItem('aurablanca_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('aurablanca_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    var cart = getCart();
    var total = cart.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
    var el = document.getElementById('cart-count');
    if (el) el.textContent = total;
  }

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

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();

    var params = new URLSearchParams(window.location.search);
    var productId = parseInt(params.get('id'), 10);
    var products = JSON.parse(localStorage.getItem('aurablanca_products') || '[]');
    var product = products.find(function (p) { return p.id === productId; });
    var container = document.getElementById('product-detail');

    if (!product) {
      container.innerHTML =
        '<div style="text-align:center;padding:60px 0;">' +
          '<h2>Producto no encontrado</h2>' +
          '<p style="color:#6b6b6b;margin:12px 0 24px;">El producto que buscás no existe o fue eliminado.</p>' +
          '<a href="index.html" class="btn btn-primary">Volver a la Tienda</a>' +
        '</div>';
      return;
    }

    document.title = product.nombre + ' — Aura Blanca';

    var stockHtml = product.stock > 0
      ? '<span class="stock-available">En stock (' + product.stock + ' disponibles)</span>'
      : '<span class="stock-unavailable">Sin stock</span>';

    container.innerHTML =
      '<img class="product-detail-img" src="' + product.imagen + '" alt="' + product.nombre + '" onerror="this.style.background=\'#f5f0eb\'">' +
      '<div class="product-detail-info">' +
        '<div class="product-detail-category">' + product.categoria + '</div>' +
        '<h1>' + product.nombre + '</h1>' +
        '<div class="product-detail-price">$' + product.precio.toLocaleString('es-AR') + '</div>' +
        '<p class="product-detail-description">' + product.descripcion + '</p>' +
        '<div class="product-detail-stock">' + stockHtml + '</div>' +
        '<div class="quantity-selector">' +
          '<label for="qty">Cantidad:</label>' +
          '<input type="number" id="qty" value="1" min="1" max="' + product.stock + '">' +
        '</div>' +
        '<button class="btn btn-primary" id="btn-add-cart"' + (product.stock === 0 ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '') + '>Agregar al Carrito</button>' +
      '</div>';

    var btnAdd = document.getElementById('btn-add-cart');
    if (btnAdd && product.stock > 0) {
      btnAdd.addEventListener('click', function () {
        var qty = parseInt(document.getElementById('qty').value, 10) || 1;
        var cart = getCart();
        var existing = cart.find(function (item) { return item.id === product.id; });

        if (existing) {
          existing.cantidad += qty;
        } else {
          cart.push({ id: product.id, cantidad: qty });
        }

        saveCart(cart);
        showToast('Producto agregado al carrito');
      });
    }
  });
})();
