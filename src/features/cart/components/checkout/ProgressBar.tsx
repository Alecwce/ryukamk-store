type Step = 'DATA' | 'PAYMENT' | 'SUCCESS';

interface ProgressBarProps {
  currentStep: Step;
}

const STEPS = [
  { key: 'DATA' as const, label: 'Datos' },
  { key: 'PAYMENT' as const, label: 'Pago' },
  { key: 'SUCCESS' as const, label: 'Listo' },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 -z-10" />
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
            currentStep === s.key ? 'bg-dragon-fire text-dragon-white' : 
            (i === 0 && currentStep !== 'DATA') || (i === 1 && currentStep === 'SUCCESS') ? 'bg-dragon-cyan text-dragon-white' : 'bg-dragon-black border-2 border-white/10 text-white/40'
          }`}>
            {i + 1}
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep === s.key ? 'text-dragon-fire' : 'text-white/40'}`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
