type Operator = '+' | '-' | '*' | '/'
type OperatorFunction = (a: number, b: number) => number

const operators: { [key in Operator]: OperatorFunction } = {
	'+': (a, b) => a + b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
}

function evaluateExpression(expression: string): number {
	const tokens = expression.match(/(\d+(\.\d+)*|\+|\-|\*|\/)/g)
	if (!tokens) throw new Error('Invalid expression')

	const stack: number[] = []
	const operatorStack: Operator[] = []

	tokens.forEach(token => {
		if (/\d/.test(token)) {
			stack.push(parseFloat(token))
		} else if (token in operators) {
			while (
				operatorStack.length &&
				precedence(operatorStack[operatorStack.length - 1]) >= precedence(token as Operator)
			) {
				const operator = operatorStack.pop()!
				const operatorFunc: OperatorFunction = operators[operator]
				const b = stack.pop()!
				const a = stack.pop()!
				stack.push(operatorFunc(a, b))
			}
			operatorStack.push(token as Operator)
		}
	})

	while (operatorStack.length) {
		const operator = operatorStack.pop()!
		const b = stack.pop()!
		const a = stack.pop()!
		stack.push(operators[operator](a, b))
	}

	return stack[0]
}

function precedence(operator: string): number {
	switch (operator) {
		case '+':
		case '-':
			return 1
		case '*':
		case '/':
			return 2
		default:
			return 0
	}
}

export default evaluateExpression
