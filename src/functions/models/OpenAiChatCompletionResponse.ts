class OpenAiChatCompletionChoice {
	message: {
		role: 'system' | 'user' | 'assistant';
		content: string;
	};
}

export class OpenAiChatCompletionResponse {
	id: string;
	model: string;
	choices: OpenAiChatCompletionChoice[];
}
