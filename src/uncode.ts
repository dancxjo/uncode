import { Ollama } from 'ollama';

const textEncoder = new TextEncoder();

export async function uncode<P, R>(ollama: Ollama, targetModel: string, signature: string, explanation: string, parameters: P, tests: { input: P, output: R }[] = [], stream = false): Promise<R> {
    const content = `${signature} {\n/// ${explanation}\n\n// Simulate the code that would be here\n}\n\nExamples:\n${tests.map(example => JSON.stringify(example)).join("\n")}\nCalling the function with these parameters: ${JSON.stringify(parameters)}\nwould produce the following results:\n`;
    const response = await ollama.chat({
        model: targetModel,
        format: 'json',
        messages: [
            { role: 'system', content: "You are a function simulator that returns accurate results. Given the following function signature, description of the function, and the given parameters to simulate the output of the calling this function with the provided input. Return a JSON object with the keys input and output with the appropriate values as shown in the examples.You must reply with the types specified in the signature. If your response is incorrect, instead of the key output, you may return a key called error with a string message in it. Pay close attention to the examples and explanation to understand how the function should work." },
            {
                role: 'user', content
            },
        ],
        stream: true,
    });

    let responseMessage = '';
    for await (const part of response) {
        const encoded = textEncoder.encode(part.message.content);
        responseMessage += part.message.content;
        if (stream) Deno.stdout.write(encoded);
    }

    return JSON.parse(responseMessage) as R;
}
