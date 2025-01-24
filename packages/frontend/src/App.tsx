import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import './App.css'

interface Message {
	from: 'user' | 'bot'
	text: string
}

function App() {
	const [messages, setMessages] = useState<Array<Message>>([
		{ from: 'bot', text: "Hello, I'm CalcuBot! 👋" },
		{ from: 'bot', text: 'I can solve math problems for you.' },
		{ from: 'bot', text: 'Please enter any mathematical expression (e.g. "5 * 3") and I\'ll solve it if I can.' },
		{ from: 'bot', text: 'For a history of the last problems I solved for you (up to 10), just type "history".' },
		{ from: 'bot', text: 'To send your message, you can either press the enter key or click the "Send" button.' },
	])
	// TODO: history should be stored in backend
	const [history, setHistory] = useState<Array<string>>([])
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	const addMessage = (message: Message) => {
		setMessages(existingMessages => [...existingMessages, message])
	}

	const addToHistory = (problem: string) => {
		setHistory(existingHistory => [...existingHistory.slice(-9), problem])
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleMessage()
		}
	}

	const handleMessage = () => {
		if (!inputRef.current?.value) return
		const msg = inputRef.current.value

		addMessage({
			from: 'user',
			text: msg,
		})

		// TODO: all this should happen in the backend
		if (msg === 'history') {
			if (history.length === 0) {
				addMessage({
					from: 'bot',
					text: "It seems I haven't solved any problems for you yet.",
				})
			} else {
				addMessage({
					from: 'bot',
					text: 'Here are the last problems I solved for you:',
				})
				history.forEach(problem => {
					addMessage({
						from: 'bot',
						text: problem,
					})
				})
			}
			// TODO: improve regex
		} else if (msg.match(/^-?[0-9]+(([-+/*][0-9]+)?([.,][0-9]+)?)*?$/)) {
			// TODO: get rid of eval
			const solvedProblem = msg + ' = ' + eval(msg)
			addMessage({
				from: 'bot',
				text: solvedProblem,
			})
			addToHistory(solvedProblem)
		} else {
			addMessage({
				from: 'bot',
				text: "Sorry, I didn't get that. The the only things I understand are mathematical expressions and the command 'history'.",
			})
		}

		inputRef.current.value = ''
		inputRef.current.focus()
	}

	return (
		<>
			<h1>CalcuBot 🤖</h1>
			<div className="messages">
				{messages.map((message, index) => (
					<div key={index} className={message.from + 'Message'}>
						{message.text}
					</div>
				))}
			</div>
			<div className="inputs">
				<input type="text" ref={inputRef} onKeyDown={handleKeyDown} />
				<input type="button" value="Send" onClick={handleMessage} />
			</div>
		</>
	)
}

export default App
