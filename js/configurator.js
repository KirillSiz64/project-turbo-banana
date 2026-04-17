// ========== КОНФИГУРАТОР ПК ==========

// Состояние выбранных компонентов
let selectedComponents = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  psu: null,
  case: null
};

// Порядок категорий для навигации
const categories = [
  { id: 'cpu', label: 'Процессор' },
  { id: 'motherboard', label: 'Материнская плата' },
  { id: 'ram', label: 'Оперативная память' },
  { id: 'gpu', label: 'Видеокарта' },
  { id: 'storage', label: 'Накопитель' },
  { id: 'psu', label: 'Блок питания' },
  { id: 'case', label: 'Корпус' }
];

let currentCategoryIndex = 0; // Индекс текущей активной категории

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryTabs();
  switchCategory(0); // Начинаем с первой категории
  updateSummary();
  attachNavEvents();
});

/**
 * Отрисовывает вкладки категорий с индикацией завершённости
 */
function renderCategoryTabs() {
  const tabsContainer = document.getElementById('categoryTabs');
  tabsContainer.innerHTML = categories.map((cat, index) => {
    const isCompleted = selectedComponents[cat.id] !== null;
    return `<button class="category-tab ${isCompleted ? 'completed' : ''}" data-category="${cat.id}" data-index="${index}">${cat.label}</button>`;
  }).join('');

  // Назначаем обработчики на вкладки
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const index = parseInt(tab.dataset.index);
      switchCategory(index);
    });
  });
}

/**
 * Переключает на указанную категорию и загружает соответствующие компоненты
 */
function switchCategory(index) {
  currentCategoryIndex = index;
  const categoryId = categories[index].id;

  // Обновляем активный класс у вкладок
  document.querySelectorAll('.category-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  // Загружаем и отображаем компоненты для выбранной категории
  renderComponentsForCategory(categoryId);

  // Управляем состоянием кнопок навигации
  const prevBtn = document.getElementById('prevCategoryBtn');
  const nextBtn = document.getElementById('nextCategoryBtn');
  prevBtn.disabled = (index === 0);
  nextBtn.disabled = (index === categories.length - 1);
}

/**
 * Отображает карточки комплектующих для заданной категории с учётом совместимости
 */
function renderComponentsForCategory(categoryId) {
  const components = componentDB[categoryId] || [];
  const container = document.getElementById('componentsList');
  
  // Фильтруем компоненты по совместимости с уже выбранными
  const compatibleComponents = filterCompatible(categoryId, components);

  if (compatibleComponents.length === 0) {
    container.innerHTML = `<p class="no-products" style="grid-column:1/-1;">Нет совместимых комплектующих. Измените выбор в других категориях.</p>`;
    return;
  }

  container.innerHTML = compatibleComponents.map(comp => {
    const isSelected = selectedComponents[categoryId] && selectedComponents[categoryId].id === comp.id;
    return `
      <div class="component-card ${isSelected ? 'selected' : ''}" data-component-id="${comp.id}" data-category="${categoryId}">
        <img src="${comp.image}" alt="${comp.name}">
        <h4>${comp.name}</h4>
        <div class="component-price">${comp.price.toLocaleString()} ₽</div>
        <div class="component-specs">
          ${getSpecsText(comp)}
        </div>
      </div>
    `;
  }).join('');

  // Добавляем обработчики выбора
  container.querySelectorAll('.component-card').forEach(card => {
    card.addEventListener('click', () => {
      const compId = card.dataset.componentId;
      const compCategory = card.dataset.category;
      const component = componentDB[compCategory].find(c => c.id === compId);
      
      // Сохраняем выбор
      selectedComponents[compCategory] = component;
      
      // Обновляем вкладки (статус завершённости)
      renderCategoryTabs();
      
      // Обновляем сводку
      updateSummary();
      
      // Перерисовываем текущую категорию (чтобы выделить выбранный)
      renderComponentsForCategory(compCategory);
      
      // Если есть следующая категория и текущая завершена, можно предложить перейти
      // (автоматически не переходим, чтобы пользователь контролировал)
    });
  });
}

/**
 * Фильтрация компонентов по совместимости с уже выбранными
 */
function filterCompatible(categoryId, components) {
  // Копируем массив
  let filtered = [...components];
  
  const cpu = selectedComponents.cpu;
  const mb = selectedComponents.motherboard;
  const ram = selectedComponents.ram;
  const gpu = selectedComponents.gpu;
  const psu = selectedComponents.psu;
  const pcCase = selectedComponents.case;

  // Правила совместимости
  switch (categoryId) {
    case 'motherboard':
      if (cpu) filtered = filtered.filter(mb => mb.socket === cpu.socket);
      break;
    case 'cpu':
      if (mb) filtered = filtered.filter(cpu => cpu.socket === mb.socket);
      break;
    case 'ram':
      if (mb) filtered = filtered.filter(ram => ram.type === mb.memoryType);
      if (cpu) filtered = filtered.filter(ram => ram.type === cpu.memoryType);
      break;
    case 'gpu':
      // Видеокарты всегда совместимы, но можно проверять TDP для БП
      break;
    case 'psu':
      // Рекомендация по мощности: сумма TDP CPU + GPU + 100 Вт запас
      let requiredPower = 0;
      if (cpu) requiredPower += cpu.tdp || 65;
      if (gpu) requiredPower += gpu.tdp || 150;
      requiredPower += 100; // запас
      filtered = filtered.filter(psu => psu.power >= requiredPower);
      break;
    case 'case':
      if (mb) filtered = filtered.filter(c => c.formFactor.includes(mb.formFactor));
      break;
    case 'storage':
      // Накопители всегда совместимы (условно)
      break;
  }

  return filtered;
}

/**
 * Возвращает строку с краткими характеристиками для отображения в карточке
 */
function getSpecsText(comp) {
  if (comp.socket) return `Сокет: ${comp.socket}`;
  if (comp.type) return `Тип: ${comp.type}`;
  if (comp.power) return `Мощность: ${comp.power} Вт`;
  if (comp.formFactor) return `Форм-фактор: ${comp.formFactor.join(', ')}`;
  if (comp.capacity) return `${comp.capacity} ГБ`;
  if (comp.tdp) return `TDP: ${comp.tdp} Вт`;
  return '';
}

/**
 * Обновляет правую панель со сводкой выбранных компонентов
 */
function updateSummary() {
  const summaryContainer = document.getElementById('summaryList');
  const totalPriceEl = document.getElementById('totalPrice');
  const addBtn = document.getElementById('addConfigToCart');
  
  let total = 0;
  let allSelected = true;
  
  let html = '';
  categories.forEach(cat => {
    const comp = selectedComponents[cat.id];
    if (comp) {
      total += comp.price;
      html += `
        <div class="summary-item">
          <img src="${comp.image}" alt="${comp.name}" class="summary-item-img">
          <div class="summary-item-info">
            <div class="summary-item-name">${comp.name}</div>
            <div class="summary-item-price">${comp.price.toLocaleString()} ₽</div>
          </div>
          <button class="summary-item-remove" data-category="${cat.id}">✕</button>
        </div>
      `;
    } else {
      allSelected = false;
      html += `
        <div class="summary-item" style="opacity:0.5;">
          <div class="summary-item-img" style="background:#eee;"></div>
          <div class="summary-item-info">
            <div class="summary-item-name">${cat.label} не выбран</div>
          </div>
        </div>
      `;
    }
  });
  
  summaryContainer.innerHTML = html;
  totalPriceEl.textContent = total.toLocaleString() + ' ₽';
  
  // Кнопка добавления в корзину активна только если все компоненты выбраны
  addBtn.disabled = !allSelected;
  
  // Обработчики удаления
  document.querySelectorAll('.summary-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = btn.dataset.category;
      selectedComponents[category] = null;
      renderCategoryTabs();
      // Если удаляем компонент из текущей категории, перерисовываем список
      if (categories[currentCategoryIndex].id === category) {
        renderComponentsForCategory(category);
      }
      updateSummary();
    });
  });
}

/**
 * Навигация: кнопки "Назад" и "Далее"
 */
function attachNavEvents() {
  document.getElementById('prevCategoryBtn').addEventListener('click', () => {
    if (currentCategoryIndex > 0) {
      switchCategory(currentCategoryIndex - 1);
    }
  });
  
  document.getElementById('nextCategoryBtn').addEventListener('click', () => {
    if (currentCategoryIndex < categories.length - 1) {
      switchCategory(currentCategoryIndex + 1);
    }
  });
}

// ========== ДОБАВЛЕНИЕ СБОРКИ В КОРЗИНУ ==========
document.getElementById('addConfigToCart').addEventListener('click', () => {
  // Проверяем, все ли компоненты выбраны
  const allSelected = Object.values(selectedComponents).every(comp => comp !== null);
  if (!allSelected) {
    alert('Выберите все компоненты для сборки!');
    return;
  }

  // Создаём объект "Сборка ПК" для добавления в корзину
  const configId = 'config_' + Date.now();
  const totalPrice = Object.values(selectedComponents).reduce((sum, comp) => sum + comp.price, 0);
  
  const configProduct = {
    id: configId,
    title: 'Сборка ПК: ' + categories.map(cat => selectedComponents[cat.id].name.split(' ').slice(0,2).join(' ')).join(', '),
    price: totalPrice,
    image: 'img/components/pc-build.jpg', // Заглушка или можно сгенерировать
    quantity: 1,
    isConfig: true,
    components: { ...selectedComponents } // Сохраняем состав для информации
  };

  // Добавляем в корзину
  if (typeof addToCart === 'function') {
    addToCart(configProduct);
    updateCartCounter();
    alert('Сборка добавлена в корзину!');
  } else {
    console.error('Функция addToCart не найдена');
  }
});