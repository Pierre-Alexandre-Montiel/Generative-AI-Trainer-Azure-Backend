import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import {type OpenAiChatCompletionRequest} from './models/OpenAIChatCompletionRequest';
import {type OpenAiChatCompletionResponse} from './models/OpenAiChatCompletionResponse';
import {type OpenAiModelSettings} from './models/ModelSettings';
import {
	type OpenAiChatCompletionPrompt,
} from './models/OpenAIChatCompletionRequest';
import {conv} from "./StartTraining"
import { jsonResult } from "./Utils/functions";

//const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = '2023-03-15-preview';
const apiKey = process.env.AZURE_OPENAI_API_KEY;
//const embeddingsDeployment = process.env.AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT!;
//const embeddingsModel = process.env.AZURE_OPENAI_EMBEDDINGS_MODEL!;
const headers = {
	'api-key': apiKey,
	'Content-Type': 'application/json',
};

const chatcomp = 'chat';
const model = {
	temperature: 0.2,
	n: 1,
	max_tokens: 150,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0,
};

export const createChatCompletion = async (messages: OpenAiChatCompletionPrompt, deployment: string, model: OpenAiModelSettings): Promise<OpenAiChatCompletionResponse> => {
	const createCompletionConfiguration: OpenAiChatCompletionRequest = {...model, messages};
	const response = await fetch(`${endpoint}openai/deployments/${chatcomp}/chat/completions?api-version=${apiVersion}`, {
		headers,
		body: JSON.stringify(createCompletionConfiguration),
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`Completion request failed ${JSON.stringify(await response.json())}`);
	}

	const completion = await response.json() as OpenAiChatCompletionResponse;
	// Trim leading spaces
	completion.choices = completion.choices?.map(c => ({
		message: {
			...c.message,
			content: c.message.content.replace(/^\s+|\s+$/g, '').trim(),
		},
	}));
	return completion;
};
export async function httpTrigger3(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    let messages;
    if (request.body == null) {
		return jsonResult(400, {message: 'Missing body'});
	}
    const {message} = await request.json() as {
		message: string;
	};
    console.log("MESSAGE DU USER = ", message);
    conv.push( { "role": "user", "content": message});
    try{
        const response = await createChatCompletion(conv, chatcomp, model);
        console.log("OPENAI RESPONSE GLOBALE = ", response);
        messages = response.choices[0].message.content;
        conv.push({"role":"assistant", "content": messages})
        console.log("OPENAI RESPONSE = ", messages);
    }
    catch(error){
        context.log(error);
        return jsonResult(500, {error});
    }
    return jsonResult(200, {message: messages})
}

app.http('httpTrigger3', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/chat',
    handler: httpTrigger3
});
