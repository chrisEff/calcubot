import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import type { Message } from './types.ts'

const socket = io('ws://localhost:3000')

function App() {
	const [messages, setMessages] = useState<Array<Message>>([])
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		socket.on('bot_message', (message: string) => {
			addMessage({ from: 'bot', text: message })
		})
		return () => {
			socket.off('bot_message')
		}
	}, [socket])

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	const addMessage = (message: Message) => {
		setMessages(existingMessages => [...existingMessages, message])
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleMessage()
		}
	}

	const handleMessage = () => {
		if (!inputRef.current?.value) return

		addMessage({ from: 'user', text: inputRef.current.value })
		socket.emit('user_message', inputRef.current.value)

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
