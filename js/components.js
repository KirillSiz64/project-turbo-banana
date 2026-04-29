// ========== ДАННЫЕ КОМПЛЕКТУЮЩИХ ДЛЯ КОНФИГУРАТОРА ==========

// Процессоры
const cpus = [
  {
    id: 'cpu1',
    name: 'Intel Core i5-12400F',
    category: 'cpu',
    socket: 'LGA1700',        // Сокет, должен совпадать с материнской платой
    price: 18990,
    image: 'img/components/cpu1.png',
    tdp: 65,                  // Тепловыделение (для рекомендации блока питания)
    memoryType: 'DDR4'        // Поддерживаемый тип памяти (для фильтра ОЗУ)
  },
  {
    id: 'cpu2',
    name: 'AMD Ryzen 5 5600X',
    category: 'cpu',
    socket: 'AM4',
    price: 17990,
    image: 'img/components/cpu2.jpg',
    tdp: 65,
    memoryType: 'DDR4'
  },
  {
    id: 'cpu3',
    name: 'Intel Core i7-13700K',
    category: 'cpu',
    socket: 'LGA1700',
    price: 35990,
    image: 'img/components/cpu1.png',
    tdp: 125,
    memoryType: 'DDR5'
  }
];

// Материнские платы
const motherboards = [
  {
    id: 'mb1',
    name: 'MSI B660M-A DDR4',
    category: 'motherboard',
    socket: 'LGA1700',
    memoryType: 'DDR4',
    maxMemory: 128,
    formFactor: 'Micro-ATX',
    price: 12990,
    image: 'img/components/mb1.jpg'
  },
  {
    id: 'mb2',
    name: 'ASUS TUF GAMING B550-PLUS',
    category: 'motherboard',
    socket: 'AM4',
    memoryType: 'DDR4',
    maxMemory: 128,
    formFactor: 'ATX',
    price: 14990,
    image: 'img/components/mb2.jpg'
  },
  {
    id: 'mb3',
    name: 'GIGABYTE Z790 UD DDR5',
    category: 'motherboard',
    socket: 'LGA1700',
    memoryType: 'DDR5',
    maxMemory: 192,
    formFactor: 'ATX',
    price: 18990,
    image: 'img/components/mb3.jpg'
  }
];

// Оперативная память
const rams = [
  {
    id: 'ram1',
    name: 'Kingston Fury Beast 16GB (2x8GB) DDR4',
    category: 'ram',
    type: 'DDR4',
    size: 16,
    price: 5990,
    image: 'img/components/ram1.jpg'
  },
  {
    id: 'ram2',
    name: 'Corsair Vengeance 32GB (2x16GB) DDR4',
    category: 'ram',
    type: 'DDR4',
    size: 32,
    price: 10990,
    image: 'img/components/ram2.jpg'
  },
  {
    id: 'ram3',
    name: 'Kingston Fury Beast 32GB (2x16GB) DDR5',
    category: 'ram',
    type: 'DDR5',
    size: 32,
    price: 14990,
    image: 'img/components/ram1.jpg'
  }
];

// Видеокарты
const gpus = [
  {
    id: 'gpu1',
    name: 'NVIDIA GeForce RTX 4060',
    category: 'gpu',
    price: 32990,
    tdp: 115,
    image: 'img/components/gpu1.jpg'
  },
  {
    id: 'gpu2',
    name: 'AMD Radeon RX 7600',
    category: 'gpu',
    price: 29990,
    tdp: 165,
    image: 'img/components/gpu1.jpg'
  },
  {
    id: 'gpu3',
    name: 'NVIDIA GeForce RTX 4070 Ti',
    category: 'gpu',
    price: 79990,
    tdp: 285,
    image: 'img/components/gpu1.jpg'
  }
];

// Накопители (SSD)
const storages = [
  {
    id: 'ssd1',
    name: 'Samsung 980 1TB NVMe M.2',
    category: 'storage',
    type: 'NVMe',
    capacity: 1024,
    price: 8990,
    image: 'img/components/ssd1.jpg'
  },
  {
    id: 'ssd2',
    name: 'Kingston KC3000 2TB NVMe M.2',
    category: 'storage',
    type: 'NVMe',
    capacity: 2048,
    price: 15990,
    image: 'img/components/ssd2.jpg'
  }
];

// Блоки питания
const psus = [
  {
    id: 'psu1',
    name: 'DeepCool PF600 600W',
    category: 'psu',
    power: 600,
    price: 4990,
    image: 'img/components/psu1.jpg'
  },
  {
    id: 'psu2',
    name: 'Corsair RM750e 750W',
    category: 'psu',
    power: 750,
    price: 8990,
    image: 'img/components/psu2.jpg'
  },
  {
    id: 'psu3',
    name: 'be quiet! Straight Power 11 850W',
    category: 'psu',
    power: 850,
    price: 13990,
    image: 'img/components/psu3.png'
  }
];

// Корпуса
const cases = [
  {
    id: 'case1',
    name: 'Zalman T7 ATX',
    category: 'case',
    formFactor: ['ATX', 'Micro-ATX', 'Mini-ITX'],
    price: 3990,
    image: 'img/components/case1.jpg'
  },
  {
    id: 'case2',
    name: 'Corsair 4000D Airflow ATX',
    category: 'case',
    formFactor: ['ATX', 'Micro-ATX', 'Mini-ITX'],
    price: 8990,
    image: 'img/components/case2.jpg'
  }
];

// Объединяем все категории в один объект для удобства
const componentDB = {
  cpu: cpus,
  motherboard: motherboards,
  ram: rams,
  gpu: gpus,
  storage: storages,
  psu: psus,
  case: cases
};