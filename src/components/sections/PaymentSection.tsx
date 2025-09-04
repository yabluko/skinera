import React from 'react';

const PaymentSection = () => {
  return (
    <div className="flex flex-col gap-8 pr-3 w-[50%]">
      <div className="relative border-b border-[#ebebeb]">
        {/* <div className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 bg-arrow-down bg-contain bg-center bg-no-repeat pointer-events-none" /> */}
        <label
          htmlFor="telephone"
          className="block text-gray-400 pointer-events-none transition-all duration-200
                            peer-focus:-top-6 peer-focus:text-[13px]
                            -top-6 left-0 text-[13px]"
        >
          Час доставки*
        </label>
        <select
          name="delivery-option"
          className="w-full border-none focus:ring-0 appearance-none bg-transparent pr-10"
        >
          <option value="ukr-post">СБ 19.07 з 09:00 до 18:00</option>
          <option value="meest-post">Meest Пошта (Самовивіз)</option>
          <option value="newpost-pickUp">Нова пошта (Самовивіз)</option>
          <option value="newpost-postMachine">Нова пошта (Поштомат)</option>
        </select>
      </div>
      <div className="relative border-b border-[#ebebeb] border-0">
        <div className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 bg-arrow-down bg-contain bg-center bg-no-repeat pointer-events-none" />
        <label
          htmlFor="telephone"
          className="block text-gray-400 pointer-events-none transition-all duration-200
                            peer-focus:-top-6 peer-focus:text-[13px]
                            -top-6 left-0 text-[13px]"
        >
          Варінати оплати*
        </label>
        <select
          name="payment-option"
          className="w-full border-none focus:ring-0 appearance-none bg-transparent pr-10"
        >
          <option value="bank-card">Оплата банківською картою</option>
          <option value="cash-on-delivery">Післяплата</option>
        </select>
      </div>
    </div>
  );
};

export default PaymentSection;
