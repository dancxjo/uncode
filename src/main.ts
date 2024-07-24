import { Ollama } from 'npm:ollama';
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts";
import { printHighlight } from "https://deno.land/x/speed_highlight_js@v1.2.6/dist/terminal.js";
import { UncodedFunction } from './uncode.ts';

async function initLlama(targetModel = 'llama3:instruct', hostUrl: string = 'http://127.0.0.1:11434'): Promise<Ollama> {
    const ollama = new Ollama({
        host: hostUrl,
    });

    const { models } = await ollama.list();
    if (!models.some((model) => model.name === targetModel)) {
        const _res = await ollama.pull({ model: targetModel });
    }

    return ollama;
}

async function collectInput(): Promise<string> {
    const decoder = new TextDecoder();
    const input = [];
    for await (const line of Deno.stdin.readable) {
        input.push(decoder.decode(line));
    }
    return input.join('\n');
}

const cli = new Command()
    .name("uncode")
    .description("Use an LLM to simulate the results of an unwritten function. To specify the function, provide a JSON file with the signature, explanation, and examples.")
    .arguments("<jsonFileName:string>")
    .option("-m, --model <model:string>", "Model to use", { default: Deno.env.get('OLLAMA_MODEL') ?? 'llama3:instruct' })
    .option("-u, --url <url:string>", "URL of the llama server", { default: Deno.env.get('OLLAMA_HOST') ?? 'http://127.0.0.1:11434' })
    .option("-v, --verbose", "Enable verbose mode", { default: false })
    .option("-d, --declaration", "Print the function declaration", { default: false })
    .option("-r, --raw", "Do not attempt to parse the input as JSON", { default: false })
    .action(async ({ model, url, verbose, declaration, raw }, jsonFileName) => {
        try {
            const path = Deno.realPathSync(jsonFileName);
            const func = UncodedFunction.load(path);

            if (verbose || declaration) {
                printHighlight(func.declaration, 'ts');
                if (declaration) {
                    return;
                }
            }

            const ctx = {
                model,
                ollama: await initLlama(model, url),
                streaming: verbose,
            };

            let input = await collectInput();

            if (!raw) {
                try {
                    input = JSON.parse(input);
                } catch (e) {
                    console.error(`Error parsing input as JSON: ${e}`);
                }
            }

            const result = await func.call(ctx, input);

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    });

await cli.parse(Deno.args);