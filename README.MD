# Installation

Requirements:
- Node 18.x
- pnpm 8.6.9

1) In `.npmrc` replace `"${CI_JOB_TOKEN}"` to your token here `//gitlab.constr.dev/api/v4/:_authToken="${CI_JOB_TOKEN}"`

2) Install `pnpm`

   `npm install pnpm@8.6.9 -g` or follow [these instructions](https://pnpm.io/ru/installation)

3) Execute install command:

   `pnpm install`

# Run

`pnpm run start`