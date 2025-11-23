interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'admin';
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = "w-full py-2 px-4 rounded-md font-medium";
  
  const variants = {
    primary: 'bg-[var(--primary)] hover:bg-blue-700 text-white',
    secondary: 'bg-[var(--secondary)] hover:bg-red-700 text-white',
    admin: 'bg-purple-600 hover:bg-purple-700 text-white' 
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}