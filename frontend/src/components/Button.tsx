interface ButtonProps {
    variant?: 'primary' | 'secondary',
    size?: "sm" | "md" | "lg",
    text: string,
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    disabled?: boolean,
    onClick: () => void
}

const variantStyles = {
    primary: 'bg-primary-btn-bg text-white',
    secondary: 'bg-secondary-btn-bg text-secondary-btn-txt',
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
                flex items-center gap-2 rounded-md font-medium transition-all duration-300
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer transform hover:scale-105 hover:shadow-xl active:scale-95'
                }
            `}
        >
            {startIcon && <span>{startIcon}</span>}

            <span>{text}</span>

            {endIcon && <span>{endIcon}</span>}
        </button>
    )
}