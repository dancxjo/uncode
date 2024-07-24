import { Ollama } from 'ollama';
import { uncode } from './uncode.ts';
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts";
import { printHighlight } from "https://deno.land/x/speed_highlight_js@v1.2.6/dist/terminal.js";

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

const cli = new Command()
    .name("uncode")
    .description("Use an LLM to simulate the results of an unwritten function. To specify the function, provide a JSON file with the signature, explanation, and examples.")
    .arguments("<jsonFileName:string>")
    .option("-m, --model <model:string>", "Model to use", { default: 'llama3:instruct' })
    .option("-u, --url <url:string>", "URL of the llama server", { default: 'http://127.0.0.1:11434' })
    .option("-v, --verbose", "Enable verbose mode")
    .option("-d, --declaration", "Print the function declaration")
    .option("-r, --raw", "Do not attempt to parse the input as JSON")
    .option("-o, --outputonly", "Only print the output")
    .action(async ({ model, url, verbose = false, declaration = false, raw = false, outputonly = false }, jsonFileName) => {
        try {
            const decoder = new TextDecoder();
            const path = Deno.realPathSync(jsonFileName);
            const data = Deno.readFileSync(path);
            const jsonContent = decoder.decode(data);
            const uncodedFunction = JSON.parse(jsonContent);
            const { signature, explanation, examples } = uncodedFunction;

            if (verbose || declaration) {
                const assertions = examples.map((example: { input: string, output: string }) => `assert ${JSON.stringify(example.input)} == ${JSON.stringify(example.output)}`).join('\n');
                printHighlight(`/// ${explanation}\n${signature};\n${assertions}`, 'ts');
                if (declaration) {
                    return;
                }
            }

            const ollama = await initLlama(model, url);

            let parametersString = '';

            let receiving = true;

            while (receiving) {
                let pstring = '';
                for await (const chunk of Deno.stdin.readable) {
                    const bite = decoder.decode(chunk);
                    pstring += bite;
                }
                parametersString += pstring;
                receiving = !!pstring.trim();
            }

            try {
                const input = raw ? parametersString : JSON.parse(parametersString);
                const result: {
                    input?: unknown,
                    output?: unknown,
                    error?: string,
                } = await uncode(ollama, model, signature, explanation, input, examples, verbose);

                console.log(result);

                const isErrored = 'error' in result;
                const hasOutput = 'output' in result;

                if (!(isErrored || hasOutput)) {
                    throw new Error('No output or error was received from the LLM.');
                }

                if (isErrored) {
                    throw new Error(result.error);
                }

                if (!verbose) {
                    // If we are in verbose mode, we've already streamed the results
                    if (outputonly) {
                        console.log(result.output);
                    } else {
                        console.log(JSON.stringify(result, null, 2));
                    }
                } else {
                    // Otherwise we need a new line
                    console.log('');
                    if (outputonly) {
                        throw new Error('Cannot print output-only in verbose mode');
                    }
                }
            } catch (e) {
                // Rethrow parsing errors
                throw e;
            }
        } catch (error) {
            console.error(error);
        }
    });

await cli.parse(Deno.args);