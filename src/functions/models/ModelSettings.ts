export class OpenAiModelSettings {
	// The maximum number of tokens to generate in the completion
		max_tokens: number;

	// What sampling temperature to use, between 0 and 2
		temperature: number;

	// An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass
		top_p: number;

	// How many completions to generate for each prompt
		n: number;

	// Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics
		presence_penalty: number;

	// Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim
		frequency_penalty: number;
}