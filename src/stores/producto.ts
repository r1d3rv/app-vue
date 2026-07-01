import { ref, computed } from "vue";
import { defineStore } from "pinia";

// 1. Interfaz de TypeScript "Producto"
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

// 2. Store "useProductoStore" en formato Setup Store
export const useProductoStore = defineStore("producto", () => {
  // 3. Estado: lista reactiva de productos
  const productos = ref<Producto[]>([
    { id: 101, nombre: "Teclado Mecánico RGB", precio: 250, stock: 12 },
    { id: 102, nombre: "Mouse Óptico Inalámbrico", precio: 110, stock: 20 },
    { id: 103, nombre: "Monitor Gamer 24' 144Hz", precio: 1450, stock: 5 },
  ]);

  // 4. Getter: valor total del inventario (precio * stock, sumado)
  const valorTotalInventario = computed<number>(() =>
    productos.value.reduce((total, p) => total + p.precio * p.stock, 0),
  );

  // 5. Acción: agregarProducto
  function agregarProducto(producto: Producto): void {
    productos.value.push(producto);
  }

  return {
    productos,
    valorTotalInventario,
    agregarProducto,
  };
});
