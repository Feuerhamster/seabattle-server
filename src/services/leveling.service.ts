// Constants used to define the progression (arithmetic sequence)
const steps = 100; // common difference
const base = 0; // initial term

// quartic binomial theorem of base and steps
const binomialQuartic = (4 * Math.pow(base, 2) - 4 * base * steps + Math.pow(steps, 2));

/**
 * Arithmetic sequence/progression
 * @param n n-th term of the sequence
 * @param a initial term
 * @param d common difference
 * @returns value of the n-th term
 */
function arithmetic(n: number, a: number, d: number) {
	// https://en.wikipedia.org/wiki/Arithmetic_progression
	return a + (n -1) * d;
}

/**
 * Implementation of the arithmetic sequence for our level progression.
 * Calculate the additional xp needed on top to reach provided level using arithmetic progression.
 * @param level Player level
 * @returns The additional xp needed on top to reach provided level
 */
export function xpDiffRequirement(level: number) {
	return arithmetic(level, base, steps);
}

/**
 * Calculate the minimum total player xp needed to reach the provided level
 * @param level Player level
 * @returns Minimum total player xp needed to reach the level
 */
export function minTotalXPForLevel(level: number) {
	// https://en.wikipedia.org/wiki/Arithmetic_progression#Sum
	return (level * (xpDiffRequirement(1) + xpDiffRequirement(level))) / 2;
}

/**
 * Get the player level by total player xp
 * @param total Total player xp
 * @returns Player level
 */
export function levelByTotal(total: number): number {
	return (Math.sqrt(binomialQuartic + 8 * steps * total) - 2 * base + steps) / (2 * steps);
}

/**
 * Calculate level stats by total xp
 * @param total Total player xp
 * @returns progress calculation result
 */
export function calculateLevelProgress(total: number) {
	const sum = levelByTotal(total);

	const currentLevel = Math.floor(sum);
	const nextLevel = currentLevel + 1;

	const progressPercentage = Math.floor((sum % 1) * 100);
	const remainingXP = minTotalXPForLevel(nextLevel) - total;

	return { currentLevel, nextLevel, progressPercentage, remainingXP }
}
