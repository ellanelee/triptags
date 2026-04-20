interface FormFieldProps {
  error?: string
  children: React.ReactNode
}

export function FormField({ error, children }: FormFieldProps) {
  console.log("inputErrors: ", error)
  return (
    <div className="flex flex-col">
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
