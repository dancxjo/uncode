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
    .action(async ({ model, url, verbose = false, declaration = false, raw = false }, jsonFileName) => {
        try {
            const path = Deno.realPathSync(jsonFileName);
            const module = await import(path, {
                with: { type: "json" },
            });

            const uncodedFunction = module.default;
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
            const decoder = new TextDecoder();

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
                const result = await uncode(ollama, model, signature, explanation, input, examples, verbose);
                if (!verbose) {
                    // If we are in verbose mode, we've already streamed the results
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    // Otherwise we need a new line
                    console.log('');
                }
            } catch (e) {
                console.error(e);
            }

        } catch (error) {
            console.error(error);
        }
    });

await cli.parse(Deno.args);