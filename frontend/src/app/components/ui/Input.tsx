interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[var(--foreground)] mb-1">{label}</label>
      <input
        className="w-full px-3 py-2 border border-[var(--accent)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        {...props}
      />
    </div>
  );
}