const steps = ["Busca", "Disponibilidade", "Seus dados", "Confirmação"];

export function BookingSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="mx-auto mb-10 flex max-w-2xl items-center justify-between">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
                  active
                    ? "border-dourado bg-dourado text-carvao"
                    : done
                      ? "border-dourado text-dourado"
                      : "border-carvao/30 text-carvao/40"
                }`}
              >
                {n}
              </span>
              <span
                className={`mt-2 text-center text-xs ${active ? "text-bordo" : "text-carvao/50"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${done ? "bg-dourado" : "bg-carvao/20"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
