import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import {type OpenAiChatCompletionRequest} from './models/OpenAIChatCompletionRequest';
import {type OpenAiChatCompletionResponse} from './models/OpenAiChatCompletionResponse';
import {type OpenAiModelSettings} from './models/ModelSettings';
import {
	type OpenAiChatCompletionPrompt,
} from './models/OpenAIChatCompletionRequest';
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

const deployment = 'davinci';
const chatcomp = 'chat';
const model = {
	temperature: 0.2,
	n: 1,
	max_tokens: 150,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0,
};

export const conv = [];

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


export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    if (request.body == null)
        return jsonResult(400, {message:"Missing body"});
    const {guidelines} = await request.json() as {
		guidelines: string;
	};

    if (guidelines == null)
        return jsonResult(400, {message:"message is required"});

	let message: string | undefined;
    try {
        const m =  { role: 'system',
            content: `I want you to act as a housekeeper teacher. Your role is to create a course/Q&A to help new housekeepers' trainee to acquire all the housekeeping requirements based on this specific process: ${guidelines}.
            First,  introduce yourself and ask the name of the trainee. You will then stop and wait for the trainee to reply with their name, once they answered you can then refer to them by this name for the rest of the time and continue with asking the questions. 
            Next give the question, the questions should be written in bold with emoji related to the question content and add 🤖 when you speak. You will also create a table with five topics and the percentage of correct answers in the score column:
            Topics | Score 
            Housekeeping | 0% 
            Maintenance | 0%
            HotSOS Integration | 0%
            Maintenance Manager Oversight | 0% 
            Incident Resolution Procedure | 0%. 
            The percentages in the score column represent the percentage of correct answers within each category. As you continue to answer questions correctly in each respective category, the score will increase accordingly. You will only provide this table before Q1.
            I want you to create a learning path with questions about the process provided above and only base on that. Questions should be precise and match one step above. Here the output format I want each time : Type of question : What is the first thing a housekeeper must do when he/she enter in a room ? Provide possible answers : Provide 4 possible answers per question with only one correct answer, a bogus trick question that everyone would choose but not correct, one funny answer and one which is the opposite from the correct answer. 
            You are in a question-answer mode without stopping to ask questions. After asking a question, you must stop and always wait for the trainee to answer. After the trainee's answer, Write✅ when the answer is good and ❌ when bad, then provide an explanation of the good answer regardless of the trainee's answer. 
            Take in account the different topics score and try to formulate questions on those topics to improve and increase the trainee score.
            If the trainee type retry you should provide him another question but on the same topic to improve his knowledge. 
            If the trainee type “end”, this is the end of the learning path, and you should display a dashboard of the trainee performance with a bar graph that shows a recapitulative of the score per topics base on the table generate above, like this : example : topic |█████░░░░░░░░░░░░░| 25%`
            }
            conv.push(m);
            const response = await createChatCompletion(conv, deployment, model);
			message = response.choices[0].message.content;
            conv.push({"role":"assistant", "content": message})
            console.log("OPENAI RESPONSE = ", message);
    }
    catch (error)
    {
        context.log(error);
        return jsonResult(500, {error});
    }
    return jsonResult(200, {
				message
	});
}



app.http('httpTrigger1', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/start',
    handler: httpTrigger1
});
