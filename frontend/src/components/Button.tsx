interface ButtonProps {
    variant: 'primary' | 'secondary',
    size: "sm" | "md" | "lg",
    text: string,
    startIcon?: any,
    endIcon?: any,
    disabled?: boolean,
    onClick: () => void
}

const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
}

const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
}

export const Button = ({
    variant = "primary",
    size = "md",
    text,
    startIcon,
    endIcon,
    disabled = false,
    onClick
}: ButtonProps) => {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center gap-2 rounded-md font-medium transition-all duration-300 transform hover:scale-102 shadow-xl
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {startIcon && <span>{startIcon}</span>}
            <span>{text}</span>
            {endIcon && <span>{endIcon}</span>}
        </button>
    )
}