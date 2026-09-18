const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME || 'SanamRai001';
if (!token) throw new Error('GITHUB_TOKEN is required');

const to = new Date();
const from = new Date(to);
from.setUTCDate(from.getUTCDate() - 364);

const query = `query($login:String!,$from:DateTime!,$to:DateTime!){
  user(login:$login){
    contributionsCollection(from:$from,to:$to){
      contributionCalendar{
        totalContributions
        weeks{ contributionDays{ date contributionCount contributionLevel weekday } }
      }
    }
  }
}`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'SanamRai001-profile-build-signal'
  },
  body: JSON.stringify({ query, variables: { login: username, from: from.toISOString(), to: to.toISOString() } })
});

if (!response.ok) throw new Error(`GitHub GraphQL failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
if (payload.errors?.length) throw new Error(JSON.stringify(payload.errors));
const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar) throw new Error('Contribution calendar not returned');

const weeks = calendar.weeks;
const days = weeks.flatMap(w => w.contributionDays).sort((a,b) => a.date.localeCompare(b.date));
const activeDays = days.filter(d => d.contributionCount > 0).length;
const peak = days.reduce((best,d) => d.contributionCount > best.contributionCount ? d : best, days[0]);
let streak = 0, bestStreak = 0;
for (const d of days) {
  if (d.contributionCount > 0) { streak += 1; bestStreak = Math.max(bestStreak, streak); }
  else streak = 0;
}

const colors = {
  NONE:'#141C24',
  FIRST_QUARTILE:'#183A5A',
  SECOND_QUARTILE:'#235E91',
  THIRD_QUARTILE:'#348BCB',
  FOURTH_QUARTILE:'#69B8FF'
};

const cells = weeks.map((week, wi) => week.contributionDays.map(day => {
  const x = 390 + wi * 14;
  const y = 112 + day.weekday * 14;
  const fill = colors[day.contributionLevel] || colors.NONE;
  const title = `${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`;
  return `<rect x="${x}" y="${y}" width="10" height="10" rx="2" fill="${fill}"><title>${title}</title></rect>`;
}).join('')).join('');

const firstDate = days[0]?.date || '';
const lastDate = days.at(-1)?.date || '';
const updated = to.toISOString().slice(0,10);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="330" viewBox="0 0 1200 330" role="img" aria-label="${username} public GitHub build signal">
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

const { mkdir, writeFile } = await import('node:fs/promises');
await mkdir('assets/profile', { recursive: true });
await writeFile('assets/profile/build-signal.svg', svg);
console.log(`Generated build signal: ${calendar.totalContributions} contributions, ${activeDays} active days`);