export const PROGRAM_NAME = "reconfiger"; // replace with app's name

export const DEFAULT_DIR = `${
  Deno.env.get("HOME") || ""
}/.config/${PROGRAM_NAME}`;

export const DEFAULT_CONFIG = `${DEFAULT_DIR}/settings.json`;
