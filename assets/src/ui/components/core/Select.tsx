type SelectProps = {
	id?: string
	name?: string
	value: string
	disabled?: boolean
	options: string[]
	placeholder: string
	onChange: (value: string) => void
}

export function Select({
	id,
	name,
	value,
	disabled = false,
	options,
	placeholder,
	onChange,
}: SelectProps) {
	return (
		<select
			id={id}
			name={name}
			value={value}
			disabled={disabled}
			onChange={(event) => onChange(event.target.value)}
		>
			<option value="">{placeholder}</option>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	)
}
