import { useId, useState } from "react";

import { cn } from "../../utils/cn";

interface InputProps 
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    mask?: string;
    type?: string;
    error?: string;
    placeholder?: string;
    label?: string;
    className?: string;
    onChange?: (value: string) => void;
}


function Input({
    error,
    mask,
    label,
    type = "text",
    placeholder,
    className,
    onChange,
    ...props
}: InputProps) {
    const [maskedValue, setMaskedValue] = useState("");
    const generatedId = useId();
    const inputId = props.id ?? generatedId;
    const errorId = `${inputId}-error`;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = mask? applyMask(event.target.value, mask) : event.target.value;
        
        setMaskedValue(value);
        onChange?.(value)
    }

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                placeholder={placeholder}
                aria-invalid={!!error || undefined}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                    "w-full min-h-11 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-base text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors duration-150 hover:border-zinc-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30",
                    !!error && "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/30",
                    className
                )}
                value={mask ? maskedValue : props.value}
                onChange={handleChange}
                {...props}
            />

            {error && <span id={errorId} role="alert" className="text-sm text-red-400">{error}</span>}
        </div>
    )
}

function applyMask(value: string, mask: string): string {
  const cleanValue = value.replace(/\D/g, '');
  let result = '';
  let j = 0;

  for (let i = 0; i < mask.length && j < cleanValue.length; i++) {
    if (mask[i] === '9') {
      result += cleanValue[j++];
    } else {
      result += mask[i];
    }
  }

  return result;
}

export default Input