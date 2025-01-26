import 'dotenv/config'
import express from 'express'
import { Server } from 'socket.io'

import { MongoClient, ServerApiVersion } from 'mongodb'

import evaluateExpression from './evaluateExpression'

if (!process.env.MONGODB_URI) {
	throw new Error('MONGODB_URI not set. Please set up a valid .env file.')
}
if (!process.env.WEBSOCKET_PORT) {
	throw new Error('WEBSOCKET_PORT not set. Please set up a valid .env file.')
}

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
})
await mongoClient.connect()
const mongoPingResponse = await mongoClient.db('admin').command({ ping: 1 })
if (!mongoPingResponse.ok) {
	throw new Error('Could not connect to MongoDB. Please check your connection string.')
} else {
	console.log('Successfully connected to MongoDB.')
}

const app = express()

app.use(express.json())

const expressServer = app.listen(process.env.WEBSOCKET_PORT, () => {
	console.log('Server is running on http://localhost:' + process.env.WEBSOCKET_PORT)
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

	socket.on('user_message', async (message: string) => {
		if (message === 'history') {
			try {
				// To get the latest 10 entries, we have to query by "newest first",
				// but since we want to display them in chronological order, we then need to reverse the array.
				const history = (
					await mongoClient.db('calcubot').collection('history').find().sort({ timestamp: -1 }).limit(10).toArray()
				).reverse()

				if (history.length === 0) {
					socket.emit('bot_message', "It seems I haven't solved any problems for you yet.")
					return
				}
				socket.emit('bot_message', 'Here are the last problems I solved for you:')

				history.forEach(entry => {
					socket.emit('bot_message', entry.problem)
				})
			} catch (error) {
				socket.emit('bot_message', 'Sorry, something went wrong while fetching the history from my database.')
			}
			return
		}

		try {
			const result = evaluateExpression(message)
			const solvedProblem = `${message} = ${result}`
			socket.emit('bot_message', solvedProblem)
			try {
				mongoClient.db('calcubot').collection('history').insertOne({ problem: solvedProblem, timestamp: new Date() })
			} catch (error) {
				socket.emit(
					'bot_message',
					`Sorry, something went wrong while saving "${solvedProblem}" to my database, so it won't show up in the history.`,
				)
			}
		} catch (error) {
			socket.emit(
				'bot_message',
				`Sorry, I'm not sure what you meant by "${message}". The only things I understand are mathematical expressions and the command "history".`,
			)
		}
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})
