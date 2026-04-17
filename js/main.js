// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Обновляет счётчик товаров в корзине (в шапке сайта)
 * Читает данные из localStorage и суммирует количество всех товаров
 */
function updateCartCounter() {
  // Пытаемся получить корзину из localStorage, если её нет – пустой массив []
  const cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
  
  // Считаем общее количество единиц товара (суммируем quantity каждого товара)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Находим элемент счётчика по id
  const counterElement = document.getElementById('cartCount');
  if (counterElement) {
    // Записываем полученное число в текстовое содержимое элемента
    counterElement.textContent = totalItems;
  }
}

// Вызываем обновление счётчика сразу после загрузки DOM
document.addEventListener('DOMContentLoaded', updateCartCounter);

// ========== КЛАСС СЛАЙДЕРА ==========
/**
 * Класс для создания простого слайдера
 * Принимает корневой элемент слайдера
 */
class Slider {
  constructor(element) {
    this.slider = element;                         // Сохраняем ссылку на элемент
    if (!this.slider) return;                      // Если элемента нет, выходим
    
    // Находим все слайды внутри слайдера
    this.slides = element.querySelectorAll('.slide');
    // Кнопки "назад" и "вперёд"
    this.prevBtn = element.querySelector('.slider__btn--prev');
    this.nextBtn = element.querySelector('.slider__btn--next');
    // Контейнер для точек-индикаторов
    this.dotsContainer = element.querySelector('.slider__dots');
    this.currentIndex = 0;                         // Индекс текущего слайда
    
    // Если слайды найдены, инициализируем слайдер
    if (this.slides.length > 0) {
      this.init();
    }
  }

  /**
   * Инициализация: показываем первый слайд, вешаем обработчики, создаём точки
   */
  init() {
    this.updateSlider();                           // Показываем начальный слайд
    this.prevBtn.addEventListener('click', () => this.prev()); // Обработчик кнопки "назад"
    this.nextBtn.addEventListener('click', () => this.next()); // Обработчик кнопки "вперёд"
    this.createDots();                             // Создаём точки-индикаторы
    this.startAutoPlay();                          // Запускаем автоматическую смену
  }

  /**
   * Обновляет отображение: скрывает все слайды, кроме текущего
   */
  updateSlider() {
    this.slides.forEach((slide, i) => {
      // Если индекс совпадает с текущим – показываем (display: block), иначе скрываем (none)
      slide.style.display = i === this.currentIndex ? 'block' : 'none';
    });
    this.updateDots(); // Обновляем активную точку
  }

  /**
   * Переход к следующему слайду
   */
  next() {
    // Увеличиваем индекс на 1; если вышли за границы, начинаем с 0 (благодаря %)
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlider();
  }

  /**
   * Переход к предыдущему слайду
   */
  prev() {
    // Уменьшаем индекс на 1; если стал <0, переходим на последний слайд
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();
  }

  /**
   * Создаёт точки-индикаторы по количеству слайдов
   */
  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = ''; // Очищаем контейнер
    this.slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      // При клике на точку переключаемся на соответствующий слайд
      dot.addEventListener('click', () => {
        this.currentIndex = i;
        this.updateSlider();
      });
      this.dotsContainer.appendChild(dot);
    });
  }

  /**
   * Подсвечивает активную точку (добавляет класс active)
   */
  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  /**
   * Автоматическое перелистывание слайдов с заданным интервалом
   * @param {number} interval - интервал в миллисекундах (по умолчанию 5000)
   */
  startAutoPlay(interval = 5000) {
    setInterval(() => this.next(), interval);
  }
}

// После загрузки DOM ищем слайдер и создаём его экземпляр
document.addEventListener('DOMContentLoaded', () => {
  const sliderElement = document.getElementById('mainSlider');
  if (sliderElement) {
    new Slider(sliderElement);
  }
});

// ========== ПОИСК ==========
// Простой поиск: при клике на кнопку или нажатии Enter перенаправляет в каталог с параметром search
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBtn && searchInput) {
    // Обработчик клика по кнопке поиска
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim(); // Убираем лишние пробелы
      if (query) {
        // Переходим на страницу каталога, передавая поисковый запрос в URL
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
      }
    });
    
    // Обработчик нажатия клавиши Enter в поле поиска
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchBtn.click(); // Эмулируем клик по кнопке
      }
    });
  }
});

// ========== ДЕЛЕГИРОВАНИЕ ДЛЯ КНОПОК "В КОРЗИНУ" ==========
// Обработчик клика на всём документе
document.addEventListener('click', (e) => {
  // Проверяем, был ли клик по кнопке с классом add-to-cart
  if (e.target.classList.contains('add-to-cart')) {
    // Находим ближайший родительский элемент с классом product-card
    const card = e.target.closest('.product-card');
    if (card) {
      // Извлекаем данные о товаре из data-атрибутов и содержимого карточки
      const product = {
        id: card.dataset.id,                                   // data-id
        title: card.querySelector('.product-card__title').textContent, // Название
        price: parseInt(card.dataset.price),                   // data-price (преобразуем в число)
        image: card.querySelector('.product-card__image img').src, // Путь к картинке
        quantity: 1                                            // Начальное количество
      };
      
      // Проверяем, что функция addToCart определена (из cart.js)
      if (typeof addToCart === 'function') {
        addToCart(product);       // Добавляем товар в корзину
        updateCartCounter();      // Обновляем счётчик в шапке
        
        // Визуальное подтверждение: меняем текст кнопки на 1 секунду
        e.target.textContent = 'Добавлено!';
        setTimeout(() => {
          e.target.textContent = 'В корзину';
        }, 1000);
      }
    }
  }
});