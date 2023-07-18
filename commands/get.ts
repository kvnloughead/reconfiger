// @deno-types="../app.d.ts"

import { parse } from 'npm:jsonc-parser';

async function readFile(filepath: string): Promise<string> {
  const data = await Deno.readFile(filepath);
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(data);
  return text;
}

async function get(options: Options, args: string[]) {
  const { file } = options;
  const [key] = args;
  try {
    const text = await readFile(file);
    const data = parse(text);
    console.log(data[key]);
  } catch (err) {
    console.error(
      options.verbose
        ? err
        : `\nCan't read data from file: "${file}".\nRun again with the --verbose flag for more details.\n`,
    );
  }
}

export default get;
