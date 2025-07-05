import React, { useState } from 'react';
import { Users, Calculator, RotateCcw } from 'lucide-react';
import PersonInput from './components/PersonInput';
import SummaryResult from './components/SummaryResult';
import { useTranslation } from 'react-i18next';


const App = () => {
  const [step, setStep] = useState(1);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [people, setPeople] = useState([]);
  const [taxPercent, setTaxPercent] = useState(10);
  const [additionalCost, setAdditionalCost] = useState(0);
  const [results, setResults] = useState([]);
  const { t, i18n } = useTranslation();


  const initializePeople = () => {
    if (numberOfPeople < 1 || numberOfPeople > 20) {
      alert('Jumlah orang harus antara 1-20');
      return;
    }
    
    const newPeople = Array.from({ length: numberOfPeople }, (_, index) => ({
      name: '',
      orders: [{ item: '', price: 0 }]
    }));
    setPeople(newPeople);
    setStep(2);
  };

  const updatePerson = (index, updatedPerson) => {
    const newPeople = people.map((person, idx) => 
      idx === index ? updatedPerson : person
    );
    setPeople(newPeople);
  };

  const validateInputs = () => {
    for (let i = 0; i < people.length; i++) {
      const person = people[i];
      const hasValidOrders = person.orders.some(order => order.item && order.price > 0);
      
      if (!hasValidOrders) {
        alert(`${person.name || `Orang ${i + 1}`} belum memiliki pesanan yang valid`);
        return false;
      }
    }
    return true;
  };

  const calculateSplit = () => {
    if (!validateInputs()) return;
    
    const calculatedResults = people.map(person => {
      const validOrders = person.orders.filter(order => order.item && order.price > 0);
      const subtotal = validOrders.reduce((sum, order) => sum + order.price, 0);
      const tax = subtotal * (taxPercent / 100);
      const additionalShare = additionalCost / people.length;
      const finalTotal = subtotal + tax + additionalShare;

      return {
        name: person.name,
        orders: validOrders,
        subtotal,
        tax,
        additionalShare,
        finalTotal
      };
    });

    setResults(calculatedResults);
    setStep(3);
  };

  const resetApp = () => {
    setStep(1);
    setPeople([]);
    setResults([]);
    setNumberOfPeople(2);
    setTaxPercent(10);
    setAdditionalCost(0);
  };

  const backToInput = () => {
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
            {t('title')}
          </h1>
          <p className="text-gray-600">{t('subtitle')}Bagi tagihan restoran dengan mudah dan akurat</p>
          {/* 🔽 Tombol bahasa di sini */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => i18n.changeLanguage('id')}
              className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
            >
              🇮🇩 Indonesia
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
            >
              🇬🇧 English
            </button>
          </div>
        </header>

        {/* Step 1: Number of People */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 text-center">Berapa Orang?</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Orang (1-20)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                  className="w-full input-field text-center text-lg"
                />
              </div>
              <button
                onClick={initializePeople}
                className="w-full btn-primary text-lg py-3 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Input Orders */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Input Pesanan</h2>
              <button
                onClick={resetApp}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4" />
                Mulai Ulang
              </button>
            </div>

            {/* Person Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {people.map((person, index) => (
                <PersonInput
                  key={index}
                  personIndex={index}
                  person={person}
                  onUpdatePerson={updatePerson}
                />
              ))}
            </div>

            {/* Additional Costs */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Biaya Tambahan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pajak Restoran (%)
                  </label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-full input-field"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Tambahan (Rp)
                  </label>
                  <input
                    type="number"
                    value={additionalCost}
                    onChange={(e) => setAdditionalCost(parseFloat(e.target.value) || 0)}
                    className="w-full input-field"
                    placeholder="Service charge, parkir, dll"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <button
                onClick={calculateSplit}
                className="bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mx-auto text-lg"
              >
                <Calculator className="w-5 h-5" />
                Hitung Split Bill
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <SummaryResult
            people={people}
            taxPercent={taxPercent}
            additionalCost={additionalCost}
            results={results}
            onBack={backToInput}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p className="text-sm">
          Split Bill App - Made with ❤️ using React + Vite + TailwindCSS
        </p>
      </footer>
    </div>
  );
};

export default App;