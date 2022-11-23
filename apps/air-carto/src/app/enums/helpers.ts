export function getEnumKeyByValue<TEnum>(
	enumType: TEnum,
	value: string
): string | undefined {
	/**
	 * Get the key of an enum by its value
	 */
	return Object.keys(enumType).find((key) => enumType[key] === value);
}
