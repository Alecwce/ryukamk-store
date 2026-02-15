import clsx from 'clsx';

export function ScrollNeonBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className={clsx(
          "absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-dragon-fire/5 rounded-full blur-[120px]",
          "animate-aura-slow will-change-transform"
        )}
      />
      <div
        className={clsx(
          "absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-dragon-cyan/5 rounded-full blur-[100px]",
          "animate-aura-reverse will-change-transform"
        )}
      />
      <div
        className={clsx(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dragon-gold/[0.02] rounded-full blur-[150px]",
          "animate-pulse-slow will-change-transform"
        )}
      />
    </div>
  );
}

