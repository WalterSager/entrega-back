 async function verProductos() {
    try {
      const res = await fetch("/api/sessions/current", {
        method: "GET",
        credentials: "include"
      });
      const user = await res.json();

      if (!user || !user.role) throw new Error("No se pudo obtener el usuario");

      const role = user.role.toUpperCase();

      // Redirecciona a la vista de productos según el rol
      window.location.href = `/api/products/getAll/${role}`;
    } catch (error) {
      console.error("❌ Error obteniendo el rol:", error);
      window.location.href = "/views/login";
    }
  }