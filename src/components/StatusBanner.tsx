type StatusBannerProps = {
  tone: 'warning' | 'info';
  message: string;
};

export function StatusBanner({ tone, message }: StatusBannerProps) {
  const toneClasses =
    tone === 'warning'
      ? 'border-[rgba(205,167,61,0.35)] bg-[rgba(255,248,224,0.94)] text-[#6e591c]'
      : 'border-[rgba(16,56,31,0.18)] bg-[rgba(244,249,244,0.94)] text-[#0a4123]';

  return (
    <div className={`mt-6 rounded-[18px] border px-5 py-4 text-[1rem] ${toneClasses}`}>
      {message}
    </div>
  );
}
