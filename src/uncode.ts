import { Ollama } from 'npm:ollama';

export interface CallingContext {
    model: string;
    ollama: Ollama;
    streaming: boolean;
}

function isValidUncodedFunction<P extends [], R>(func: unknown): func is UncodedFunction<P, R> {
    return typeof func === 'object' && func !== null && 'signature' in func && 'explanation' in func && 'examples' in func;
}

export class UncodedFunction<P extends [], R> {
    constructor(readonly signature: string,
        readonly explanation: string,
        readonly examples: { input: P; output: R; }[]) { }

    static load<P extends [], R>(file: string): UncodedFunction<P, R> {
        const decoder = new TextDecoder();
        const func = JSON.parse(decoder.decode(Deno.readFileSync(file)));
        if (!isValidUncodedFunction(func)) {
            throw new Error('The json is not a valid UncodedFunction');
        }
        // TODO: We really should verify that the signature matches
        // Notice we never specify a programming language
        return new UncodedFunction(func.signature, func.explanation, func.examples) as UncodedFunction<P, R>;
    }

    get name(): string {
        // This is tricky to get because it could be in any programming language
        return this.signature.match(/^(fn|fun|func|function|proc|procedure|def|define)\s+(\w+)\b/)![1];
    }

    get declaration(): string {
        const assertions = this.examples.map(
            (example: { input: P, output: R }) =>
                `assert ${this.name}(${JSON.stringify(example.input)}) == ${JSON.stringify(example.output)}`).join('\n');
        return `${this.signature} {\n/// ${this.explanation}\n\n${assertions}\n}`;
    }

    async call(ctx: CallingContext, rawInput: string | null = null, ...parameters: P): Promise<{ output: R } | { error: string }> {
        const content = `${this.declaration}\nCalling the function with these parameters: ${JSON.stringify(rawInput ?? parameters)}\nwould produce the following results:\n`;
        const response = await ctx.ollama.chat({
            model: ctx.model,
            format: 'json',
            messages: [
                { role: 'system', content: "You are a function simulator that returns accurate results. Given the following function signature, description of the function, and the given parameters to simulate the output of the calling this function with the provided input. Return a JSON object with the key output with the appropriate values as shown in the examples. You must reply with the types specified in the signature. If your response is incorrect or there is some other error, instead of the key output, you may return a key called error with a string message in it. Pay close attention to the examples and explanation to understand how the function should work." },
                {
                    role: 'user', content
                },
            ],
            stream: true,
        });

        let responseMessage = '';
        const textEncoder = new TextEncoder();
        for await (const part of response) {
            const encoded = textEncoder.encode(part.message.content);
            responseMessage += part.message.content;
            if (ctx.streaming) Deno.stdout.write(encoded);
        }

        const parsed = JSON.parse(responseMessage);

        if ('error' in parsed) {
            throw new Error(parsed.error);
        }

        if (!('output' in parsed)) {
            throw new Error('No output or error was received from the LLM.');
        }

        return parsed.output;
    }
}
