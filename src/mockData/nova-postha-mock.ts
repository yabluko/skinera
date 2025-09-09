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
    description: 'Оплата замовлення готівкою при отриманні',
  },
  {
    id: 'bank-card',
    label: 'Visa/MasterCard',
    value: 'bank-card',
    description: 'Оплата банківською картою онлайн',
  },
  {
    id: 'bank-transfer',
    label: 'Банківський розрахунок',
    value: 'bank-transfer',
    description: 'Оплата через банківський переказ',
  },
  {
    id: 'credit',
    label: 'Кредит',
    value: 'credit',
    description: 'Оформлення кредиту на покупку',
  },
  {
    id: 'installment',
    label: 'Оплата частинами',
    value: 'installment',
    description: 'Розстрочка платежу',
  },
];
