# Uncode CLI

Uncode is a command-line interface (CLI) tool that leverages a large language model (LLM) to simulate the results of an unwritten function. The function details are specified in a JSON file that includes the signature, explanation, and examples. This tool uses the `Ollama` library for interfacing with the LLM and the `Cliffy` library for creating the CLI. You'll need to be running [Ollama](https://ollama.com/).

## Warning: Experimental

This is completely experimental and provided as-is. You should *definitely* not use this for anything important yet!!!!

This can be used to quickly write and test easier tasks, but it should excel at trickier NLP tasks like summarization.

## Features

- Language agnostic (presumably; I haven't tested that yet)
- Simulate calls to a hypothetical function based solely on the signature you provide and test cases
- Can be used in command line pipelines
- Easy to incorporate into shell scripts
 
## Installation

Ensure you have [Deno](https://deno.land/) installed. You can install Deno by following the instructions on their [installation page](https://deno.land/manual/getting_started/installation).

The following will build an executable.

```bash
deno task build
```

## Usage

```bash
uncode [options] <jsonFileName>
```

### Options

- `-m, --model <model>`: Model to use (default: `llama3:instruct`).
- `-u, --url <url>`: URL of the llama server (default: `http://127.0.0.1:11434`).
- `-v, --verbose`: Enable verbose mode.
- `-d, --declaration`: Print the function declaration.
- `-r, --raw`: Do not attempt to parse the input as JSON.

### Arguments

- `<jsonFileName>`: Path to the JSON file that defines the function signature, explanation, and examples.

## Example

To use the `uncode` CLI to simulate this function, run:

```bash
echo '[2,2]' | ./uncode examples/add.json 
```

Use the following to use the [Code Function](examples/code.json) to write the source code for another of the examples, the [Reverse Function](examples/reverse.json)

```bash
./uncode -d examples/reverse.json | ./uncode -r examples/code.json
```

returns

```ts
function reverseWords(s: string): string {
    return s.split(" ").reverse().join(" ");
}
```

Automagically generate tests for a hypothetical function.

```bash
./uncode -d examples/reverse.json | ./uncode -rm "codellama:13b" examples/tests.json
mkdir -p examples/generated/
for file in examples/*.json; do
    BASE=$(basename -s ".json" $file)
    echo $BASE
    cat $file | uncode examples/code.json -r > examples/generated/$BASE.ts
    cat $file | uncode examples/tests.json -r > examples/generated/${BASE}_test.ts
done
```



### Warning

Do not trust any code this produces and *don't* use it in production yet!

### Verbose Mode

To enable verbose mode and see detailed output, use the `-v` option:

```bash
uncode -v function.json
```

### Print Function Declaration

To print the function declaration, use the `-d` option:

```bash
uncode -d function.json
```

### Handle Raw Input

To handle raw input without parsing as JSON, use the `-r` option:

```bash
uncode -r function.json
```

## Development

### Dependencies

- [Ollama](https://github.com/ollama/ollama)
- [Cliffy](https://deno.land/x/cliffy)
- [Speed Highlight JS](https://deno.land/x/speed_highlight_js)

### Code Structure

- `initLlama`: Initializes the `Ollama` instance and ensures the target model is available.
- `cli`: Defines the command-line interface using `Cliffy`.

### Running the Script

To run the script directly using Deno, use the following command:

```bash
deno task start function.json
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to this project by opening issues or submitting pull requests on the [GitHub repository](https://github.com/dancxjo/uncode). For any questions or support, please contact [tdreed@gmail.com](mailto:tdreed@gmail.com).
