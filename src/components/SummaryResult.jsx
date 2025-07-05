import React, { useRef } from 'react';
import { Download, Receipt, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

const SummaryResult = ({ people, taxPercent, additionalCost, results, onBack }) => {
  const summaryRef = useRef(null);
  const { t, i18n } = useTranslation();

  const downloadAsImage = async () => {
    if (!summaryRef.current) return;
    
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `split-bill-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Gagal mendownload gambar. Silakan coba lagi.');
    }
  };

  const grandTotal = results.reduce((sum, result) => sum + result.finalTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          {t('summary.title')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('summary.back')}
          </button>
          <button
            onClick={downloadAsImage}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('summary.download')}
          </button>
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div ref={summaryRef} className="p-6 space-y-6">
          {/* Header Info */}
          <div className="text-center border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('summary.result')}</h3>
            <div className="text-lg text-gray-700">
              <p className="font-semibold">{t('summary.total')}: Rp {grandTotal.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-600 mt-1">
                {t('summary.tax')}: {taxPercent}% • {t('summary.additional')}: Rp {additionalCost.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Individual Results */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {result.name || `${t('person')} ${index + 1}`}
                  </h4>
                  <span className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                    Rp {result.finalTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                
                {/* Order Details */}
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-gray-700 mb-2">{t('summary.orders')}</div>
                  {result.orders.filter(order => order.item && order.price > 0).map((order, orderIndex) => (
                    <div key={orderIndex} className="flex justify-between bg-white px-3 py-2 rounded">
                      <span className="text-gray-700">{order.item}</span>
                      <span className="font-medium">Rp {order.price.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                  
                  {/* Calculation Breakdown */}
                  <div className="border-t pt-3 mt-3 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>{t('summary.subtotal')}:</span>
                      <span>Rp {result.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>{t('summary.tax')} ({taxPercent}%):</span>
                      <span>Rp {result.tax.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-purple-600">
                      <span>{t('summary.additional')}:</span>
                      <span>Rp {result.additionalShare.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>{t('summary.total')}:</span>
                      <span className="text-blue-600">Rp {result.finalTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>{t('summary.generated')} {new Date().toLocaleDateString(i18n.language, {
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;