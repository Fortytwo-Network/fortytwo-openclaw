# Fortytwo for OpenClaw

![Status](https://img.shields.io/badge/status-unreleased-grey)
[![Discord](https://img.shields.io/badge/discord-join-7289da)](https://discord.gg/fortytwo)
[![X Fortytwo](https://img.shields.io/twitter/follow/fortytwo?style=social)](https://x.com/fortytwo)

Adds [Fortytwo](https://fortytwo.network) as a model provider to [OpenClaw](https://openclaw.ai), with live model discovery, streaming, tool calls, image input and reasoning.

Requires OpenClaw 2026.10.9 or later and a supported Node runtime: 24.22.1+ within Node 24, or 26.12.1+.

Not yet published on npm. Install from the local source checkout below.

## Install

From this checkout, build a local package:

```sh
npm ci
npm pack
```

Review the source before installing the local archive and accepting its provider capability:

```sh
openclaw plugins install npm-pack:./fortytwo-network-openclaw-provider-0.1.0.tgz --force --accept-capabilities
```

## Add your API key

Create a key on the [API keys](https://platform.fortytwo.network/api-keys) page of the Fortytwo Platform, then run:

```sh
openclaw onboard --auth-choice fortytwo-api-key
```

Paste the key when prompted. OpenClaw stores it in an auth profile. You can also supply `FORTYTWO_API_KEY` in the environment of the OpenClaw process.

## Select the model

Onboarding selects `fortytwo/qwen/qwen3.8-27b` when no default model is already configured. Refresh the available models:

```sh
openclaw models list --refresh --provider fortytwo
```

To select Fortytwo for an agent turn:

```sh
openclaw agent --agent main --model fortytwo/qwen/qwen3.8-27b --message "Hello" --thinking medium
```

## Models

| Model ID | Name | Context (tokens) | Max output (tokens) | Input | Input price (USD / 1M tokens) | Output price (USD / 1M tokens) | Cached input price (USD / 1M tokens) |
|---|---|---|---|---|---|---|---|
| `qwen/qwen3.8-27b` | Qwen3.8 27B | 262,144 | 235,929 | text, image | 0.425 | 2.55 | 0.085 |

Current models: [Models](https://docs.fortytwo.network/docs/models). Current prices: [Pricing](https://docs.fortytwo.network/docs/pricing).

The model list refreshes from your Fortytwo account. Image input supports PNG and JPEG.

## Reasoning

Use `--thinking` for an agent turn. The default is **medium**.

| OpenClaw level | Sent to the API as `reasoning_effort` |
|---|---|
| off | `none`: reasoning is turned off |
| low, medium, xhigh | the same value |

Reasoning tokens count against the output limit.

## Environment variables

| Variable | Meaning |
|---|---|
| `FORTYTWO_API_KEY` | API key, sent as the Bearer token. Not needed if you added the key through onboarding |

## Troubleshooting

- **Fortytwo is not available.** Check `openclaw plugins inspect fortytwo --runtime --json`, add your key, then refresh the model list. An already-running Gateway must load the installed plugin before use.
- **Live discovery fails.** Check your key and connectivity. Failed refreshes report an error rather than presenting the static catalogue as a successful live listing.
- **Other problems.** See [Common problems](https://docs.fortytwo.network/docs/support-common-problems) or ask on [Discord](https://discord.gg/fortytwo).

## Development

```sh
npm ci
npm test            # SDK tests, no network
npm run build
npm pack
```

## License

[MIT](LICENSE)
