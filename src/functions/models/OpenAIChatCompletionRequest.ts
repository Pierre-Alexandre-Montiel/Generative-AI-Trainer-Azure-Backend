import {OpenAiModelSettings} from './ModelSettings';

export type OpenAiChatCompletionPrompt = Array<{
	role: 'system' | 'user' | 'assistant';
	content: string;
}>;

export class OpenAiChatCompletionRequest extends OpenAiModelSettings {
	messages: OpenAiChatCompletionPrompt;
}
