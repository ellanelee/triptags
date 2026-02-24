export interface IBasicButtonProps {
  children?: React.ReactNode
  onClick?: () => void | Promise<void>
  type?: "button" | "submit" | "reset"
  className?: string
}

export interface LanguageSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  tr: (key: string) => string // 언어변역
}