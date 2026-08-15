# Personal site — spec v0.2

**Domain:** georgelu.ai
**Owner:** George Lu

A hobby-resume you drive like a console. Home is a vertical XMB. Clicking in opens an essay. Not a job hunt.

## Intent

Someone leaves able to say: George works the seam between business and engineering, he is building real things (an AI agency, a claims tool for people law firms will not take), and he has a pointed view of how people should live (dress, family, school vs building).

Tone: warm, very direct. He will say the sharp thing and mean it. Not a dunk account. Not a personal brand kit.

## Off the site

Do not publish: Elon support, Bitcoin-believer identity, Palo Alto (say Bay Area), traveling-as-hobby, anything framed as “coming soon.”

Bitcoin may become a world essay later. It is not on the v0 bar.

## Machine

Two surfaces only.

**Home.** Full viewport (`100dvh`). Four shelves in a **vertical column**, top to bottom. All four stay at full opacity. No distance fade, no blur-on-distance. Up/down changes shelf. Enter or right opens that shelf’s items; up/down then moves items. Mouse and touch: click/tap. Keyboard is first-class (arrows, enter, escape).

**Essay.** A normal reading page. Back returns to the same focus you left. Prev/next siblings on the same shelf.

No blog index, no tags, no search in v0.

## Shelves

Vertical column, top to bottom:

| Shelf   | Job                         | Opens |
|---------|-----------------------------|-------|
| me      | Who he is                   | Stay or essay |
| world   | What he thinks is important | Essay |
| work    | What he has built for money or a client | Essay |
| making  | Hobbies and things he keeps | Essay |

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

The only home card that may hold a short essay in place: name, 2–4 sentences, then a short list. Longer bio is an essay.

**Bio (draft, edit in his voice):**

George Lu. Bay Area. I work the seam between business and engineering. I take on problems I can see, then build the company or the tool.

Right now that is Estuary Systems, an AI agency, and a claims system for people law firms will not represent.

Stuff on my mind: how people dress and carry themselves. Building in the real world instead of collecting credentials. Privacy and security in a world of new AI products.

## Essay page

- Max width ~640–720px. Prose column `58ch`.
- Top bar: `esc` / back, frame number (`03 / 12`).
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

Warm. Direct. First person. Short sentences. One idea per essay. He can be sharp; he does not perform contempt. No “passionate about.” No “responsible for.” Work entries are dated and specific. World essays argue. Making entries show the thing.

## v0 contents

### me
- **George** — bio card (required). Object: a well-made shoe, or a paperback, or a single playing card. Pick one physical thing he actually owns.
- **Now** — SF Social Club, books, the monthly card show. Short, dated, replaceable.

### world
- **Dress** — Bringing back the social norm of looking like you meant to leave the house. The America in good books and movies, where people wear clothes on purpose.
- **Home** — Why a stay-at-home spouse matters to him. Write it as an argument about care and a life, not a culture-war post.
- **School** — College is a bad place to send a kid and a bad way to spend years. Building and doing business in the real world is the better path.

### work
- **Estuary** — The AI agency. What he actually does there. New AI products, with a real interest in security and privacy, not a market take.
- **Claims** — A system to litigate claims law firms will not take. Fighting for the small guy. This is the clearest “why I build” piece.

### making
- **Cards** — Pokémon. Card shows every month. This is a real practice, not a childhood footnote.
- **Server** — The Minecraft server he never got to run as a kid. Building it now.
- **Poker** — Hobby, and the SF Social Club scene. Play, not hustle-porn.
- **TFT** — Top 100 once. One short page. Proof he will grind a system.

Sports (bouldering, badminton) stay off the bar until there is something to say besides “I do this.”

## Object-icons (first cut)

| Shelf  | Object                         |
|--------|--------------------------------|
| me     | One owned object (shoe / book / card) |
| world  | A pressed shirt on a hanger    |
| work   | A manila case folder           |
| making | A Pokémon card in a sleeve     |

## Out of scope (v0)

CMS, comments, newsletter, tags, RSS (add after ≥3 world essays), social icon row, analytics beyond a quiet page hit, a fifth shelf.

## Open

- Which owned object is the me icon
- Light / dark / auto (default: auto)
- Stack: static home + MDX essays on Vercel. No backend.
