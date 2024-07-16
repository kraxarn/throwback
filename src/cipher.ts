export function cipher(input: string | number[]): number[] {
	return (typeof input === "string" ? input.split("") : input)
		.map(char => ({
			a: typeof char === "string" ? char.charCodeAt(0) : char,
			b: location.hostname,
		}))
		.map((obj, i) => obj.a ^ obj.b.charCodeAt(i % obj.b.length))
}