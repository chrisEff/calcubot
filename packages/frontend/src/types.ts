export interface Message {
	from: 'user' | 'bot'
	text: string
	timestamp?: string
}
