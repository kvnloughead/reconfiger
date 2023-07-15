// @deno-types="../app.d.ts"

import { modify, applyEdits, format } from "npm:jsonc-parser";

async function readFile(filepath: string): Promise<string> {
  const data = await Deno.readFile(filepath);
  const decoder = new TextDecoder("utf-8");
  const text = decoder.decode(data);
  return text;
}

async function set(options: Options, args: string[]) {
  const { file } = options;
  const [key, value] = args;

  // read jsonc file
  const text = await readFile(file);

  // make edits and apply them
  const edits = modify(text, [key], value, {});
  const updated = applyEdits(text, edits);

  // format the updated text and write to file
  const formatted = format(updated, undefined, {});
  await Deno.writeTextFile(file, applyEdits(updated, formatted));

  return;
}

export default set;
