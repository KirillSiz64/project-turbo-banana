// ========== МОДУЛЬ УПРАВЛЕНИЯ КОРЗИНОЙ ==========

// Ключ для хранения данных в localStorage
const CART_KEY = 'techstore_cart';

/**
 * Получает текущую корзину из localStorage
 * @returns {Array} Массив товаров в корзине
 */
function getCart() {
  // Парсим JSON из localStorage; если данных нет – возвращаем пустой массив
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Сохраняет корзину в localStorage и обновляет счётчик в шапке
 * @param {Array} cart - массив товаров
 */
function saveCart(cart) {
  // Преобразуем массив в строку и сохраняем
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  
  // Если глобальная функция обновления счётчика существует – вызываем её
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
  }
}

/**
 * Добавляет товар в корзину
 * @param {Object} product - объект товара (обязательные поля: id, title, price, image)
 */
function addToCart(product) {
  const cart = getCart();
  
  // Проверяем, есть ли уже такой товар в корзине (по id)
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    // Если товар уже есть – увеличиваем его количество
    existingItem.quantity += 1;
  } else {
    // Если товара нет – добавляем новый объект с количеством 1
    cart.push({
      ...product,      // копируем все переданные свойства товара
      quantity: 1      // добавляем начальное количество
    });
  }
  
  // Сохраняем обновлённую корзину
  saveCart(cart);
}

/**
 * Удаляет товар из корзины по его идентификатору
 * @param {string} productId - id товара
 */
function removeFromCart(productId) {
  // Оставляем только те товары, id которых НЕ равен переданному
  const updatedCart = getCart().filter(item => item.id !== productId);
  saveCart(updatedCart);
}

/**
 * Изменяет количество конкретного товара на величину delta (+1 или -1)
 * @param {string} productId - id товара
 * @param {number} delta - положительное или отрицательное число
 */
function changeQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    // Увеличиваем количество, но не позволяем ему стать меньше 1
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(cart);
  }
}

/**
 * Полностью очищает корзину
 */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  // Обновляем счётчик в шапке
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
  }
}

/**
 * Вычисляет общую стоимость всех товаров в корзине
 * @returns {number} Сумма в рублях
 */
function getCartTotal() {
  const cart = getCart();
  // Суммируем price * quantity для каждого товара
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ========== РЕНДЕРИНГ СТРАНИЦЫ КОРЗИНЫ ==========

/**
 * Отображает товары в корзине на странице cart.html
 */
function renderCart() {
  const cart = getCart();
  
  // Получаем ссылки на DOM-элементы
  const container = document.getElementById('cartItemsContainer'); // tbody таблицы
  const emptyMsg = document.getElementById('cartEmptyMessage');     // Сообщение о пустой корзине
  const content = document.getElementById('cartContent');           // Основной блок с таблицей
  
  // Если контейнер не найден (мы не на странице корзины) – выходим
  if (!container) return;
  
  // Если корзина пуста – показываем сообщение и скрываем таблицу
  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    content.style.display = 'none';
    return;
  }
  
  // Если в корзине есть товары – скрываем сообщение и показываем таблицу
  emptyMsg.style.display = 'none';
  content.style.display = 'block';
  
  // Генерируем HTML-строки для каждой позиции в корзине
  container.innerHTML = cart.map(item => `
    <tr>
      <!-- Колонка с информацией о товаре (изображение + название) -->
      <td class="cart-item-info">
        <img src="${item.image}" alt="${item.title}">
        <span>
          ${item.title}
          ${item.isConfig ? '<br><small style="color:#666; font-weight:normal;">(Сборка ПК)</small>' : ''}
        </span>
      </td>
      
      <!-- Цена за единицу товара -->
      <td>${item.price.toLocaleString()} ₽</td>
      
      <!-- Управление количеством -->
      <td>
        <div class="quantity-control">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </td>
      
      <!-- Стоимость позиции (цена × количество) -->
      <td>${(item.price * item.quantity).toLocaleString()} ₽</td>
      
      <!-- Кнопка удаления товара -->
      <td>
        <button class="remove-btn" data-id="${item.id}">✕</button>
      </td>
    </tr>
  `).join(''); // Преобразуем массив строк в одну строку без разделителей
  
  // Обновляем итоговую сумму
  document.getElementById('cartTotalAmount').textContent = getCartTotal().toLocaleString() + ' ₽';
}

/**
 * Подключает обработчики событий для кнопок внутри таблицы корзины
 * Важно: вызывается один раз при загрузке страницы, а не внутри renderCart(),
 * чтобы обработчики не дублировались после каждой перерисовки корзины.
 */
function attachCartEvents() {
  const container = document.getElementById('cartItemsContainer'); // tbody таблицы
  
  // Если контейнер не найден (мы не на странице корзины) – выходим
  if (!container) return;
  
  // === Делегирование событий для кнопок в таблице ===
  container.addEventListener('click', (e) => {
    // Если клик был по кнопке изменения количества
    if (e.target.classList.contains('qty-btn')) {
      const id = e.target.dataset.id;
      const delta = parseInt(e.target.dataset.delta);
      changeQuantity(id, delta);
      renderCart(); // Перерисовываем корзину после изменения
    }
    
    // Если клик был по кнопке удаления
    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.dataset.id;
      removeFromCart(id);
      renderCart(); // Перерисовываем после удаления
    }
  });
}

// После загрузки DOM отрисовываем корзину и один раз подключаем обработчики
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  attachCartEvents();
});