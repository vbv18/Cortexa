import React, { forwardRef } from "react";

type InputProps = {
    placeholder: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    type?: string,
    value?: string,
    disabled?: boolean,
    className?: string,
    autoComplete?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        placeholder,
        onChange,
        onKeyDown,
        type = "text",
        value,
        disabled,
        className = "",
        autoComplete
    }, ref) => {

        return (
            <input
                ref={ref}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
                autoComplete={autoComplete}
                className={`
                    w-full rounded-xl border
                    px-4 py-3
                    outline-none transition
                    focus:border-primary-btn-bg
                    focus:ring-2
                    focus:ring-primary-btn-bg/20
                    ${className}
                `}
            />
        )
    }
);

Input.displayName = "Input";