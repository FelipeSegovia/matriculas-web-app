import type { InputHTMLAttributes } from "react";

export function Checkbox({ className = "", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <input
      type="checkbox"
      className={`size-6 shrink-0 cursor-pointer appearance-none rounded-[8px_8px_8px_2px] border-2 border-line bg-field transition-colors checked:border-school checked:bg-school checked:bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='white'%20stroke-width='3.5'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='M5.5%2012.5%2010%2017l8.5-9.5'/%3E%3C/svg%3E")] bg-size-[16px] bg-center bg-no-repeat disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
