const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME || 'SanamRai001';
if (!token) throw new Error('GITHUB_TOKEN is required');

const to = new Date();
const from = new Date(to);
from.setUTCDate(from.getUTCDate() - 364);

const graphqlQuery = `query($login:String!,$from:DateTime!,$to:DateTime!){
  user(login:$login){
    contributionsCollection(from:$from,to:$to){
      contributionCalendar{
        totalContributions
        weeks{ contributionDays{ date contributionCount contributionLevel weekday } }
      }
    }
  }
}`;

const authHeaders = {
  Authorization: `Bearer ${token}`,
  'User-Agent': 'SanamRai001-profile-signals'
};

const [graphqlResponse, profileResponse, reposResponse] = await Promise.all([
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: {
        login: username,
        from: from.toISOString(),
        to: to.toISOString()
      }
    })
  }),
  fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: authHeaders
  }),
  fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&direction=desc&per_page=100`, {
    headers: authHeaders
  })
]);

if (!graphqlResponse.ok) {
  throw new Error(`GitHub GraphQL failed: ${graphqlResponse.status} ${await graphqlResponse.text()}`);
}
if (!profileResponse.ok) {
  throw new Error(`GitHub profile request failed: ${profileResponse.status} ${await profileResponse.text()}`);
}
if (!reposResponse.ok) {
  throw new Error(`GitHub repositories request failed: ${reposResponse.status} ${await reposResponse.text()}`);
}

const [graphqlPayload, profile, repos] = await Promise.all([
  graphqlResponse.json(),
  profileResponse.json(),
  reposResponse.json()
]);

if (graphqlPayload.errors?.length) {
  throw new Error(JSON.stringify(graphqlPayload.errors));
}

const calendar = graphqlPayload.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar) throw new Error('Contribution calendar not returned');

const weeks = calendar.weeks;
const days = weeks
  .flatMap(week => week.contributionDays)
  .sort((a, b) => a.date.localeCompare(b.date));

const activeDays = days.filter(day => day.contributionCount > 0).length;
const peak = days.reduce(
  (best, day) => day.contributionCount > best.contributionCount ? day : best,
  days[0]
);

let streak = 0;
let bestStreak = 0;
for (const day of days) {
  if (day.contributionCount > 0) {
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
  } else {
    streak = 0;
  }
}

const colors = {
  NONE: '#141C24',
  FIRST_QUARTILE: '#183A5A',
  SECOND_QUARTILE: '#235E91',
  THIRD_QUARTILE: '#348BCB',
  FOURTH_QUARTILE: '#69B8FF'
};

const cells = weeks.map((week, weekIndex) =>
  week.contributionDays.map(day => {
    const x = 390 + weekIndex * 14;
    const y = 112 + day.weekday * 14;
    const fill = colors[day.contributionLevel] || colors.NONE;
    const title = `${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`;
    return `<rect x="${x}" y="${y}" width="10" height="10" rx="2" fill="${fill}"><title>${title}</title></rect>`;
  }).join('')
).join('');

const firstDate = days[0]?.date || '';
const lastDate = days.at(-1)?.date || '';
const updated = to.toISOString().slice(0, 10);

const buildSignalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="330" viewBox="0 0 1200 330" role="img" aria-label="${username} public GitHub build signal">
<defs>
<linearGradient id="b" x1="0" x2="1"><stop stop-color="#080B10"/><stop offset=".55" stop-color="#0A1118"/><stop offset="1" stop-color="#080B10"/></linearGradient>
<pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#9AC5ED" stroke-opacity=".04"/></pattern>
<style>@keyframes pulse{0%,100%{opacity:.28}50%{opacity:1}}.pulse{animation:pulse 2.8s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.pulse{animation:none;opacity:1}}</style>
</defs>
<rect width="1200" height="330" rx="22" fill="url(#b)"/><rect width="1200" height="330" rx="22" fill="url(#g)"/><rect x="1" y="1" width="1198" height="328" rx="21" fill="none" stroke="#659DD0" stroke-opacity=".16"/>
<text x="34" y="38" font-family="Consolas,monospace" font-size="11" letter-spacing="2" fill="#67B4FF">BUILD SIGNAL / 007</text>
<circle cx="178" cy="34" r="3" fill="#72E2EF" class="pulse"/>
<text x="34" y="76" font-family="Segoe UI,Arial,sans-serif" font-size="23" font-weight="650" fill="#EEF4FA">365 days of public GitHub activity</text>
<text x="34" y="104" font-family="Segoe UI,Arial,sans-serif" font-size="12" fill="#71869A">Source: GitHub contribution calendar · self-generated · no external stat service</text>
<g font-family="Consolas,monospace">
<text x="34" y="155" font-size="10" fill="#586E82">TOTAL</text><text x="34" y="181" font-size="24" fill="#D6E4F0">${calendar.totalContributions}</text>
<text x="132" y="155" font-size="10" fill="#586E82">ACTIVE DAYS</text><text x="132" y="181" font-size="24" fill="#D6E4F0">${activeDays}</text>
<text x="250" y="155" font-size="10" fill="#586E82">BEST STREAK</text><text x="250" y="181" font-size="24" fill="#D6E4F0">${bestStreak}d</text>
<text x="34" y="223" font-size="10" fill="#586E82">PEAK DAY</text><text x="34" y="247" font-size="12" fill="#B9C9D7">${peak?.date || '—'} · ${peak?.contributionCount || 0}</text>
</g>
<g>${cells}</g>
<text x="390" y="229" font-family="Consolas,monospace" font-size="9" fill="#52687C">${firstDate}</text>
<text x="1132" y="229" text-anchor="end" font-family="Consolas,monospace" font-size="9" fill="#52687C">${lastDate}</text>
<g font-family="Consolas,monospace" font-size="9"><text x="390" y="264" fill="#51687B">LESS</text>
<rect x="430" y="255" width="10" height="10" rx="2" fill="#141C24"/><rect x="446" y="255" width="10" height="10" rx="2" fill="#183A5A"/><rect x="462" y="255" width="10" height="10" rx="2" fill="#235E91"/><rect x="478" y="255" width="10" height="10" rx="2" fill="#348BCB"/><rect x="494" y="255" width="10" height="10" rx="2" fill="#69B8FF"/><text x="514" y="264" fill="#51687B">MORE</text></g>
<line x1="34" y1="286" x2="1166" y2="286" stroke="#213547"/>
<text x="34" y="310" font-family="Consolas,monospace" font-size="9" fill="#51687B">PUBLIC CONTRIBUTIONS / UPDATED ${updated}</text>
<text x="1166" y="310" text-anchor="end" font-family="Consolas,monospace" font-size="9" fill="#51687B">SYSTEM / 001</text>
</svg>`;

const ownedPublicRepos = Array.isArray(repos) ? repos : [];
const starsEarned = ownedPublicRepos
  .filter(repo => !repo.fork)
  .reduce((total, repo) => total + (repo.stargazers_count || 0), 0);

const excludedLatestRepos = new Set([
  username,
  'github-badge-test',
  'My-notebook',
  'A-site',
  'RAG-system'
]);

const latestRepo = ownedPublicRepos.find(repo =>
  !repo.fork &&
  !repo.archived &&
  (repo.size || 0) > 0 &&
  !excludedLatestRepos.has(repo.name)
);

const latestName = latestRepo?.name || 'No recent public repository';
const latestDate = latestRepo?.pushed_at
  ? new Date(latestRepo.pushed_at).toISOString().slice(0, 10)
  : '—';

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const displayLatestName = latestName.length > 30
  ? `${latestName.slice(0, 27)}...`
  : latestName;

const liveSignalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-label="${username} live GitHub signal">
<defs>
<linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#080B10"/><stop offset=".55" stop-color="#0A1118"/><stop offset="1" stop-color="#08121B"/></linearGradient>
<radialGradient id="gl" cx=".8" cy=".45" r=".5"><stop stop-color="#3882F6" stop-opacity=".14"/><stop offset="1" stop-color="#3882F6" stop-opacity="0"/></radialGradient>
<pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#9AC5ED" stroke-opacity=".04"/></pattern>
<style>@keyframes pulse{0%,100%{opacity:.28}50%{opacity:1}}.pulse{animation:pulse 2.8s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.pulse{animation:none;opacity:1}}</style>
</defs>
<rect width="1200" height="300" rx="22" fill="url(#b)"/><rect width="1200" height="300" rx="22" fill="url(#g)"/><rect width="1200" height="300" rx="22" fill="url(#gl)"/><rect x="1" y="1" width="1198" height="298" rx="21" fill="none" stroke="#659DD0" stroke-opacity=".16"/>

<text x="34" y="38" font-family="Consolas,monospace" font-size="11" letter-spacing="2" fill="#67B4FF">LIVE SIGNAL / 008</text>
<circle cx="173" cy="34" r="3" fill="#22D3EE" class="pulse"/>
<text x="34" y="76" font-family="Segoe UI,Arial,sans-serif" font-size="23" font-weight="650" fill="#EEF4FA">Public GitHub footprint</text>
<text x="34" y="103" font-family="Segoe UI,Arial,sans-serif" font-size="12" fill="#71869A">Automatically refreshed from GitHub · own public repositories only for star totals</text>

<g font-family="Consolas,monospace">
  <rect x="34" y="132" width="170" height="92" rx="14" fill="#0B141D" stroke="#28455E"/>
  <text x="52" y="158" font-size="9" letter-spacing="1.4" fill="#61778B">STARS EARNED</text>
  <text x="52" y="199" font-size="30" fill="#DCE9F3">${starsEarned}</text>

  <rect x="220" y="132" width="170" height="92" rx="14" fill="#0B141D" stroke="#28455E"/>
  <text x="238" y="158" font-size="9" letter-spacing="1.4" fill="#61778B">FOLLOWERS</text>
  <text x="238" y="199" font-size="30" fill="#DCE9F3">${profile.followers || 0}</text>

  <rect x="406" y="132" width="170" height="92" rx="14" fill="#0B141D" stroke="#28455E"/>
  <text x="424" y="158" font-size="9" letter-spacing="1.4" fill="#61778B">PUBLIC REPOS</text>
  <text x="424" y="199" font-size="30" fill="#DCE9F3">${profile.public_repos || 0}</text>

  <rect x="606" y="132" width="560" height="92" rx="14" fill="#0A151F" stroke="#35658C"/>
  <text x="628" y="158" font-size="9" letter-spacing="1.4" fill="#67B4FF">LATEST SHIP</text>
  <text x="628" y="190" font-size="19" fill="#E3EDF5">${escapeXml(displayLatestName)}</text>
  <text x="628" y="211" font-size="9" fill="#637A8E">MOST RECENTLY PUSHED PUBLIC PROJECT · ${latestDate}</text>
</g>

<line x1="34" y1="252" x2="1166" y2="252" stroke="#213547"/>
<text x="34" y="276" font-family="Consolas,monospace" font-size="9" fill="#51687B">GITHUB REST API / UPDATED ${updated}</text>
<text x="1166" y="276" text-anchor="end" font-family="Consolas,monospace" font-size="9" fill="#51687B">SR / SYSTEM 001</text>
</svg>`;

const { mkdir, writeFile } = await import('node:fs/promises');
await mkdir('assets/profile', { recursive: true });
await Promise.all([
  writeFile('assets/profile/build-signal.svg', buildSignalSvg),
  writeFile('assets/profile/live-signal.svg', liveSignalSvg)
]);

console.log(
  `Generated profile signals: ${calendar.totalContributions} contributions, ${starsEarned} stars, ${profile.followers || 0} followers, ${profile.public_repos || 0} public repos`
);
