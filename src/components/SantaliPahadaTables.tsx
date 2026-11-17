import React, { useState } from 'react';
import { Calculator, Volume2, Sparkles } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

const SANTALI_NUMBERS: Record<number, { dev: string; rom: string }> = {
  1: { dev: 'मित्', rom: 'Mit' },
  2: { dev: 'बार', rom: 'Bar' },
  3: { dev: 'पे', rom: 'Pe' },
  4: { dev: 'पोन', rom: 'Pon' },
  5: { dev: 'मोड़े', rom: 'Moñṛe' },
  6: { dev: 'तुरूय', rom: 'Turuy' },
  7: { dev: 'एयाय', rom: 'Eyay' },
  8: { dev: 'ईराल', rom: 'Iral' },
  9: { dev: 'आरे', rom: 'Are' },
  10: { dev: 'गेल', rom: 'Gel' }
};

function numberToSantali(n: number): { dev: string; rom: string } {
  if (n <= 10 && SANTALI_NUMBERS[n]) return SANTALI_NUMBERS[n];
  if (n < 20) {
    const unit = n - 10;
    return {
      dev: `गेल ${SANTALI_NUMBERS[unit].dev}`,
      rom: `Gel ${SANTALI_NUMBERS[unit].rom.toLowerCase()}`
    };
  }
  const twenties = Math.floor(n / 20);
  const rem = n % 20;
  const baseDev = twenties === 1 ? 'इसी' : `${SANTALI_NUMBERS[twenties].dev} इसी`;
  const baseRom = twenties === 1 ? 'Isi' : `${SANTALI_NUMBERS[twenties].rom} isi`;
  if (rem === 0) return { dev: baseDev, rom: baseRom };
  const remObj = rem <= 10 ? SANTALI_NUMBERS[rem] : { dev: `गेल ${SANTALI_NUMBERS[rem - 10].dev}`, rom: `gel ${SANTALI_NUMBERS[rem - 10].rom.toLowerCase()}` };
  return {
    dev: `${baseDev} ${remObj.dev}`,
    rom: `${baseRom} ${remObj.rom.toLowerCase()}`
  };
}

export const SantaliPahadaTables: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number>(2);

  const rows = Array.from({ length: 10 }, (_, idx) => {
    const multiplier = idx + 1;
    const product = selectedTable * multiplier;
    const baseName = SANTALI_NUMBERS[selectedTable];
    const multName = SANTALI_NUMBERS[multiplier];
    const prodName = numberToSantali(product);
    return {
      multiplier,
      product,
      chantDev: `${baseName.dev} × ${multName.dev} = ${prodName.dev}`,
      chantRom: `${baseName.rom} × ${multName.rom} = ${prodName.rom}`,
      spoken: `${selectedTable} गुणा ${multiplier} बराबर ${product}, संताली में ${prodName.dev}`
    };
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Calculator className="w-4 h-4" />
              <span>बाल पहाड़ा व गिनती अभ्यास | Santali Pahada &amp; Counting Lab</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              संताली बाल पहाड़ा (१ से १० इसी-आधारित पहाड़ा)
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              मित्, बार, पे, पोन से लेकर इसी (२०) आधारित पारंपरिक संताली पहाड़ा और ऑडियो उच्चारण।
            </p>
          </div>
          <button
            onClick={() => {
              const allSpoken = rows.map(r => r.chantDev).join(', ');
              speakWithFemaleVoice(`${SANTALI_NUMBERS[selectedTable].dev} का पहाड़ा: ${allSpoken}`, { lang: 'hi-IN' });
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>पूरा पहाड़ा सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              onClick={() => setSelectedTable(num)}
              className={`px-3.5 py-2 text-xs font-bold border transition-all ${
                selectedTable === num
                  ? 'bg-amber-600 text-white border-amber-300'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-200'
              }`}
            >
              {num} ({SANTALI_NUMBERS[num].dev})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map(row => (
            <div
              key={row.multiplier}
              className="bg-white border border-stone-200 hover:border-amber-200 p-4 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="text-xs font-mono text-amber-700">
                  {selectedTable} × {row.multiplier} = <strong className="text-lg text-emerald-700">{row.product}</strong>
                </div>
                <div className="text-base font-bold text-amber-950 mt-1">{row.chantDev}</div>
                <div className="text-[11px] font-mono text-stone-600">{row.chantRom}</div>
              </div>
              <button
                onClick={() => speakWithFemaleVoice(row.spoken, { lang: 'hi-IN' })}
                className="p-2 bg-stone-50 border border-stone-200 text-amber-700 hover:text-amber-800"
                title="सुनें"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
