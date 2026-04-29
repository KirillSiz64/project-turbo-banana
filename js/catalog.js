// ========== ДАННЫЕ ТОВАРОВ (имитация базы данных) ==========
// В реальном проекте эти данные загружались бы с сервера через fetch
const products = [
  {
    id: '1',
    title: 'Ноутбук Honor MagicBook X16',
    category: 'laptops',      // Категория для фильтрации
    brand: 'honor',           // Бренд для фильтрации
    price: 74990,             // Цена в рублях (число)
    rating: 4.8,              // Рейтинг от 1 до 5
    image: 'img/products/honor_magicbook_x16.png',
    inStock: true
  },
  {
    id: '2',
    title: 'Системный блок MSI Infinite S',
    category: 'desktops',
    brand: 'msi',
    price: 129990,
    rating: 4.9,
    image: 'img/products/msi_infinite_s.png',
    inStock: true
  },
  {
    id: '3',
    title: 'Монитор Acer Nitro XV272U',
    category: 'monitors',
    brand: 'acer',
    price: 35990,
    rating: 4.7,
    image: 'img/products/acer_nitro.png',
    inStock: true
  },
  {
    id: '4',
    title: 'Клавиатура Logitech G Pro',
    category: 'accessories',
    brand: 'logitech',
    price: 12990,
    rating: 4.6,
    image: 'img/products/logitech_g_pro.png',
    inStock: true
  },
  {
    id: '5',
    title: 'Ноутбук Acer Aspire 5',
    category: 'laptops',
    brand: 'acer',
    price: 59990,
    rating: 4.5,
    image: 'img/products/acer_aspire_5.png',
    inStock: true
  },
  {
    id: '6',
    title: 'Игровой ПК MSI Trident',
    category: 'desktops',
    brand: 'msi',
    price: 189990,
    rating: 5.0,
    image: 'img/products/msi_trident.png',
    inStock: true
  }
];

// ========== ФУНКЦИИ ДЛЯ КАТАЛОГА ==========

/**
 * Применяет фильтры (категория, цена, бренд) и сортировку к массиву товаров,
 * затем отрисовывает результат.
 */
function filterProducts() {
  // Начинаем с копии всего массива товаров (чтобы не изменять оригинал)
  let filtered = [...products];
  
  // 1. ФИЛЬТР ПО КАТЕГОРИИ (radio)
  const categoryRadio = document.querySelector('input[name="category"]:checked');
  if (categoryRadio && categoryRadio.value !== 'all') {
    filtered = filtered.filter(p => p.category === categoryRadio.value);
  }
  
  // 2. ФИЛЬТР ПО ЦЕНЕ (диапазон)
  const min = parseFloat(document.getElementById('priceMin').value) || 0;
  const max = parseFloat(document.getElementById('priceMax').value) || Infinity;
  filtered = filtered.filter(p => p.price >= min && p.price <= max);
  
  // 3. ФИЛЬТР ПО БРЕНДАМ (checkbox)
  // Получаем массив значений отмеченных чекбоксов
  const checkedBrands = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);
  if (checkedBrands.length > 0) {
    filtered = filtered.filter(p => checkedBrands.includes(p.brand));
  }
  
  // 4. СОРТИРОВКА
  const sortValue = document.getElementById('sortSelect').value;
  switch (sortValue) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    // default: без сортировки
  }
  
  // Отрисовываем отфильтрованный массив
  renderProductGrid(filtered);
}

/**
 * Отрисовывает сетку товаров в контейнере #productsGrid
 * @param {Array} items - массив товаров для отображения
 */
function renderProductGrid(items) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  // Если товаров нет, показываем сообщение
  if (items.length === 0) {
    grid.innerHTML = '<p class="no-products" style="grid-column:1/-1; text-align:center; padding:40px;">Товары не найдены</p>';
    return;
  }
  
  // Генерируем HTML для каждой карточки товара
  grid.innerHTML = items.map(p => `
    <article class="product-card" data-id="${p.id}" data-price="${p.price}" data-category="${p.category}">
      <div class="product-card__image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <!-- Если рейтинг >= 4.8, добавляем метку "Хит" -->
        ${p.rating >= 4.8 ? '<span class="product-badge product-badge--hit">Хит</span>' : ''}
      </div>
      <div class="product-card__content">
        <h3 class="product-card__title">${p.title}</h3>
        <div class="product-card__rating">
          <!-- Генерируем звёзды: ★ для заполненных, ☆ для пустых -->
          <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
          <span class="rating-value">${p.rating}</span>
        </div>
        <div class="product-card__price">${p.price.toLocaleString()} ₽</div>
        <div class="product-card__actions">
          <button class="btn btn--primary add-to-cart">В корзину</button>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Сбрасывает все фильтры к значениям по умолчанию и показывает все товары
 */
function resetFilters() {
  // Выбираем радио "Все товары"
  document.querySelectorAll('input[name="category"]').forEach(r => r.checked = (r.value === 'all'));
  // Очищаем поля цены
  document.getElementById('priceMin').value = '';
  document.getElementById('priceMax').value = '';
  // Снимаем все чекбоксы брендов
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  // Сортировка по умолчанию
  document.getElementById('sortSelect').value = 'default';
  // Отрисовываем все товары
  renderProductGrid(products);
}

// ========== ОБРАБОТЧИК ПАРАМЕТРОВ URL ПРИ ЗАГРУЗКЕ ==========
// Позволяет при переходе по ссылке ?search=... или ?category=... сразу применить фильтр
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const categoryParam = urlParams.get('category');
  
  if (searchQuery) {
    // Если есть поисковый запрос, фильтруем по названию (без учёта регистра)
    const filtered = products.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    renderProductGrid(filtered);
    // Заполняем поле поиска в шапке этим запросом
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = searchQuery;
  } else if (categoryParam) {
    // Если указана категория в URL, выбираем соответствующую радиокнопку и применяем фильтры
    const radio = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
    if (radio) {
      radio.checked = true;
      filterProducts();
    } else {
      renderProductGrid(products);
    }
  } else {
    // Если нет параметров, просто показываем все товары
    renderProductGrid(products);
  }
});