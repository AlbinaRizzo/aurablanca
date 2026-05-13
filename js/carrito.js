/* ========================================
   Aura Blanca — Carrito de Compras
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

  /* Hacer updateCartCount global para checkout.html */
  window.updateCartCount = updateCartCount;

  function renderCart() {
    var cart = getCart();
    var products = JSON.parse(localStorage.getItem('aurablanca_products') || '[]');
    var cartEmpty = document.getElementById('cart-empty');
    var cartContent = document.getElementById('cart-content');
    var cartItems = document.getElementById('cart-items');
    var cartTotalPrice = document.getElementById('cart-total-price');

    if (!cartItems) return;

    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    var total = 0;
    cartItems.innerHTML = '';

    cart.forEach(function (item) {
      var product = products.find(function (p) { return p.id === item.id; });
      if (!product) return;

      var subtotal = product.precio * item.cantidad;
      total += subtotal;

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' +
          '<div class="cart-item-info">' +
            '<img class="cart-item-img" src="' + product.imagen + '" alt="' + product.nombre + '" onerror="this.style.background=\'#f5f0eb\'">' +
            '<span class="cart-item-name">' + product.nombre + '</span>' +
          '</div>' +
        '</td>' +
        '<td>$' + product.precio.toLocaleString('es-AR') + '</td>' +
        '<td><input type="number" class="cart-item-qty" value="' + item.cantidad + '" min="1" max="' + product.stock + '" data-id="' + item.id + '"></td>' +
        '<td>$' + subtotal.toLocaleString('es-AR') + '</td>' +
        '<td><button class="cart-item-remove" data-id="' + item.id + '" title="Eliminar">✕</button></td>';

      cartItems.appendChild(tr);
    });

    if (cartTotalPrice) {
      cartTotalPrice.textContent = '$' + total.toLocaleString('es-AR');
    }

    /* Eventos de cantidad */
    cartItems.querySelectorAll('.cart-item-qty').forEach(function (input) {
      input.addEventListener('change', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        var newQty = parseInt(this.value, 10);
        if (newQty < 1) newQty = 1;

        var c = getCart();
        var cartItem = c.find(function (i) { return i.id === id; });
        if (cartItem) {
          cartItem.cantidad = newQty;
          saveCart(c);
          renderCart();
        }
      });
    });

    /* Eventos de eliminar */
    cartItems.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        var c = getCart().filter(function (i) { return i.id !== id; });
        saveCart(c);
        renderCart();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCart();
  });
})();
