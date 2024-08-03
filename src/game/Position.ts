export type Position = "top" | "bottom" | "left" | "right"

const positions: Position[][] = [
	["bottom"],
	["bottom", "top"],
	["bottom", "left", "top"],
	["bottom", "left", "top", "right"],
]

export const getPosition = (length: number, index: number): Position => {
	return positions[length - 1][index]
}