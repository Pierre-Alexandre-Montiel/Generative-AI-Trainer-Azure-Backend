import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { jsonResult } from "./Utils/functions";
import { documentsIndex } from "./Utils/Index";

const endpoint = process.env.AZURE_COGNITIVE_SEARCH_ENDPOINT_PA;
const apiVersion = '2023-07-01-preview';
const apiKey = process.env.AZURE_COGNITIVE_SEARCH_API_KEY_PA;

const headers = {
	'api-key': apiKey,
	'Content-Type': 'application/json',
};

export async function httpTrigger2(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    if (request.body == null) {
		return jsonResult(400, {message: 'Missing body'});
	}

	const data = await request.formData();
    //const name = data.get('file') as unknown as string;
    const document = data.get('file') as unknown as File;
    const fileName = document?.name;
    const fileContent = await document?.arrayBuffer();

    console.log("File Name = ", fileName);
    console.log("File Content = ", fileContent);
    try {
        const response = await fetch(`${endpoint}/indexes?api-version=${apiVersion}`, {
            headers,
            body: JSON.stringify(documentsIndex),
            method: 'POST',
        });
        console.log("RESPONSE = ", response.status);
        console.log("Index create");
    }
    catch(error){
        context.log(error);
        return jsonResult(500, {error});
    }
    return jsonResult(200, {message: 'good'})
}

app.http('httpTrigger2', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/files',
    handler: httpTrigger2
});
