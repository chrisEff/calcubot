import express from 'express'

const app = express()

app.get('/solve/:problem', (req, res) => {
	res.send('Hello from the /solve endpoint')
})

app.get('/history', (req, res) => {
	res.send('Hello from the /history endpoint')
})

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000')
})
