import fs from 'node:fs';

const bareUsernameDomains = new Set([
  'github.com',
  'codeberg.org',
  'gitlab.org',
  'huggingface.co',
  'dev.to',
  'medium.com',
  'twitter.com',
  'x.com',
  'buttondown.com',
]);

function getDomain(url: string) {
  const urlObject = new URL(url);
  let domain = urlObject.hostname;

  // Strip leading www.
  domain = domain.replace(/^www\d*\./, '');

  if (bareUsernameDomains.has(domain) || urlObject.pathname.startsWith('/@')) {
    domain += '/' + urlObject.pathname.split('/')[1];
  }

  return domain;
}

function shuffleArray(array: any[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

const timestampInSeconds = Math.floor(Date.now() / 1000);
const timestamp48HoursAgoInSeconds = timestampInSeconds - 60 * 60 * 24 * 2;

const hnResponse = await fetch(
  `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=50&numericFilters=created_at_i%3E${timestamp48HoursAgoInSeconds}`,
);
const hnJson = await hnResponse.json();

const hnPosts: any[] = hnJson.hits;

const lobstersResponse1 = await fetch('https://lobste.rs/hottest.json');
const lobstersPosts1 = await lobstersResponse1.json();
const lobstersResponse2 = await fetch('https://lobste.rs/hottest.json?page=2');
const lobstersPosts2 = await lobstersResponse2.json();

let lobstersPosts = [...lobstersPosts1, ...lobstersPosts2];

const days = fs.readdirSync('src/content/days');
const previousUrls = new Set();

for (const day of days) {
  const fileContent = JSON.parse(
    fs.readFileSync(`src/content/days/${day}`, 'utf-8'),
  );

  for (const story of fileContent.hn) {
    previousUrls.add(story.url);
  }
  for (const story of fileContent.lobsters) {
    previousUrls.add(story.url);
  }
}

hnPosts.sort((a, b) => b.points - a.points);

lobstersPosts = lobstersPosts
  .filter((post) => {
    const creationTimestampInSeconds = Math.floor(
      new Date(post.created_at).getTime() / 1000,
    );
    return creationTimestampInSeconds > timestamp48HoursAgoInSeconds;
  })
  .sort((a, b) => b.score - a.score);

const todayHnPosts = [];
for (const post of hnPosts) {
  if (!post.url || !post.title || !post.objectID) continue;

  if (!previousUrls.has(post.url)) {
    previousUrls.add(post.url);

    todayHnPosts.push({
      url: post.url,
      title: post.title,
      domain: getDomain(post.url),
      comments: `https://news.ycombinator.com/item?id=${post.objectID}`,
    });

    if (todayHnPosts.length === 10) {
      break;
    }
  }
}

const todayLobstersPosts = [];
for (const post of lobstersPosts) {
  if (!post.url || !post.title || !post.comments_url) continue;

  if (!previousUrls.has(post.url)) {
    previousUrls.add(post.url);

    todayLobstersPosts.push({
      url: post.url,
      title: post.title,
      domain: getDomain(post.url),
      comments: post.comments_url,
    });

    if (todayLobstersPosts.length === 5) {
      break;
    }
  }
}

shuffleArray(todayHnPosts);
shuffleArray(todayLobstersPosts);

const todayDate = new Date().toISOString().split('T')[0];

const jsonData = {
  date: todayDate,
  hn: todayHnPosts,
  lobsters: todayLobstersPosts,
};
const jsonString = JSON.stringify(jsonData);

fs.writeFileSync(`src/content/days/${todayDate}.json`, jsonString);
