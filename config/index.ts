import { path } from '../deps.ts';
import { DEFAULT_DIR } from '../utils/constants.ts';

import {
  parseJsonFile,
  addUserDir,
  confirmAction,
  logError,
} from '../utils/lib.ts';

/**
 * Retrieves configuration settings from a file, and merges them with the
 * specified command line arguments.
 *
 * Users can specify their own config file at an arbitrary location via the
 * cfg field in the default config file, or via the --cfg command line flag.
 *
 * If the config file doesn't exist, the user will be prompted to create it.
 *
 * If the --dev flag is set, the development configuration will be
 * loaded from the devConfig field of the configuration file.
 *
 * Settings are loaded in the following sequence:
 *
 *  1. The default configuration at HOME/.config/min/settings.json is loaded
 *  2. If a secondary config is specified, those settings overwrite the
 *     corresponding settings from the default config
 *  3. If the --dev flag is setting, the specified devConfig are then loaded.
 *     These settings can be specified in the default config, or a config
 *     that's specified at run time
 *  4. Default values are then applied, as needed.
 *
 * @param {string} cfgFile - The path to the configuration file
 * @param {Options} args - The command line arguments. Should be parsed by Deno.parse
 * @returns {Promise<object>} An object containing the merged configuration settings
 */
export async function getConfig(
  cfgFile: string,
  args: Options,
): Promise<Options | undefined> {
  let config: Options;
  try {
    config = await parseJsonFile(addUserDir(cfgFile));
  } catch (err) {
    if (err.name === 'NotFound') {
      confirmAction(
        false,
        "Config file doesn't exist. Shall we create it? (y | n)",
      );
      await Deno.mkdir(path.parse(cfgFile).dir, { recursive: true });
      await Deno.writeTextFile(cfgFile, `{ "cfg": "${cfgFile}" }`);
      config = { cfg: cfgFile, file: DEFAULT_DIR };
    } else {
      logError(err);
      return;
    }
  }

  // if a config file is specified in the args, or in the default config file
  // parse the specified config file and add to configuration
  if (args.cfg || config.cfg) {
    const moreConfig = await parseJsonFile(addUserDir(args.cfg || config.cfg));
    config = { ...config, ...moreConfig };
  }

  // if args.dev and the config file contains devConfig settings
  // parse those settings and add to configuration
  if (args.dev && config.devConfig) {
    Object.entries(config.devConfig).forEach(([k, v]) => {
      config[k] = v;
    });
    config.cfg = cfgFile;
  }

  // add HOME dir to filepaths in case it isn't present already
  config.cfg = addUserDir(args.cfg || config.cfg || cfgFile);

  return { ...config, ...args };
}
