# Personal site — spec v0.2

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

**Home.** Full viewport (`100dvh`). Four shelves in a **vertical column**, top to bottom. All four stay at full opacity. No distance fade, no blur-on-distance. Up/down changes shelf. Enter or right opens that shelf’s items; up/down then moves items. Mouse and touch: click/tap. Keyboard is first-class (arrows, enter, escape).

**Essay.** A normal reading page. Back returns to the same focus you left. Prev/next siblings on the same shelf.

Unlisted `/all` is a flat essay list by shelf. Not on the bar. No tags, no search, no comments.

## Shelves

Vertical column, top to bottom:

| Shelf   | Job                         | Opens |
|---------|-----------------------------|-------|
| me      | Who he is                   | Stay or essay |
| world   | What he thinks is important | Essay |
| work    | What he has built for money or a client | Essay |
| hobby   | Hobbies and things he keeps | Essay |

Default focus: **me**.

Focused item may scale `0.78 → 1` and unfold a short blurb beside a 144px object-icon (88px on small screens). Unfocused shelves stay fully readable, just not expanded.

## Home, in detail

- Stage is one scene. No document scroll.
- Shelf column on the left. All four labels visible, tracked, small, capitalized.
- Viewfinder cursor: 1px corner brackets, 14px arms, ~50% opacity.
- Active item: object-icon + short name + one-line title + optional 1–2 sentence blurb.
- Enter / click opens the essay if one exists.
- First-visit hint: up/down chevrons + `arrow keys or click`. Gone after the first move.

### Me card

The only home card that may hold a short essay in place. Longer bio is an essay.

**Bio (locked, his voice):**

George Lu. Bay Area. I work the intersection of business and engineering through my AI agency, Estuary Systems LLC.

I have a corgi named Biscuit.

No claims-system line. No “stuff on my mind” list.

## Essay page

- Max width ~640–720px. Prose column `58ch`.
- Top bar: `esc` / back, frame number (`03 / 13`).
- Title, optional dek, body. Images are objects, not heroes.
- Footer: prev / next on the same shelf, lowercase.
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
- **George** — bio card (required). Object: a paperback. One line for Biscuit, his corgi.
- **Biscuit** — Small me item. His corgi. Short, warm, first person. No photo until he sends pictures. Do not generate a dog photo. Reuse the me paperback; no fake object.
- **Now** — Westgate card show (September 5–6 2026), books. Short, dated, replaceable. Social Club lives on Poker.
- **Library** — S and A only. Do not rank inside a tier. Do not list B/C. “If it is not here I am not recommending it.” Write-ups later. S: *Poor Charlie’s Almanack* (Charlie Munger); *Broken Money* by Lyn Alden (he thinks the world runs on economics; this is how he understands it). A: none yet.

### world
- **Dress** — People embody the success they want before they take action. Dressing is one way. The room with seven suits and one person without: that person is the most important. That idea is why tech dresses casually. He thinks that is a bad thing. Dress to show you care, and that you want to be pleasant to be around.
- **Home** — Why a stay-at-home spouse matters to him. Write it as an argument about care and a life, not a culture-war post. Stay-at-home cost-comparison link later (he will add).
- **School** — College is a bad place to send a kid and a bad way to spend years. Building and doing business in the real world is the better path. Full rewrite later (he will write it): start doing stuff, provide value, find problems; judged on solving problems, especially guys. Leave the live essay as-is until then.

### work
- **Estuary** — One sentence only: he focuses on execution using AI and stays up to date on the latest AI tools to be efficient. Link out to https://estuarysystems.ai. No claims, no Conveyor, no clients, no dollar amounts.
- **Claims** — Leave as-is. Do not expand. No Conveyor or client names. A system to litigate claims law firms will not take. Fighting for the small guy.

### hobby
- **Cards** — Pokémon. Next show: Westgate, September 5–6 2026, Saturday–Sunday. Dated, replaceable. This is a real practice, not a childhood footnote.
- **Server** — The Minecraft server he never got to run as a kid. Building it now.
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
