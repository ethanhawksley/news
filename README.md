# News

**[news.hawksley.dev](https://news.hawksley.dev)**

## Features

- Shows the top 10 Hacker News and the top 5 Lobsters posts
- Updates daily
- Permanent archive of previous days, sorted by month
- Lightweight to load
- Dark mode with WCAG AAA contrast.
- No FOUC

## Running Locally

Requires [Node.js 22+](https://nodejs.org) and [pnpm](https://pnpm.io).

```shell
git clone https://github.com/ethanhawksley/news
cd news
pnpm install
pnpm run dev
```

Then open `http://localhost:4321` in your browser.

To fetch the day's posts:

```shell
node scripts/fetch.ts
```

It will output the day's posts into a YYYY-MM-DD.json file in `src/content/days/`

## License

(MIT)[LICENSE]
