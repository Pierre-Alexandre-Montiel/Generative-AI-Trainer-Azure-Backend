import {OpenAiModelSettings} from './ModelSettings';

export class OpenAiCompletionRequest extends OpenAiModelSettings {
	prompt: string | string[];
}
