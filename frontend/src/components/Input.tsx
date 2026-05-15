type InputProps = {
    placeholder: string
}

export function Input({ placeholder }: InputProps) {

    return (
        <input
            placeholder={placeholder}
            type={"text"}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-purple-500"
        />
    )
}