class OpenAiCompletionChoice {
	text: string;
}

export class OpenAiCompletionResponse {
	id: string;
	model: string;
	choices: OpenAiCompletionChoice[];
}
