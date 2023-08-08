import { httpTrigger1 } from '../functions/StartTraining'; // Adjust the path based on your project structure
import { HttpRequest, InvocationContext } from "@azure/functions";

const defaultRequest = {
	url: 'http://localhost:7071/api/v1/start',
	method: 'POST',
};


describe('Start Training Trigger', () => {
	let request: HttpRequest = new HttpRequest(defaultRequest);
	let context: InvocationContext = new InvocationContext();

	beforeEach(() => {
		request = new HttpRequest(defaultRequest);
		context = new InvocationContext();
	});

	afterEach(() => jest.resetAllMocks());

	test('should fail on missing body', async () => {
		const {status, body} = await httpTrigger1(request, context);
		expect(status).toEqual(400);
		expect(body).toEqual(JSON.stringify({message: 'Missing body'}));
	});

    test('should fail on missing guidelines', async () => {
	request = new HttpRequest({...defaultRequest, body: {string: JSON.stringify({})}});
	const {status, body} = await httpTrigger1(request, context);
	expect(status).toEqual(400);
	expect(body).toEqual(JSON.stringify({message: 'message is required'}));
	});
})