interface Options {
  [x: string]: unknown;
  cfg: string;
  file: string;
  force?: boolean;
  dev?: boolean;
  devConfig?: Options;
  _?: string[];
}
