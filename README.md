# @wornpage/data-display

Compact Svelte 5 badges, chips, avatars, progress indicators, and timelines for application workflows.
The package is source-delivered so consuming SvelteKit applications compile it with their
own theme tokens and CSP policy.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```sh
bun add @wornpage/data-display
```

## Usage

```svelte
<script>
  import { Avatar, Badge, Chip, Progress, Timeline } from '@wornpage/data-display';

  let active = $state(false);
  const releases = [
    { iter: 2, date: '2026-08-14', title: 'Timeline ships', description: 'Release history is now reusable.' },
    { iter: 1, date: '2026-08-01', title: 'First release', description: 'The project goes live.' }
  ];
</script>

<Badge label="In review" variant="accent" />
<Chip label="Assigned to me" count={8} pressed={active} onclick={() => (active = !active)} />
<Avatar name="Ada Lovelace" status="online" />
<Progress value={7} max={10} label="Review complete" />
<Timeline entries={releases} />
```

## Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Visible status text |
| `variant` | `default \| warn \| accent \| muted` | `default` | Visual tone |
| `size` | `sm \| md` | `md` | Compact visual size |
| `class` | `string` | empty | Additional root class |
| `title` | `string` | - | Native title |

Badge labels wrap within their parent, including unbroken identifiers.

## Chip

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Visible label |
| `count` | `number` | - | Optional count |
| `pressed` | `boolean` | - | Optional toggle state |
| `size` | `sm \| md` | `md` | Visual size |
| `variant` | `default \| danger` | `default` | Visual tone |
| `onclick` | `(event: MouseEvent) => void` | - | Renders a native button |
| `ondragover` | `(event: DragEvent) => void` | - | Drag-over handler |
| `ondragleave` | `(event: DragEvent) => void` | - | Drag-leave handler |
| `ondrop` | `(event: DragEvent) => void` | - | Drop handler |

Without `onclick`, Chip renders a compact display-only span. With `onclick`, it renders a native
44px button; supplying `pressed` adds toggle semantics, while omitting it keeps one-shot commands
as ordinary buttons. Long labels stay contained and transitions stop under reduced motion.

## Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | empty | Identity and initials source |
| `email` | `string` | empty | Identity fallback |
| `src` | `string` | empty | Optional image URL |
| `size` | `sm \| md \| lg` | `md` | Avatar size |
| `status` | `online \| away \| offline` | `offline` | Accessible presence state |
| `class` | `string` | empty | Additional root class |

Avatar owns one accessible image name. Failed image loads fall back to deterministic initials,
including failures that complete before client hydration; all palette colors retain at least 4.5:1
contrast with white initials.

## Progress

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current value |
| `max` | `number` | `100` | Positive maximum |
| `label` | `string` | - | Visible and accessible label |
| `size` | `sm \| md` | `md` | Track size |
| `variant` | `default \| accent \| warn \| danger` | `default` | Fill tone |

Progress normalizes invalid ranges, clamps visual and ARIA values together, contains hostile
labels, uses CSP-safe width buckets, and disables width transitions under reduced motion.

## Timeline

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entries` | `TimelineEntry[]` | required | Rows in display order |
| `badgePrefix` | `string` | `#` | Prefix for iteration badges |
| `ariaLabel` | `string` | `Release history` | Accessible ordered-list name |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Entry-title heading rank |
| `formatDate` | `(value: string) => string` | `formatTimelineDate` | Visible date formatter |
| `class` | `string` | empty | Additional root class |

`TimelineEntry` requires `title`; `iter`, `date`, `description`, `href`, and `meta` are optional.
Entries with `iter` retain the numbered release badge. Entries with `href` render as native linked
cards with a 44px target and visible keyboard focus; entries without `href` remain articles. Set
`--worn-timeline-max-inline-size` on a container when a product timeline should exceed the default
readable width.

Timeline exposes native ordered-list, list-item, article, heading, and time semantics. Decorative
tracks stay out of the accessibility tree. Hostile labels and entries wrap inside the component,
compact descriptions stop at three lines, theme tokens have standalone fallbacks, and entry motion
and linked-card transitions are disabled under reduced motion.
