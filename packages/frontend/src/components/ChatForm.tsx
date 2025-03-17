import { Button, Flex, Form, Input, Tooltip } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { KeyboardEvent, useEffect, useState } from 'react'
import type { Message as MessageType } from '../types.ts'

interface ChatFormProps {
	onSubmit: (values: { message: string }) => void
	messages: Array<MessageType>
}

const ChatForm = ({ onSubmit, messages }: ChatFormProps) => {
	const [form] = Form.useForm()
	const [inputHistory, setInputHistory] = useState<Array<string> | undefined>(undefined)

	useEffect(() => {
		form.focusField('message')
	}, [])

	useEffect(() => {
		setInputHistory(messages.filter(m => m.from === 'user').map(m => m.text))
	}, [messages])

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

	const onFinish = (data: { message: string }) => {
		onSubmit(data)
		form.setFieldValue('message', '')
		form.focusField('message')
	}

	return (
		<Form form={form} onFinish={onFinish}>
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
	)
}

export default ChatForm
