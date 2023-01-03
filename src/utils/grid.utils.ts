export function createGrid(x: number, y: number): number[][] {
	return new Array<number[]>(x).fill(new Array<number>(x).fill(0));
}