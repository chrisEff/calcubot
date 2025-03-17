import { useEffect, useRef, useState } from 'react'
import { Affix, Card, ConfigProvider, Flex, Layout, Switch, theme, Tooltip, Typography } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import io from 'socket.io-client'

import './App.css'
import type { Message as MessageType } from './types.ts'
import ChatForm from './components/ChatForm.tsx'
import Message from './components/Message.tsx'

const { Content } = Layout

const socket = io(process.env.CALCUBOT_WEBSOCKET_URL)

const App = () => {
	const messagesRef = useRef<HTMLDivElement>(null)
	const { defaultAlgorithm, darkAlgorithm } = theme
	const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined)
	const [messages, setMessages] = useState<Array<MessageType>>([])

	useEffect(() => {
		socket.on('bot_message', (message: string) => {
			addMessage({ from: 'bot', text: message })
		})
		return () => {
			socket.off('bot_message')
		}
	}, [socket])

	useEffect(() => {
		setDarkMode(window.localStorage.getItem('darkMode') === 'true')
	}, [])

	const scrollToBottom = () => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight
		}
	}

	useEffect(() => {
		if (darkMode !== undefined) {
			window.localStorage.setItem('darkMode', JSON.stringify(darkMode))
		}
	}, [darkMode])

	const addMessage = (message: MessageType) => {
		message.timestamp = new Date().toLocaleTimeString()
		setMessages(existingMessages => [...existingMessages, message])
		setTimeout(scrollToBottom, 10)
	}

	const submitMessage = ({ message }: { message: string }) => {
		if (!message) return

		addMessage({ from: 'user', text: message })

		socket.emit('user_message', message)
	}

	return (
		<ConfigProvider theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}>
			<Layout style={{ alignItems: 'center' }}>
				<Content>
					{darkMode !== undefined && (
						<Affix offsetTop={10} style={{ alignSelf: 'flex-end' }}>
							<Tooltip title="Toggle dark mode">
								<Switch
									value={darkMode}
									onChange={setDarkMode}
									checkedChildren={<MoonOutlined />}
									unCheckedChildren={<SunOutlined style={{ color: '#111111' }} />}
								/>
							</Tooltip>
						</Affix>
					)}
					<Typography.Title level={1} style={{ alignSelf: 'center' }}>
						CalcuBot 🤖
					</Typography.Title>
					<Card className="messages" ref={messagesRef}>
						<Flex gap="small" vertical>
							{messages.map((message, index) => (
								<Message message={message} key={index} />
							))}
						</Flex>
					</Card>
					<br />
					<ChatForm onSubmit={submitMessage} messages={messages} />
				</Content>
			</Layout>
		</ConfigProvider>
	)
}

export default App
