# Personal site — spec v0.4

**Domain:** georgelu.ai
**Owner:** George Lu

A hobby-resume you drive like a console. Home is a vertical XMB. Clicking in opens an essay. Not a job hunt.

## Intent

Someone leaves able to say: George works the seam between business and engineering, he is building real things (an AI agency, a claims tool for people law firms will not take), and he has a pointed view of how people should live (dress, family, school vs building).

Tone: warm, very direct. He will say the sharp thing and mean it. Not a dunk account. Not a personal brand kit.

## Off the site

Do not publish: Elon support, Palo Alto (say Bay Area), traveling-as-hobby, anything framed as “coming soon.”

Bitcoin is not a shelf item yet. Library holds *Broken Money*. A world essay (college + Bitcoin + dress) comes later, when he writes it.

## Machine

Two surfaces only.

**Home.** Full viewport (`100dvh`). Four shelves in a **vertical column**, top to bottom. All four stay at full opacity. No distance fade, no blur-on-distance. Up/down browses shelves (and items once a shelf is open). Right opens that shelf’s items; left or Escape returns to the shelf. Enter or click opens the essay. ArrowRight never opens an essay. Mouse and touch: click/tap. Keyboard is first-class (arrows, enter, escape).

**Essay.** A normal reading page. Shareable path is `/<shelf>/<slug>`. Open `push`es that path once. One Escape hides the essay in the same tick and `replace`s to `/?shelf=<id>&item=<slug>` in shelf mode (visible collapse). That replaceState is the same turn as the unmount — including cold `/<shelf>/<slug>` — so the address bar is already the browse query when the shelf is visible. A lagged path reopens the essay on reload. The shelf must paint the focused row immediately — no ME-only blank, no replay of the first-visit fade-up. Browser Back from an essay is the same one-step return — no ghost `/<shelf>/<slug>` leftover. Sibling prev/next `replace` the essay path so essays do not stack. Cold `/<shelf>/<slug>` deep links stay valid.

Unlisted `/all` is a flat essay list by shelf. Not on the bar. No tags, no search, no comments.

## Shelves

Vertical column, top to bottom:

| Shelf   | Job                         | Opens |
|---------|-----------------------------|-------|
| me      | Who he is                   | Stay or essay |
| world   | What he thinks is important | Essay |
| work    | What he has built for money or a client | Essay |
| hobby   | Hobbies and things he keeps | Essay |

**Label lock (v0.3):** the fourth shelf is `hobby` everywhere — id, label, nav, and copy. `making` is retired; do not show it on the bar or in routes. Do not rename `hobby` (not making, play, life, or a fifth shelf). Order stays me → world → work → hobby.

Default focus: **me**.

Focused item may scale `0.78 → 1` and unfold a short blurb beside a 144px object-icon (88px on small screens). Unfocused shelves stay fully readable, just not expanded.

## Home, in detail

- Stage is one scene. No document scroll.
- Shelf column on the left. All four labels visible, tracked, small, capitalized.
- Viewfinder cursor: 1px corner brackets, 14px arms, ~50% opacity. Do not show empty brackets while the object image loads — placeholder or hide until ready.
- Active item: object-icon + short name + one-line title + optional 1–2 sentence blurb.
- Enter / click opens the essay if one exists. Arrows browse only.
- Home URL is one shape: `/?shelf=<id>&item=<slug>`. Focus lives there; item-column vs shelf is local UI, not a second URL. Write both params whenever focus moves (↑↓ shelves, ←→ items). Shelf-query writes must keep `history.state` so the App Router stays synced with `/<shelf>/<slug>` push/replace.
- First-visit hint: up/down chevrons + `↑↓ shelves · ←→ items · enter opens · esc back`. Stays until the first arrow/enter, and at least long enough to read (~6s), then fades. `?` shows it again (same 6s floor). After it hides, a short idle brings it back — that recall also fades. Escape back to the shelf must not pin the hint at opacity 1. Do not vanish a 14-word contract in one second.

### Me card

The only home card that may hold a short essay in place. Longer bio is an essay.

**Bio (locked, his voice):**

George Lu. Bay Area.

I run Estuary Systems LLC — an AI agency at the intersection of business and engineering.

I have a corgi named Biscuit.

Under that, a dated **Now** line (present tense, specific, replaceable). Sourced from the Now item `status`. Locked copy: `Sep 2026 — Building Estuary Systems. Company site: estuarysystems.ai.` Do not gut the locked bio. Never use “Hi I'm George / bring execution to you and your team / review your systems.”

No claims-system line. No “stuff on my mind” list. Contact / next-step lives on Now, not a fifth shelf.

### Inside-shelf priority

Items inside a shelf are ordered by priority, not chronology.

| Shelf | Order |
|-------|-------|
| me    | George → Now → Biscuit → Library |
| world | Dress → Pictures → Home → School (hide empty) |
| work  | Claims high, then Estuary, then Business sense |
| hobby | Cards → Party/mystery if any → Server (Season 0 status) → Poker → TFT |

Live today: no Party/mystery item, so hobby shows Cards → Server → Poker → TFT. Do not add a coming-soon Party tile.

### Hide empty

Empty or coming-soon items are omitted from the bar and the catalog. Do not show a “coming soon” tile. Set `hidden: true` or leave the file out / body empty. If a shelf has no live items, omit the shelf. Shelf order when present stays me → world → work → hobby.

Living hobby projects (Cards, Server; Party/mystery if they exist) carry a `status` line on the focused home card only. Status is a fact, not a launch. Server: `Season 0 · Sakura Tide`. Cards: the next show date. Do not paint a status whisper on unfocused shelves — it overprints neighboring titles at short viewports.

## Essay page

- Max width ~640–720px. Prose column `58ch`.
- Top bar: `esc` / back, frame number (`03 of 13`).
- Title, optional dek, body. Skip a grey dek that only repeats the first sentence. Images are objects, not heroes.
- Footer: prev / next on the same shelf, lowercase, with a leading or trailing arrow.
- No share, no related, no comments.

## Visual system

Kelindi’s material, not his icons.

**Color.** oklch grayscale. Theme: auto. Accent `oklch(0.55 0.24 264)` on light-mode links only.

**Type.** System UI for chrome. Inter Variable for prose (16px, 1.62, `-0.003em`, `kern liga calt ss01`). Titles ~1.95rem / 500 / `-0.035em`. Labels 12–14px, tracking `0.08em`.

**Motion.** `cubic-bezier(0.23, 1, 0.32, 1)` at ~160ms. Reveal: fade-up 8px, delay `60ms + index * 45ms`. Press `0.97`. Reduced motion: opacity only.

**Film.** Stage weave 2.7s `steps(7)` plus 5.3s breath to `0.985`. Object-icons are 60-frame strips, poster until focused.

**Objects.** Every focused thing is a photographed or rendered object. No avatars, orbs, or hero video.

## Voice

Warm. Direct. First person. Short sentences. One idea per essay. He can be sharp; he does not perform contempt. No “passionate about.” No “responsible for.” Work entries are dated and specific. World essays argue. Hobby entries show the thing.

## v0 contents

### me
- **George** — bio card (required). Object: a paperback. One line for Biscuit, his corgi. Dated Now line under the locked bio.
- **Now** — Dated, replaceable. Seed: `Sep 2026 — Building Estuary Systems. Company site: estuarysystems.ai.` Westgate was Sep 5–6. Next: Collect-A-Con, Sep 12–13. Contact / next-step lives here (`george@estuarysystems.ai`). Social Club lives on Poker.
- **Biscuit** — Small me item. His corgi. Short, warm, first person. No “Pictures later” / TODO line. Photos only when there are real ones; do not generate a dog photo. Reuse the me paperback; no fake object.
- **Library** — S and A only. Do not rank inside a tier. Do not list B/C. “If it is not here, I am not recommending it.” S: *Poor Charlie's Almanack* — Charlie Munger (he thinks the world runs on economics; this is how he understands it); *Broken Money* — Lyn Alden (same reason). A: none yet.

### world
- **Dress** — People often embody the success they want before they earn it. Dress is one way. Seven people in suits, one without: that person is usually the most important. That idea leaked into tech as a casual “successful engineer” costume. He thinks that is a bad equilibrium. Dress like you care how you show up; dress like you intend to be pleasant to be around.
- **Pictures** — It is disrespectful to take pictures or videos of people who did not ask. Keep the Killer Kodaks link. Live essay. Keep it high.
- **Home** — A home that is kept, not staged. A stay-at-home spouse is not a luxury brand and not a political costume. He is building toward that household. Care is work. A dual-career grind is not the same thing as a family.
- **School** — College is a bad default place to send a kid and a bad default way to spend years. Better path: apprenticeship, a business, a tool someone will pay for. He will not send a kid into debt to “find themselves.”

### work
- **Claims** — A lot of good claims never get taken. Building software so those claims can still be litigated. No Conveyor, no client names, no dollar amounts, no retainers. Sharpest proof; first on the shelf.
- **Estuary** — He runs it. Help companies catch up on AI without getting lost in tools. Company site: https://estuarysystems.ai. No agency jargon (“execution,” “latest tools,” “efficient”). No claims, no Conveyor, no clients, no dollar amounts, no retainers.
- **Business sense** — After Estuary. Done-With-You. Using AI well is business sense, not a prompt trick. Contact: george@estuarysystems.ai. No client names, no dollar amounts, no retainers.

### hobby
- **Cards** — Pokémon cards. Monthly shows. Practice, not a portfolio. Westgate was Sep 5–6, 2026. Collect-A-Con is Sep 12–13. First on the shelf.
- **Party / mystery** — Slot after Cards if a live essay exists. Hide if empty. Do not invent it.
- **Server** — Minecraft. Season 0: Sakura Tide. Delayed on purpose until it deserves to be on. Status: Season 0 · Sakura Tide. Not a launch.
- **Poker** — SF Social Club. Poker is how you find out how you act when it costs something. Then you go home. No stakes.
- **TFT** — Top 100 once. Set 11. One short line. A link and how it impacted him later (he will add).

Sports (bouldering, badminton) stay off the bar until there is something to say besides “I do this.”

## Object-icons (first cut)

| Shelf  | Object                         |
|--------|--------------------------------|
| me     | A paperback                    |
| world  | A pressed shirt on a hanger    |
| work   | A manila case folder           |
| hobby  | A Pokémon card in a sleeve     |

## Out of scope (v0)

CMS, comments, newsletter, tags, search, RSS (add after ≥3 world essays), social icon row, analytics beyond a quiet page hit, a fifth shelf, auth.

## Open

- Light / dark / auto (default: auto)
- Stack: static home + MDX essays on Vercel. No backend.
