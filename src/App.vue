<script setup lang="ts">
// Contrato y datos
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

const listaProductos: Producto[] = [
  {
    id: 101,
    nombre: "Teclado Mecánico RGB",
    precio: 250,
    stock: 12
  },
  {
    id: 102,
    nombre: "Mouse Óptico Inalámbrico",
    precio: 110,
    stock: 20
  }
];
</script>

<template>
  <div class="container mt-5 text-center" style="font-family: sans-serif;">
    <div class="alert alert-success shadow">
      <h1>Panel de Almacén - ITPM</h1>
      <p>Asignatura: DPW-207 | Lic. Félix Maldonado</p>
      <hr>

      <ul style="list-style: none; padding: 0;">
        <li
          v-for="p in listaProductos"
          :key="p.id"
          style="margin-bottom: 10px;"
        >
          <b>{{ p.nombre }}</b>
          - Precio: Bs. {{ p.precio }}
          | Stock: {{ p.stock }} pzas.
        </li>
      </ul>
    </div>
    <p>Vargas Meneces Rider Guido</p>
  </div>
</template>