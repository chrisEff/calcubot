import evaluateExpression from '../src/evaluateExpression'

describe('evaluateExpression', () => {
	it.each([
		{ expression: '3+4', expected: 7 },
		{ expression: '45+27', expected: 72 },
		{ expression: '2268+378', expected: 2646 },
	])('should solve a simple addition: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '3-4', expected: -1 },
		{ expression: '45-27', expected: 18 },
		{ expression: '2268-378', expected: 1890 },
	])('should solve a simple subtraction: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '3*4', expected: 12 },
		{ expression: '45*27', expected: 1215 },
		{ expression: '2268*378', expected: 857304 },
	])('should solve a simple multiplication: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '3/4', expected: 0.75 },
		{ expression: '45/27', expected: 1.6666666666666667 },
		{ expression: '2268/378', expected: 6 },
	])('should solve a simple division: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '3+4*5', expected: 23 },
		{ expression: '3*4+5', expected: 17 },
	])('should multiply before adding: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '100-10/2', expected: 95 },
		{ expression: '100/10-2', expected: 8 },
	])('should divide before subtracting: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '33+4*5-10/2+8*6', expected: 96 },
		{ expression: '17*4-55+36/3+3*4', expected: 37 },
	])(
		'should solve a complex expression with various different operations correctly: $expression',
		({ expression, expected }) => {
			expect(evaluateExpression(expression)).toBe(expected)
		},
	)

	it.each([
		{ expression: '1.5+2.5', expected: 4 },
		{ expression: '1.66-0.33', expected: 1.3299999999999998 }, // We'll accept that JavaScript's precision can be a bit off sometimes ;-)
		{ expression: '3*2.5', expected: 7.5 },
		{ expression: '25/12.5', expected: 2 },
	])('should accept decimal values: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '5*(3+4)', expected: 35 },
		{ expression: '5+3*(17-2*3)+7*(3+15)/5', expected: 63.2 },
	])('should handle parenthesis: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		// Might not be mathematically 100% correct, but that's how JS calculates.
		{ expression: '1/0', expected: 'Infinity' },
	])('should handle Infinity: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '-5+2', expected: -3 },
		{ expression: '-5-2', expected: -7 },
		{ expression: '-5*2', expected: -10 },
		{ expression: '-5/2', expected: -2.5 },
		{ expression: '5*(5-7)', expected: -10 },
	])('should handle negative values: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})

	it.each([
		{ expression: '.1+.9', expected: 1 },
		{ expression: '.1-.1', expected: 0 },
		{ expression: '.1*5', expected: 0.5 },
		{ expression: '.4/.2', expected: 2 },
	])('should handle decimals written without a leading zero: $expression', ({ expression, expected }) => {
		expect(evaluateExpression(expression)).toBe(expected)
	})
})
