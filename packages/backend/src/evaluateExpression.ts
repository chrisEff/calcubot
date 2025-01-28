const evaluateExpression = (expression: string) => {
	const regex = {
		whiteSpace: /\s/g,
		decimalsWithoutLeadingZero: /(^|[^\d])\./g,
		onlyValidCharacters: /^[\d+\-*/.()]+$/,
		simpleNumber: /^-?\d+(\.\d+)?$/,
		parentheses: /\(([^()]+)\)/g,
		multiplication: /((?:(?:^|[^\d])-)?\d+(?:\.\d+)?)\*(-?\d+(?:\.\d+)?)/g,
		division: /((?:(?:^|[^\d])-)?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/g,
		subtraction: /((?:(?:^|[^\d])-)?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)/g,
		addition: /((?:(?:^|[^\d])-)?\d+(?:\.\d+)?)\+(-?\d+(?:\.\d+)?)/g,
	}

	// remove whitespaces
	expression = expression.replace(regex.whiteSpace, '')

	// sanitize decimal values that are written without a leading zero (e.g. '.9')
	expression = expression.replace(regex.decimalsWithoutLeadingZero, (match, a) => {
		return `${a}0.`
	})

	if (expression === 'Infinity') {
		return expression
	}

	if (!regex.onlyValidCharacters.test(expression)) {
		throw new Error('Invalid expression: ' + expression)
	}

	if (regex.simpleNumber.test(expression)) {
		return parseFloat(expression)
	}

	if (regex.parentheses.test(expression)) {
		return evaluateExpression(
			expression.replace(regex.parentheses, (match, innerExpression) => {
				return evaluateExpression(innerExpression).toString()
			}),
		)
	}

	if (regex.multiplication.test(expression)) {
		return evaluateExpression(
			expression.replace(regex.multiplication, (match, a, b) => {
				return (parseFloat(a) * parseFloat(b)).toString()
			}),
		)
	}

	if (regex.division.test(expression)) {
		return evaluateExpression(
			expression.replace(regex.division, (match, a, b) => {
				return (parseFloat(a) / parseFloat(b)).toString()
			}),
		)
	}

	if (regex.subtraction.test(expression)) {
		return evaluateExpression(
			expression.replace(regex.subtraction, (match, a, b) => {
				return (parseFloat(a) - parseFloat(b)).toString()
			}),
		)
	}

	if (regex.addition.test(expression)) {
		return evaluateExpression(
			expression.replace(regex.addition, (match, a, b) => {
				return (parseFloat(a) + parseFloat(b)).toString()
			}),
		)
	}

	return expression
}

export default evaluateExpression
