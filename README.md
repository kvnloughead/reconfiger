# Reconfiger

A tool that (one day) will provide a handy CLI for re-configuring all your many dotfiles. Started with a simple desire: to be able to toggle my VSCode theme at the command line. It was made a bit more challenging by the fact that I do like add comments to my JSON config files, and support for working with commented JSON is rather sparse.

## Features

- All it really does right now is allow you to set key/value pairs in a JSON with (or without) comments document
- By default, it operates on its own configuration file (by default, that's `$HOME/.config/reconfig/settings.json`)
- You can specify different files with the `-f|--file` flag
- Run `reconfiger --help` for usage details

## Set up

The following will clone the repo, compile the program, and move the executable to `$HOME/bin`. If you'd rather place it somewhere else in your path, you can run `deno task compile` and place it where you like.

```
git clone git@github.com:kvnloughead/reconfiger
cd reconfiger
deno task deploy
```

## Stack

- Deno
- TypeScript
- Cliffy
- jsonc-parser. An npm package, because the existing Deno library is not very robust.

## Limitations

- If there is a line comment on the final line, it's placement won't be preserved when you add a new key to the document
- Doesn't support nested fields

## To do

- More subcommands: `get`, `list`, `rm`
- Improve safety with `.bak` files
- Support more configuration formats
- Autocompletion
