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

**Essay.** A normal reading page. Shareable path is `/<shelf>/<slug>`. One Escape / Back `replace`s to the same home URL (`/?shelf=&item=`) in shelf mode, with the collapse visible — so Back never bounces between the two shapes. Prev/next siblings on the same shelf.

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
- Home URL is one shape: `/?shelf=<id>&item=<slug>`. Focus lives there; item-column vs shelf is local UI, not a second URL. Write both params whenever focus moves (↑↓ shelves, ←→ items).
- First-visit hint: up/down chevrons + `↑↓ shelves · ←→ items · enter opens · esc back`. Gone after the first move.

### Me card

The only home card that may hold a short essay in place. Longer bio is an essay.

**Bio (locked, his voice):**

George Lu. Bay Area. I work the intersection of business and engineering through my AI agency, Estuary Systems LLC.

I have a corgi named Biscuit.

Under that, a dated **Now** line (present tense, specific, replaceable). Sourced from the Now item `status`. Locked copy: `Aug 2026 — Building Estuary Systems and shipping estuarysystems.ai as a plain company site.` Do not gut the locked bio. Optional thin handoff (Now / Estuary, not a pitch): `Company work is at estuarysystems.ai.` Never use “Hi I'm George / bring execution to you and your team / review your systems.”

No claims-system line. No “stuff on my mind” list. Contact / next-step lives on Now, not a fifth shelf.

### Inside-shelf priority

Items inside a shelf are ordered by priority, not chronology.

| Shelf | Order |
|-------|-------|
| me    | George → Now → Biscuit → Library |
| world | Dress → Pictures → Home → School (hide empty) |
| work  | Claims high, then Estuary |
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
- **Now** — Dated, replaceable. Seed: `Aug 2026 — Building Estuary Systems and shipping estuarysystems.ai as a plain company site.` Thin handoff: `Company work is at estuarysystems.ai.` Westgate September 5–6. Contact / next-step lives here (`george@estuarysystems.ai`). Social Club lives on Poker.
- **Biscuit** — Small me item. His corgi. Short, warm, first person. No “Pictures later” / TODO line. Photos only when there are real ones; do not generate a dog photo. Reuse the me paperback; no fake object.
- **Library** — S and A only. Do not rank inside a tier. Do not list B/C. “If it is not here I am not recommending it.” S: *Poor Charlie’s Almanack* (Charlie Munger); *Broken Money* by Lyn Alden (he thinks the world runs on economics; this is how he understands it). A: none yet.

### world
- **Dress** — People embody the success they want before they take action. Dressing is one way. The room with seven suits and one person without: that person is the most important. That idea is why tech dresses casually. He thinks that is a bad thing. Dress to show you care, and that you want to be pleasant to be around.
- **Pictures** — It is disrespectful to take pictures or videos of people. Live essay. Keep it high.
- **Home** — Why a stay-at-home spouse matters to him. Write it as an argument about care and a life, not a culture-war post. Stay-at-home cost-comparison link later (he will add).
- **School** — College is a bad place to send a kid and a bad way to spend years. Building and doing business in the real world is the better path. Full rewrite later (he will write it): start doing stuff, provide value, find problems; judged on solving problems, especially guys. Leave the live essay as-is until then.

### work
- **Claims** — Leave as-is. Do not expand. No Conveyor or client names. A system to litigate claims law firms will not take. Fighting for the small guy. Sharpest proof; first on the shelf.
- **Estuary** — Short handoff: he runs it; the work is at https://estuarysystems.ai. No agency jargon (“execution,” “latest tools,” “efficient”). No claims, no Conveyor, no clients, no dollar amounts.

### hobby
- **Cards** — Pokémon. Next show: Westgate, September 5–6 2026, Saturday–Sunday. Dated, replaceable. This is a real practice, not a childhood footnote. First on the shelf.
- **Party / mystery** — Slot after Cards if a live essay exists. Hide if empty. Do not invent it.
- **Server** — The Minecraft server he never got to run as a kid. Building it now. Status: Season 0 · Sakura Tide. Not a launch.
- **Poker** — He plays poker. SF Social Club is part of that scene. “A lot of things” stay vague. No stakes. Principles later (he will write them). Do not invent those write-ups.
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
