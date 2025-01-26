import { useEffect, useState } from 'react'
import { Button, ConfigProvider, Flex, Form, Input, theme, Typography } from 'antd'

import './App.css'
import io from 'socket.io-client'
import type { Message } from './types.ts'

const socket = io(process.env.CALCUBOT_WEBSOCKET_URL)

function App() {
	const { defaultAlgorithm } = theme
	const [messages, setMessages] = useState<Array<Message>>([])
	const [form] = Form.useForm()

	useEffect(() => {
		socket.on('bot_message', (message: string) => {
			addMessage({ from: 'bot', text: message })
		})
		return () => {
			socket.off('bot_message')
		}
	}, [socket])

	useEffect(() => {
		form.focusField('message')
	}, [])

	const addMessage = (message: Message) => {
		setMessages(existingMessages => [...existingMessages, message])
	}

	const submitMessage = () => {
		const message = form.getFieldValue('message')
		if (!message) return

		addMessage({ from: 'user', text: message })
		socket.emit('user_message', message)

		form.setFieldValue('message', '')
		form.focusField('message')
	}

	return (
		<ConfigProvider theme={{ algorithm: defaultAlgorithm }}>
			<Typography.Title level={1}>CalcuBot 🤖</Typography.Title>
			<Flex className="messages" gap="small" vertical>
				{messages.map((message, index) => (
					<div key={index} className={message.from + 'Message'}>
						<Typography.Text>{message.text}</Typography.Text>
					</div>
				))}
			</Flex>
			<br />
			<Form form={form} onFinish={submitMessage}>
				<Flex gap="middle">
					<Form.Item className="messageInput" name="message" style={{ flexGrow: 1 }}>
						<Input type="text" allowClear />
					</Form.Item>
					<Button type="primary" htmlType="submit">
						Send
					</Button>
				</Flex>
			</Form>
		</ConfigProvider>
	)
}

export default App
