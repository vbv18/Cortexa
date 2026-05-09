interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'tetriary',
    size?: "sm" | "md" | "lg",
    text?: string,
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    disabled?: boolean,
    onClick: () => void
}

const variantStyles = {
    primary: 'bg-primary-btn-bg text-white',
    secondary: 'bg-secondary-btn-bg text-secondary-btn-txt',
    tetriary: 'text-gray-500 hover:text-gray-700',
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
                flex items-center gap-2 rounded-md font-medium 
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : variant !== "tetriary"
                        ? 'transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95'
                        : 'cursor-pointer'
                }
            `}
        >
            {startIcon && <span>{startIcon}</span>}
            {text && <span>{text}</span>}
            {endIcon && <span>{endIcon}</span>}
        </button>
    )
}