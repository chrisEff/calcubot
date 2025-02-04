import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import {
	Affix,
	Button,
	Card,
	ConfigProvider,
	Flex,
	Form,
	Input,
	Layout,
	Switch,
	Tag,
	theme,
	Tooltip,
	Typography,
} from 'antd'
import { MoonOutlined, SendOutlined, SunOutlined } from '@ant-design/icons'

import './App.css'
import io from 'socket.io-client'
import type { Message } from './types.ts'

const { Content } = Layout

const socket = io(process.env.CALCUBOT_WEBSOCKET_URL)

function App() {
	const messagesRef = useRef<HTMLDivElement>(null)
	const { defaultAlgorithm, darkAlgorithm } = theme
	const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined)
	const [messages, setMessages] = useState<Array<Message>>([])
	const [form] = Form.useForm()
	const [inputHistory, setInputHistory] = useState<Array<string> | undefined>(undefined)

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
		form.focusField('message')
	}, [])

	const scrollToBottom = () => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight
		}
	}

	useEffect(() => {
		setInputHistory(messages.filter(m => m.from === 'user').map(m => m.text))
	}, [messages])

	useEffect(() => {
		if (darkMode !== undefined) {
			window.localStorage.setItem('darkMode', JSON.stringify(darkMode))
		}
	}, [darkMode])

	const addMessage = (message: Message) => {
		message.timestamp = new Date().toLocaleTimeString()
		setMessages(existingMessages => [...existingMessages, message])
		setTimeout(scrollToBottom, 10)
	}

	const submitMessage = () => {
		const message = form.getFieldValue('message')
		if (!message) return

		addMessage({ from: 'user', text: message })

		socket.emit('user_message', message)

		form.setFieldValue('message', '')
		form.focusField('message')
	}

	const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowUp' && inputHistory !== undefined) {
			setInputHistory(current => {
				const msg = current?.pop()
				if (msg) {
					form.setFieldValue('message', msg)
				}
				return current
			})
		}
	}

	return (
		<ConfigProvider theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}>
			<Layout style={{ alignItems: 'center' }}>
				<Content>
					{darkMode !== undefined && (
						<Affix offsetTop={10} style={{ alignSelf: 'flex-end' }}>
							<Tooltip title="Toggle dark mode">
								<Flex gap="small" align="center">
									<SunOutlined style={{ color: darkMode ? '#ffffff' : '#111111' }} />
									<Switch value={darkMode} onChange={setDarkMode} />
									<MoonOutlined style={{ color: darkMode ? '#ffffff' : '#111111' }} />
								</Flex>
							</Tooltip>
						</Affix>
					)}
					<Typography.Title level={1} style={{ alignSelf: 'center' }}>
						CalcuBot 🤖
					</Typography.Title>
					<Card className="messages" ref={messagesRef}>
						<Flex gap="small" vertical>
							{messages.map((message, index) => (
								<Tag
									key={index}
									className={'message ' + message.from + 'Message'}
									color={message.from === 'user' ? 'blue' : ''}
								>
									<Tooltip title={message.timestamp}>{message.text}</Tooltip>
								</Tag>
							))}
						</Flex>
					</Card>
					<br />
					<Form form={form} onFinish={submitMessage}>
						<Flex gap="middle">
							<Form.Item className="messageInput" name="message" style={{ flexGrow: 1 }}>
								<Input type="text" allowClear onKeyUp={onKeyUp} />
							</Form.Item>
							<Tooltip title="Send">
								<Button type="primary" htmlType="submit">
									<SendOutlined />
								</Button>
							</Tooltip>
						</Flex>
					</Form>
				</Content>
			</Layout>
		</ConfigProvider>
	)
}

export default App
