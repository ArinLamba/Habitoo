// setting-row.tsx

type Props = {
  label: string
  children: React.ReactNode
}

export const SettingRow = ({
  label,
  children,
}: Props) => {
  return (
    <div className="flex bg-mber-400 border-b py-2 border-border">

      {/* LEFT */}

      <div className="flex  min-w-[120px]  bg-aber-700 items-center font-medium">
        {label}
      </div>

      {/* RIGHT */}

      <div className="flex  items-center gap-2">
        {children}
      </div>

    </div>
  )
}