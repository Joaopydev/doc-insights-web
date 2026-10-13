import { useState } from "react";

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

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = mask? applyMask(event.target.value, mask) : event.target.value;
        
        setMaskedValue(value);
        onChange?.(value)
    }

    return (
        <div className="gap-4 w-full">
            {label && (
                <label className="text-base text-zinc-400">
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={cn(
                    "w-full px-3 py-2 rounded-lg bg-black/20 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors focus:border-indigo-400",
                    !!error && "border-red-500 focus:border-red-500",
                    className
                )}
                value={mask ? maskedValue : props.value}
                onChange={handleChange}
                {...props}
            />

            {error && <span className="text-sm text-red-500">{error}</span>}
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