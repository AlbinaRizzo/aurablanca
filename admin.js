/* ========================================
   Aura Blanca — Panel de Administración
   ======================================== */

(function () {
  'use strict';

  function getProducts() {
    return JSON.parse(localStorage.getItem('aurablanca_products') || '[]');
  }

  function saveProducts(products) {
    localStorage.setItem('aurablanca_products', JSON.stringify(products));
  }

  function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem('aurablanca_cart') || '[]');
    var total = cart.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
    var el = document.getElementById('cart-count');
    if (el) el.textContent = total;
  }

  function getLogo() {
    return localStorage.getItem('aurablanca_logo');
  }

  function saveLogo(dataUrl) {
    localStorage.setItem('aurablanca_logo', dataUrl);
  }

  /* ---------- Novedades ---------- */
  function getNovedades() {
    return JSON.parse(localStorage.getItem('aurablanca_novedades') || '[]');
  }

  function saveNovedades(novedades) {
    localStorage.setItem('aurablanca_novedades', JSON.stringify(novedades));
  }

  function renderNovedadesPreview() {
    var preview = document.getElementById('novedad-image-preview');
    var imgInput = document.getElementById('novedad-imagen');
    var previewImg = document.getElementById('novedad-preview-img');

    if (!preview || !imgInput || !previewImg) return;

    if (imgInput.files && imgInput.files[0]) {
      var file = imgInput.files[0];
      if (file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = function () {
          previewImg.src = reader.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    } else {
      preview.style.display = 'none';
    }
  }

  function renderAdminNovedades() {
    var novedades = getNovedades();
    var list = document.getElementById('admin-novedades-list');
    var countEl = document.getElementById('novedades-count');

    if (countEl) countEl.textContent = novedades.length;
    if (!list) return;

    list.innerHTML = '';

    if (novedades.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#6b6b6b;padding:24px;">No hay novedades registradas.</p>';
      return;
    }

    novedades.forEach(function (novedad) {
      var item = document.createElement('div');
      item.className = 'admin-novedad-item';
      item.innerHTML =
        '<img class="admin-novedad-img" src="' + novedad.imagen + '" alt="' + novedad.titulo + '">' +
        '<div class="admin-novedad-info">' +
          '<div class="admin-novedad-title">' + novedad.titulo + '</div>' +
          '<div class="admin-novedad-desc">' + novedad.descripcion + '</div>' +
          '<div class="admin-novedad-actions">' +
            '<button class="btn btn-secondary btn-sm btn-edit-novedad" data-id="' + novedad.id + '">Editar</button>' +
            '<button class="btn btn-danger btn-sm btn-delete-novedad" data-id="' + novedad.id + '">Eliminar</button>' +
          '</div>' +
        '</div>';
      list.appendChild(item);
    });

    /* Editar */
    list.querySelectorAll('.btn-edit-novedad').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        var novedad = getNovedades().find(function (n) { return n.id === id; });
        if (!novedad) return;

        editingNovedadId = id;
        document.getElementById('novedad-id').value = id;
        document.getElementById('novedad-titulo').value = novedad.titulo;
        document.getElementById('novedad-descripcion').value = novedad.descripcion;
        document.getElementById('novedad-imagen').value = '';
        document.getElementById('novedad-imagen').removeAttribute('required');
        document.getElementById('novedades-form-title').textContent = 'Editar Novedad';
        document.getElementById('btn-save-novedad').textContent = 'Actualizar Novedad';
        document.getElementById('btn-cancel-novedad').style.display = 'inline-block';

        // Mostrar imagen existente en preview
        if (novedad.imagen) {
          document.getElementById('novedad-preview-img').src = novedad.imagen;
          document.getElementById('novedad-image-preview').style.display = 'block';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    /* Eliminar */
    list.querySelectorAll('.btn-delete-novedad').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        if (!confirm('¿Estás segura de que querés eliminar esta novedad?')) return;

        var novedades = getNovedades().filter(function (n) { return n.id !== id; });
        saveNovedades(novedades);
        renderAdminNovedades();
        showToast('Novedad eliminada');
      });
    });
  }

  function resetNovedadForm() {
    document.getElementById('novedad-id').value = '';
    document.getElementById('novedad-titulo').value = '';
    document.getElementById('novedad-descripcion').value = '';
    document.getElementById('novedad-imagen').value = '';
    document.getElementById('novedad-imagen').setAttribute('required', 'required');
    document.getElementById('novedades-form-title').textContent = 'Agregar Novedad';
    document.getElementById('btn-save-novedad').textContent = 'Guardar Novedad';
    document.getElementById('btn-cancel-novedad').style.display = 'none';
    document.getElementById('novedad-image-preview').style.display = 'none';
    editingNovedadId = null;
  }

  function renderLogoPreview() {
    var preview = document.getElementById('logo-preview');
    if (!preview) return;
    var logo = getLogo();
    if (logo) {
      preview.innerHTML = '<img src="' + logo + '" alt="Logo de Aura Blanca">';
    } else {
      preview.innerHTML = '<p style="color:#6b6b6b;">No hay logo cargado todavía.</p>';
    }
  }

  function renderLogoInHeader() {
    var logoAnchor = document.querySelector('.logo');
    if (!logoAnchor) return;
    var logo = getLogo();
    if (logo) {
      logoAnchor.innerHTML = '<img src="' + logo + '" alt="Aura Blanca" class="logo-img">';
    } else {
      logoAnchor.textContent = 'Aura Blanca';
    }
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

  var editingId = null;
  var editingNovedadId = null;

  function resetForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('prod-nombre').value = '';
    document.getElementById('prod-precio').value = '';
    document.getElementById('prod-descripcion').value = '';
    document.getElementById('prod-imagen').value = '';
    document.getElementById('prod-categoria').value = '';
    document.getElementById('prod-stock').value = '10';
    document.getElementById('form-title').textContent = 'Agregar Producto';
    document.getElementById('btn-save').textContent = 'Guardar Producto';
    document.getElementById('btn-cancel').style.display = 'none';
    document.getElementById('product-image-preview').style.display = 'none';

    // Restaurar atributo required y texto del label
    document.getElementById('prod-imagen').setAttribute('required', 'required');
    var label = document.querySelector('label[for="prod-imagen"]');
    if (label) label.textContent = 'Imagen del Producto';

    editingId = null;
  }

  function renderAdminProducts() {
    var products = getProducts();
    var list = document.getElementById('admin-product-list');
    var countEl = document.getElementById('product-count');

    if (countEl) countEl.textContent = products.length;
    if (!list) return;

    list.innerHTML = '';

    if (products.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#6b6b6b;padding:24px;">No hay productos registrados.</p>';
      return;
    }

    products.forEach(function (product) {
      var stockText = product.stock > 0
        ? 'Stock: ' + product.stock
        : '<span class="stock-unavailable">Sin stock</span>';

      var item = document.createElement('div');
      item.className = 'admin-product-item';
      if (product.stock === 0) {
        item.classList.add('out-of-stock');
      }
      item.innerHTML =
        '<img class="admin-product-img" src="' + product.imagen + '" alt="' + product.nombre + '" onerror="this.style.background=\'#f5f0eb\'">' +
        '<div class="admin-product-info">' +
          '<div class="admin-product-name">' + product.nombre + '</div>' +
          '<div class="admin-product-meta">' + product.categoria + ' · ' + stockText + '</div>' +
        '</div>' +
        '<div class="admin-product-price">$' + product.precio.toLocaleString('es-AR') + '</div>' +
        '<div class="admin-product-actions">' +
          '<button class="btn btn-secondary btn-sm btn-edit" data-id="' + product.id + '">Editar</button>' +
          '<button class="btn btn-danger btn-sm btn-delete" data-id="' + product.id + '">Eliminar</button>' +
        '</div>';
      list.appendChild(item);
    });

    /* Editar */
    list.querySelectorAll('.btn-edit').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        var product = getProducts().find(function (p) { return p.id === id; });
        if (!product) return;

        editingId = id;
        document.getElementById('product-id').value = id;
        document.getElementById('prod-nombre').value = product.nombre;
        document.getElementById('prod-precio').value = product.precio;
        document.getElementById('prod-descripcion').value = product.descripcion;
        // No asignar valor al input file, mostrar imagen existente en preview
        document.getElementById('prod-imagen').value = '';
        document.getElementById('prod-categoria').value = product.categoria;
        document.getElementById('prod-stock').value = product.stock;
        document.getElementById('form-title').textContent = 'Editar Producto';
        document.getElementById('btn-save').textContent = 'Actualizar Producto';
        document.getElementById('btn-cancel').style.display = 'inline-block';

        // Hacer el input de imagen opcional durante edición
        document.getElementById('prod-imagen').removeAttribute('required');
        var label = document.querySelector('label[for="prod-imagen"]');
        if (label) label.textContent = 'Imagen del Producto (opcional)';

        // Mostrar imagen existente en preview
        if (product.imagen) {
          productPreviewImg.src = product.imagen;
          productImagePreview.style.display = 'block';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    /* Eliminar */
    list.querySelectorAll('.btn-delete').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        if (!confirm('¿Estás segura de que querés eliminar este producto?')) return;

        var products = getProducts().filter(function (p) { return p.id !== id; });
        saveProducts(products);
        renderAdminProducts();
        showToast('Producto eliminado');

        if (editingId === id) resetForm();
      });
    });
  }

  /* ---------- Pedidos ---------- */
  function getOrders() {
    return JSON.parse(localStorage.getItem('aurablanca_orders') || '[]');
  }

  function saveOrders(orders) {
    localStorage.setItem('aurablanca_orders', JSON.stringify(orders));
  }

  function renderOrders() {
    var orders = getOrders();
    var list = document.getElementById('admin-order-list');
    var countEl = document.getElementById('order-count');

    if (countEl) countEl.textContent = orders.length;
    if (!list) return;

    list.innerHTML = '';

    if (orders.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#6b6b6b;padding:24px;">No hay pedidos todavía.</p>';
      return;
    }

    orders.slice().reverse().forEach(function (order) {
      var itemsHtml = order.items.map(function (item) {
        return item.nombre + ' x' + item.cantidad + ' — $' + (item.precio * item.cantidad).toLocaleString('es-AR');
      }).join('<br>');

      var pagoLabel = order.pago === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo al recibir';

      var comprobanteHtml = '';
      if (order.pago === 'transferencia' && order.comprobante) {
        comprobanteHtml = '<div class="order-comprobante">' +
          '<strong>Comprobante de Pago:</strong><br>' +
          '<img src="' + order.comprobante + '" alt="Comprobante" class="comprobante-image" onclick="window.open(this.src, \'_blank\')">' +
          '</div>';
      }

      var estadoClass = '';
      if (order.estado === 'Completado') estadoClass = 'order-status-completed';
      else if (order.estado === 'Cancelado') estadoClass = 'order-status-cancelled';
      else estadoClass = 'order-status-pending';

      var item = document.createElement('div');
      item.className = 'admin-order-item';
      item.innerHTML =
        '<div class="order-header">' +
          '<div class="order-id">#' + order.id + '</div>' +
          '<div class="order-date">' + order.fecha + '</div>' +
          '<span class="order-status ' + estadoClass + '">' + order.estado + '</span>' +
        '</div>' +
        '<div class="order-body">' +
          '<div class="order-client">' +
            '<strong>' + order.cliente.nombre + '</strong><br>' +
            order.cliente.email + ' · ' + order.cliente.telefono + '<br>' +
            order.cliente.direccion + ', ' + order.cliente.ciudad + ' (' + order.cliente.cp + ')' +
          '</div>' +
          '<div class="order-items">' + itemsHtml + '</div>' +
          '<div class="order-total">$' + order.total.toLocaleString('es-AR') + '</div>' +
          comprobanteHtml +
        '</div>' +
        '<div class="order-footer">' +
          '<span class="order-payment">Pago: ' + pagoLabel + '</span>' +
          '<div class="order-actions">' +
            '<select class="order-status-select" data-id="' + order.id + '">' +
              '<option value="Pendiente"' + (order.estado === 'Pendiente' ? ' selected' : '') + '>Pendiente</option>' +
              '<option value="Completado"' + (order.estado === 'Completado' ? ' selected' : '') + '>Completado</option>' +
              '<option value="Cancelado"' + (order.estado === 'Cancelado' ? ' selected' : '') + '>Cancelado</option>' +
            '</select>' +
            '<button class="btn btn-danger btn-sm btn-delete-order" data-id="' + order.id + '">Eliminar</button>' +
          '</div>' +
        '</div>';
      list.appendChild(item);
    });

    list.querySelectorAll('.order-status-select').forEach(function (select) {
      select.addEventListener('change', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        var orders = getOrders();
        var order = orders.find(function (o) { return o.id === id; });
        if (order) {
          order.estado = this.value;
          saveOrders(orders);
          renderOrders();
          showToast('Estado del pedido actualizado');
        }
      });
    });

    list.querySelectorAll('.btn-delete-order').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        if (!confirm('¿Estás segura de que querés eliminar este pedido?')) return;
        var orders = getOrders().filter(function (o) { return o.id !== id; });
        saveOrders(orders);
        renderOrders();
        showToast('Pedido eliminado');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderAdminProducts();
    renderOrders();
    renderAdminNovedades();

    var form = document.getElementById('product-form');
    var btnCancel = document.getElementById('btn-cancel');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var imageInput = document.getElementById('prod-imagen');

      // Si estamos editando y no hay nueva imagen, usar la existente
      if (editingId !== null && (!imageInput.files || imageInput.files.length === 0)) {
        var existingProduct = getProducts().find(function (p) { return p.id === editingId; });
        if (existingProduct) {
          var products = getProducts();
          var index = products.findIndex(function (p) { return p.id === editingId; });
          if (index !== -1) {
            var productData = {
              nombre: document.getElementById('prod-nombre').value.trim(),
              precio: parseFloat(document.getElementById('prod-precio').value),
              descripcion: document.getElementById('prod-descripcion').value.trim(),
              imagen: existingProduct.imagen, // Mantener imagen existente
              categoria: document.getElementById('prod-categoria').value.trim(),
              stock: parseInt(document.getElementById('prod-stock').value, 10) || 0,
              id: editingId
            };
            products[index] = productData;
            saveProducts(products);
            resetForm();
            renderAdminProducts();
            showToast('Producto actualizado');
          }
          return;
        }
      }

      if (!imageInput.files || imageInput.files.length === 0) {
        showToast('Selecciona una imagen para el producto');
        return;
      }

      var file = imageInput.files[0];
      if (!file.type.startsWith('image/')) {
        showToast('El archivo debe ser una imagen');
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        var products = getProducts();

        var productData = {
          nombre: document.getElementById('prod-nombre').value.trim(),
          precio: parseFloat(document.getElementById('prod-precio').value),
          descripcion: document.getElementById('prod-descripcion').value.trim(),
          imagen: reader.result, // Data URL de la imagen
          categoria: document.getElementById('prod-categoria').value.trim(),
          stock: parseInt(document.getElementById('prod-stock').value, 10) || 0
        };

        if (editingId !== null) {
          var index = products.findIndex(function (p) { return p.id === editingId; });
          if (index !== -1) {
            productData.id = editingId;
            products[index] = productData;
            showToast('Producto actualizado');
          }
        } else {
          var maxId = products.reduce(function (max, p) { return p.id > max ? p.id : max; }, 0);
          productData.id = maxId + 1;
          products.push(productData);
          showToast('Producto agregado');
        }

        saveProducts(products);
        resetForm();
        renderAdminProducts();
      };
      reader.readAsDataURL(file);
    });

    btnCancel.addEventListener('click', function () {
      resetForm();
    });

    // Vista previa de imagen del producto
    var productImageInput = document.getElementById('prod-imagen');
    var productImagePreview = document.getElementById('product-image-preview');
    var productPreviewImg = document.getElementById('product-preview-img');

    if (productImageInput) {
      productImageInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          var file = this.files[0];
          if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function () {
              productPreviewImg.src = reader.result;
              productImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
          }
        } else {
          productImagePreview.style.display = 'none';
        }
      });
    }

    var logoInput = document.getElementById('logo-input');
    var btnUploadLogo = document.getElementById('btn-upload-logo');

    if (btnUploadLogo) {
      btnUploadLogo.addEventListener('click', function () {
        if (!logoInput || !logoInput.files || logoInput.files.length === 0) {
          showToast('Selecciona una imagen primero');
          return;
        }

        var file = logoInput.files[0];
        if (!file.type.startsWith('image/')) {
          showToast('El archivo debe ser una imagen');
          return;
        }

        var reader = new FileReader();
        reader.onload = function () {
          saveLogo(reader.result);
          renderLogoPreview();
          renderLogoInHeader();
          showToast('Logo guardado correctamente');
        };
        reader.readAsDataURL(file);
      });
    }

    renderLogoPreview();
    renderLogoInHeader();

    // Gestión de Novedades
    var novedadesForm = document.getElementById('novedades-form');
    var btnCancelNovedad = document.getElementById('btn-cancel-novedad');

    if (novedadesForm) {
      novedadesForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var imageInput = document.getElementById('novedad-imagen');

        // Si estamos editando y no hay nueva imagen, usar la existente
        if (editingNovedadId !== null && (!imageInput.files || imageInput.files.length === 0)) {
          var existingNovedad = getNovedades().find(function (n) { return n.id === editingNovedadId; });
          if (existingNovedad) {
            var novedades = getNovedades();
            var index = novedades.findIndex(function (n) { return n.id === editingNovedadId; });
            if (index !== -1) {
              var novedadData = {
                titulo: document.getElementById('novedad-titulo').value.trim(),
                descripcion: document.getElementById('novedad-descripcion').value.trim(),
                imagen: existingNovedad.imagen, // Mantener imagen existente
                id: editingNovedadId
              };
              novedades[index] = novedadData;
              saveNovedades(novedades);
              resetNovedadForm();
              renderAdminNovedades();
              showToast('Novedad actualizada');
            }
            return;
          }
        }

        if (!imageInput.files || imageInput.files.length === 0) {
          showToast('Selecciona una imagen para la novedad');
          return;
        }

        var file = imageInput.files[0];
        if (!file.type.startsWith('image/')) {
          showToast('El archivo debe ser una imagen');
          return;
        }

        var reader = new FileReader();
        reader.onload = function () {
          var novedades = getNovedades();

          var novedadData = {
            titulo: document.getElementById('novedad-titulo').value.trim(),
            descripcion: document.getElementById('novedad-descripcion').value.trim(),
            imagen: reader.result // Data URL de la imagen
          };

          if (editingNovedadId !== null) {
            var index = novedades.findIndex(function (n) { return n.id === editingNovedadId; });
            if (index !== -1) {
              novedadData.id = editingNovedadId;
              novedades[index] = novedadData;
              showToast('Novedad actualizada');
            }
          } else {
            var maxId = novedades.reduce(function (max, n) { return n.id > max ? n.id : max; }, 0);
            novedadData.id = maxId + 1;
            novedades.push(novedadData);
            showToast('Novedad agregada');
          }

          saveNovedades(novedades);
          resetNovedadForm();
          renderAdminNovedades();
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnCancelNovedad) {
      btnCancelNovedad.addEventListener('click', function () {
        resetNovedadForm();
      });
    }

    // Vista previa de imagen de la novedad
    var novedadImageInput = document.getElementById('novedad-imagen');
    if (novedadImageInput) {
      novedadImageInput.addEventListener('change', function () {
        renderNovedadesPreview();
      });
    }
  });
})();
