import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const PersonInput = ({ personIndex, person, onUpdatePerson }) => {
  const { t } = useTranslation();
  
  const addOrderItem = () => {
    const newOrders = [...person.orders, { item: '', price: 0 }];
    onUpdatePerson(personIndex, { ...person, orders: newOrders });
  };

  const updateOrderItem = (orderIndex, field, value) => {
    const newOrders = person.orders.map((order, idx) => 
      idx === orderIndex ? { ...order, [field]: value } : order
    );
    onUpdatePerson(personIndex, { ...person, orders: newOrders });
  };

  const removeOrderItem = (orderIndex) => {
    if (person.orders.length > 1) {
      const newOrders = person.orders.filter((_, idx) => idx !== orderIndex);
      onUpdatePerson(personIndex, { ...person, orders: newOrders });
    }
  };

  const updateName = (name) => {
    onUpdatePerson(personIndex, { ...person, name });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-blue-600 mr-2" />
        <input
          type="text"
          placeholder={`${t('namePlaceholder')} ${personIndex + 1}`}
          value={person.name}
          onChange={(e) => updateName(e.target.value)}
          className="font-semibold text-lg bg-transparent border-b-2 border-blue-200 focus:border-blue-500 outline-none px-2 py-1 w-full"
        />
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Pesanan:</label>
        {person.orders.map((order, orderIndex) => (
          <div key={orderIndex} className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start sm:items-center">
            <input
              type="text"
              placeholder={t('orderPlaceholder')}
              value={order.item}
              onChange={(e) => updateOrderItem(orderIndex, 'item', e.target.value)}
              className="w-full sm:flex-1 input-field text-sm"
            />
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={order.price || ''}
                onChange={(e) => updateOrderItem(orderIndex, 'price', parseFloat(e.target.value) || 0)}
                className="w-full sm:w-28 input-field text-sm pl-8"
              />
            </div>
            <button
              onClick={() => removeOrderItem(orderIndex)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors self-end sm:self-auto"
              disabled={person.orders.length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <button
          onClick={addOrderItem}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('addOrder')}
        </button>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-gray-800">
            Rp {person.orders.reduce((sum, order) => sum + (order.price || 0), 0).toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
