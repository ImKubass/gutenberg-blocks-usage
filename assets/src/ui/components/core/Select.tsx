import type { ComponentType } from "react"
import type { Option } from "slim-select/react"
import SlimSelectReact from "slim-select/react"

type SlimSelectValue = string | string[]

type SlimSelectProps = {
	data: Partial<Option>[]
	value?: SlimSelectValue
	onChange?: (value: SlimSelectValue) => void
	settings?: {
		disabled?: boolean
		showSearch?: boolean
		searchPlaceholder?: string
		placeholderText?: string
		allowDeselect?: boolean
	}
}

const SlimSelect = SlimSelectReact as unknown as ComponentType<SlimSelectProps>

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
	const data: Partial<Option>[] = options.map((option) => ({
		text: option,
		value: option,
	}))

	const handleChange = (nextValue: SlimSelectValue) => {
		const normalizedValue = Array.isArray(nextValue)
			? (nextValue[0] ?? "")
			: nextValue

		onChange(normalizedValue)
	}

	const slimSelectKey = `gbu-select-${disabled ? "disabled" : "enabled"}`

	return (
		<div className="gbu-select-field">
			{name ? (
				<input
					type="hidden"
					id={id}
					name={name}
					value={value}
					disabled={disabled}
				/>
			) : null}

			<SlimSelect
				key={slimSelectKey}
				data={data}
				value={value}
				onChange={handleChange}
				settings={{
					showSearch: true,
					searchPlaceholder: placeholder,
					placeholderText: placeholder,
				}}
			/>
		</div>
	)
}
