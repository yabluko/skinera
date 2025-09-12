export const favCities: string[] = [
  'Київ',
  'Харків',
  'Одеса',
  'Дніпро',
  'Запоріжжя',
  'Львів',
  'Кривий Ріг',
  'Миколаїв',
  'Івано-Франківськ',
  'Вінниця',
  'Рівне',
];

export const payment_options = [
  {
    id: 'cash-on-delivery',
    label: 'Готівкою при отриманні',
    value: 'cash-on-delivery',
    description: 'Обраний варіант оплати замовлення "Готівкою при отриманні"',
    shortLabel: 'Готівка',
  },
  {
    id: 'bank-card',
    label: 'Visa/MasterCard',
    value: 'bank-card',
    description: 'Оплата банківською картою онлайн',
    shortLabel: 'Visa/MasterCard',
  },
  {
    id: 'bank-transfer',
    label: 'Безготівковий розрахунок',
    value: 'bank-transfer',
    description: 'Оплата через банківський переказ',
    shortLabel: 'Безготівковий розрахунок',
  },
];
