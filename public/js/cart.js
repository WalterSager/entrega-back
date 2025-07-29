const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    let CURRENT_CART_ID = null;

    async function getMyCart() {
      const res = await fetch("/api/carts/my-cart", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (data.result !== "ok") throw new Error(data.message || "No se pudo obtener el carrito");
      return data.payload;
    }

    async function openCartModal() {
      try {
        const carrito = await getMyCart();
        CURRENT_CART_ID = carrito._id;
        await actualizarVistaCarrito();
        cartModal.show();
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }

    function closeCartModal() {
      cartModal.hide();
    }

    async function agregarAlCarrito(productId) {
      try {
        if (!CURRENT_CART_ID) {
          const carrito = await getMyCart();
          CURRENT_CART_ID = carrito._id;
        }

        const res = await fetch(`/api/carts/addToCart/${CURRENT_CART_ID}/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        const data = await res.json();
        if (data.result === "ok") {
          Swal.fire("Agregado", "Producto agregado al carrito", "success");
          actualizarVistaCarrito();
        } else {
          Swal.fire("Error", data.message || "Error desconocido", "error");
        }
      } catch (error) {
        console.error("Error en agregarAlCarrito:", error);
        Swal.fire("Error", error.message || "No se pudo agregar al carrito", "error");
      }
    }

    async function actualizarVistaCarrito() {
      try {
        const data = await getMyCart();
        const productos = data.products;
        const contenedor = document.getElementById("lista-carrito");
        contenedor.innerHTML = "";

        let total = 0;
        productos.forEach((p) => {
          const item = document.createElement("li");
          item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
          item.innerHTML = `
            ${p.title} - $${p.price} x ${p.quantity}
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${p.num})">X</button>
          `;
          contenedor.appendChild(item);
          total += p.price * p.quantity;
        });

        document.getElementById("totalCarrito").innerText = `Total: $${total.toFixed(2)}`;
      } catch (error) {
        console.error("Error al cargar carrito:", error);
        Swal.fire("Error", error.message || "No se pudo cargar el carrito", "error");
      }
    }

    async function eliminarDelCarrito(productNum) {
      try {
        const carrito = await getMyCart();
        const cartId = carrito._id;

        const res = await fetch(`/api/carts/id/${cartId}/product/num/${productNum}`, {
          method: "DELETE",
          credentials: "include"
        });

        const data = await res.json();

        if (data.result === "ok") {
          await actualizarVistaCarrito();
          Swal.fire("Eliminado", "Producto eliminado del carrito.", "success");
        } else {
          Swal.fire("Error", data.message || "No se pudo eliminar del carrito.", "error");
        }
      } catch (err) {
        console.error("Error al eliminar del carrito:", err);
        Swal.fire("Error", err.message || "Ocurrió un error al eliminar del carrito.", "error");
      }
    }

    async function finalizarCompra() {
      try {
        if (!CURRENT_CART_ID) throw new Error("No hay carrito activo");

        const res = await fetch(`/api/carts/${CURRENT_CART_ID}/checkout`, {
          method: "POST",
          credentials: "include"
        });

        const data = await res.json();

        if (data.status === "success") {
          closeCartModal();
          Swal.fire({
            icon: "success",
            title: "Compra finalizada",
            html: `
              <p>¡Gracias por tu compra!</p>
              <p><strong>Código:</strong> ${data.ticket.code}</p>
              <p><strong>Total:</strong> $${data.ticket.amount}</p>
              <p><strong>Comprador:</strong> ${data.ticket.purchaser}</p>
            `
          });
        } else {
          throw new Error(data.message || "No se pudo completar la compra");
        }
      } catch (err) {
        console.error("❌ Error en finalizarCompra:", err);
        Swal.fire("Error", err.message || "No se pudo finalizar la compra", "error");
      }
    }

    function goHome() {
      window.location.href = "/";
    }