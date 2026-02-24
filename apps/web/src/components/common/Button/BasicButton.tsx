interface IBasicButtonProps {
  children?: React.ReactNode
  onClick?: () => void | Promise<void>
  type?: "button" | "submit" | "reset"
  className?: string
}
export default function BasicButton({
  children,
  onClick,
  type = "button",
  className = "",
}: IBasicButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}
