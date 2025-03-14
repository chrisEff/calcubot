import { Tag, Tooltip } from 'antd'
import type { Properties } from 'csstype'

import type { Message as MessageType } from '../types.ts'

interface MessageProps {
	message: MessageType
}

const colors = {
	bot: 'default',
	user: 'blue',
}

const Message = ({ message }: MessageProps) => {
	const style: Properties<string | number> = {
		fontSize: '1em',
		maxWidth: '450px',
		overflowWrap: 'break-word',
		alignSelf: message.from === 'user' ? 'flex-end' : 'flex-start',
		whiteSpace: 'normal',
	}

	return (
		<Tooltip title={message.timestamp}>
			<Tag style={style} color={colors[message.from]}>
				{message.text}
			</Tag>
		</Tooltip>
	)
}

export default Message
