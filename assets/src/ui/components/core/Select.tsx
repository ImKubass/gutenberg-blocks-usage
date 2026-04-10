import type { ChangeEvent } from "react"

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
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className="gbu-select-field">
			<select
				id={id}
				name={name}
				className="gbu-native-select"
				value={value}
				disabled={disabled}
				onChange={handleChange}
			>
				<option value="" disabled>
					{placeholder}
				</option>

				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}
