<script setup lang="ts">
import { ref, computed } from "vue";

// 1. CONTRATOS DE TIPADO (TypeScript Estricto)
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
}

// 2. ESTADO REACTIVO
const isAuthenticated = ref<boolean>(false);
const username = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");
const showPassword = ref<boolean>(false);

// Animación de feedback al modificar stock
const stockAnimating = ref<Record<number, "up" | "down" | null>>({});

// 3. DATOS DEL ALMACÉN (reactivo para que Vue detecte cambios)
const listaProductos = ref<Producto[]>([
  {
    id: 101,
    nombre: "Teclado Mecánico RGB",
    precio: 250,
    stock: 12,
    imagen:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 102,
    nombre: "Mouse Óptico Inalámbrico",
    precio: 110,
    stock: 20,
    imagen:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 103,
    nombre: "Monitor Gamer 24' 144Hz",
    precio: 1450,
    stock: 5,
    imagen:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400",
  },
]);

// 4. LÓGICA DE CONTROL DE ACCESO
const handleLogin = (): void => {
  if (username.value === "felix.maldonado" && password.value === "itpm2026") {
    isAuthenticated.value = true;
    errorMessage.value = "";
  } else {
    errorMessage.value = "Credenciales incorrectas. Intente de nuevo.";
  }
};

const handleLogout = (): void => {
  isAuthenticated.value = false;
  username.value = "";
  password.value = "";
};

// 5. LÓGICA DE GESTIÓN DE STOCK
const incrementarStock = (id: number): void => {
  const producto = listaProductos.value.find((p) => p.id === id);
  if (producto) {
    producto.stock += 1;
    triggerAnimation(id, "up");
  }
};

const decrementarStock = (id: number): void => {
  const producto = listaProductos.value.find((p) => p.id === id);
  if (producto && producto.stock > 0) {
    producto.stock -= 1;
    triggerAnimation(id, "down");
  }
};

// 6. PRECIO TOTAL REACTIVO
const precioTotal = computed<number>(() =>
  listaProductos.value.reduce((total, p) => total + p.precio * p.stock, 0),
);

// Animación visual de feedback
const triggerAnimation = (id: number, direction: "up" | "down"): void => {
  stockAnimating.value[id] = direction;
  setTimeout(() => {
    stockAnimating.value[id] = null;
  }, 500);
};

// Badge de estado según nivel de stock
const getStockStatus = (stock: number): { label: string; cls: string } => {
  if (stock === 0) return { label: "Sin stock", cls: "badge-danger" };
  if (stock <= 5) return { label: "Bajo", cls: "badge-warning" };
  return { label: "Disponible", cls: "badge-success" };
};
</script>

<template>
  <!-- LOGIN -->
  <div v-if="!isAuthenticated" class="login-bg">
    <div class="login-card">
      <!-- Logo / Header -->
      <div class="login-header">
        <div class="login-logo">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40"
              height="40"
              rx="10"
              fill="rgba(255,255,255,0.15)"
            />
            <path
              d="M10 20L20 10L30 20L20 30L10 20Z"
              fill="white"
              opacity="0.9"
            />
            <circle cx="20" cy="20" r="4" fill="white" />
          </svg>
        </div>
        <h2 class="login-title">Sistema de Gestión</h2>
        <p class="login-subtitle">ITPM · DPW-207</p>
      </div>

      <!-- Form -->
      <div class="login-body">
        <form @submit.prevent="handleLogin">
          <div class="field-group">
            <label class="field-label">Usuario Docente</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z"
                  />
                </svg>
              </span>
              <input
                v-model="username"
                type="text"
                class="field-input"
                placeholder="felix.maldonado"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-pw"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="!showPassword"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg v-else viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="error-alert">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-login">
            Ingresar al Sistema
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- DASHBOARD -->
  <div v-else class="dashboard-bg">
    <!-- Header -->
    <header class="dash-header">
      <div class="dash-header-inner">
        <div class="dash-brand">
          <div class="dash-logo">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="40"
                height="40"
                rx="10"
                fill="rgba(255,255,255,0.2)"
              />
              <path
                d="M10 20L20 10L30 20L20 30L10 20Z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="20" cy="20" r="4" fill="white" />
            </svg>
          </div>
          <div>
            <h1 class="dash-title">Panel de Almacén</h1>
            <p class="dash-meta">Control de Inventarios · ITPM</p>
          </div>
        </div>
        <div class="dash-user">
          <span class="user-chip">Lic. Félix Maldonado</span>
          <button @click="handleLogout" class="btn-logout">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>

    <!-- Stats strip -->
    <div class="stats-strip">
      <div class="stat-pill">
        <span class="stat-num">{{ listaProductos.length }}</span>
        <span class="stat-lbl">Productos</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-pill">
        <span class="stat-num">{{
          listaProductos.reduce((a, p) => a + p.stock, 0)
        }}</span>
        <span class="stat-lbl">Unidades totales</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-pill">
        <span class="stat-num">{{
          listaProductos.filter((p) => p.stock === 0).length
        }}</span>
        <span class="stat-lbl">Sin stock</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-pill total-pill">
        <span class="stat-lbl">Valor total almacén</span>
        <span class="stat-num total-num">
          <span class="total-currency">Bs.</span>
          {{ precioTotal.toLocaleString() }}
        </span>
      </div>
    </div>

    <!-- Products Grid -->
    <main class="products-grid">
      <div
        v-for="p in listaProductos"
        :key="p.id"
        class="product-card"
        :class="{ 'out-of-stock': p.stock === 0 }"
      >
        <!-- Image -->
        <div class="card-img-wrap">
          <img :src="p.imagen" :alt="p.nombre" class="card-img" />
          <div class="card-img-overlay">
            <span :class="['stock-badge', getStockStatus(p.stock).cls]">
              {{ getStockStatus(p.stock).label }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="card-content">
          <p class="card-id">ID · {{ p.id }}</p>
          <h3 class="card-name">{{ p.nombre }}</h3>
          <div class="card-price">
            <span class="price-currency">Bs.</span>
            <span class="price-amount">{{ p.precio.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Stock control -->
        <div class="stock-control">
          <span class="stock-label">Stock actual</span>
          <div class="stock-row">
            <button
              class="stock-btn decrement"
              @click="decrementarStock(p.id)"
              :disabled="p.stock === 0"
              :title="p.stock === 0 ? 'Stock en cero' : 'Restar una unidad'"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <span
              class="stock-value"
              :class="{
                'anim-up': stockAnimating[p.id] === 'up',
                'anim-down': stockAnimating[p.id] === 'down',
                zero: p.stock === 0,
              }"
            >
              {{ p.stock }}
            </span>

            <button
              class="stock-btn increment"
              @click="incrementarStock(p.id)"
              title="Agregar una unidad"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div class="stock-bar-wrap">
            <div
              class="stock-bar"
              :style="{ width: Math.min((p.stock / 25) * 100, 100) + '%' }"
              :class="{
                'bar-low': p.stock <= 5 && p.stock > 0,
                'bar-empty': p.stock === 0,
              }"
            ></div>
          </div>
        </div>
      </div>
    </main>
    <!-- Footer -->
    <footer class="dash-footer">
      <span class="footer-year">2026</span>
      <span class="footer-divider">·</span>
      <span class="footer-brand">RiderVargas</span>
      <span class="footer-divider">–</span>
      <span class="footer-inst">ITPM</span>
    </footer>
  </div>
  <!-- cierra dashboard-bg -->
</template>