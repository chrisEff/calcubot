import express from 'express'
import { Server } from 'socket.io'

const app = express()

const PORT = 3000

app.use(express.json())

// TODO: history should be stored in DB
let history: string[] = []

const expressServer = app.listen(PORT, () => {
	console.log('Server is running on http://localhost:' + PORT)
})

const io = new Server(expressServer, {
	cors: {
		origin: '*',
	},
})

io.on('connection', socket => {
	console.log('a user connected')
	socket.emit('bot_message', 'Hello, I am CalcuBot! 👋')
	socket.emit('bot_message', 'I can solve math problems for you.')
	socket.emit('bot_message', 'Please enter any mathematical expression (e.g. "5 * 3") and I\'ll solve it if I can.')
	socket.emit('bot_message', 'For a history of the last problems I solved for you (up to 10), just type "history".')
	socket.emit('bot_message', 'To send your message, you can either press the enter key or click the "Send" button.')

	socket.on('user_message', (message: string) => {
		if (message === 'history') {
			if (history.length === 0) {
				socket.emit('bot_message', "It seems I haven't solved any problems for you yet.")
				return
			}
			socket.emit('bot_message', 'Here are the last problems I solved for you:')
			history.forEach(solvedProblem => {
				socket.emit('bot_message', solvedProblem)
			})
			return
		}

		// TODO: improve regex
		if (message.match(/^-?[0-9]+(([-+/*][0-9]+)?([.,][0-9]+)?)*?$/)) {
			// TODO: get rid of eval
			const solvedProblem = message + ' = ' + eval(message)
			history = [...history.slice(-9), solvedProblem]
			socket.emit('bot_message', solvedProblem)
			return
		}

		socket.emit(
			'bot_message',
			`Sorry, I'm not sure what you meant by "${message}". The only things I understand are mathematical expressions and the command "history".`,
		)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})
