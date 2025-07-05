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
      alert(t('alert.invalidPeople'));
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
        alert(`${person.name || `${t('person')} ${i + 1}`} ${t('alert.noValidOrder')}`);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8F3F2] to-[#EDF6F9]">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-[#305268] flex items-center justify-center gap-3 animate-fade-up animate-once animate-duration-1000">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
            {t('title')}
          </h1>
          <p className="text-lg text-[#5C7483] mt-2 animate-fade-in animate-delay-500 animate-duration-1000">{t('subtitle')}</p>
          {/* 🔽 Tombol bahasa di sini */}
          <div className="flex justify-center gap-4 mt-4 animate-fade-in animate-delay-700 animate-duration-1000">
            <button
              onClick={() => i18n.changeLanguage('id')}
              className="text-sm px-4 py-2 border border-[#88A9B3] text-[#305268] rounded hover:bg-[#A3CCD0] transition"
            >
              🇮🇩 Indonesia
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className="text-sm px-4 py-2 border border-[#88A9B3] text-[#305268] rounded hover:bg-[#A3CCD0] transition"
            >
              🇬🇧 English
            </button>
          </div>
        </header>

        {/* Step 1: Number of People */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <div className="card bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('step1.title')}</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('step1.label')}
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
                className="w-full py-3 text-lg text-white rounded-md bg-[#88A9B3] hover:bg-[#305268] transition-colors flex items-center justify-center gap-2 animate-fade-up animate-delay-1000 animate-duration-1000"
              >
                <Users className="w-5 h-5" />
                {t('step1.next')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Input Orders */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{t('step2.title')}</h2>
              <button
                onClick={resetApp}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4" />
                {t('step2.reset')}
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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">{t('step2.additionalTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('step2.taxLabel')}
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
                    {t('step2.additionalLabel')}
                  </label>
                  <input
                    type="number"
                    value={additionalCost}
                    onChange={(e) => setAdditionalCost(parseFloat(e.target.value) || 0)}
                    className="w-full input-field"
                    placeholder={t('step2.placeholder')}
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
                {t('step2.calculate')}
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
    </main>

      {/* Footer */}
      <footer className="bg-[#A6A6A6] text-white text-center py-3">
        <p className="text-sm">
          {t('footer')}
        </p>
      </footer>
    </div>
  );
};

export default App;