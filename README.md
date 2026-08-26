# @wornpage/data-display

Compact Svelte 5 badges, chips, avatars, metrics, progress indicators, and timelines for application workflows.
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
  import { Avatar, Badge, Chip, Metric, MetricGrid, Progress, Timeline } from '@wornpage/data-display';

  let active = $state(false);
  const releases = [
    { iter: 2, date: '2026-08-14', title: 'Timeline ships', description: 'Release history is now reusable.' },
    { iter: 1, date: '2026-08-01', title: 'First release', description: 'The project goes live.' }
  ];
</script>

<Badge label="In review" variant="accent" />
<Chip label="Assigned to me" count={8} pressed={active} onclick={() => (active = !active)} />
<Avatar name="Ada Lovelace" status="online" />
<MetricGrid ariaLabel="Project health">
  <Metric label="Completed" value="73%" description="11 of 15 work items">
    <Progress value={11} max={15} ariaLabel="11 of 15 work items complete" size="sm" />
  </Metric>
</MetricGrid>
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
Muted badges pair `--worn-text-muted` with `--worn-bg-secondary`; override them together with colors that preserve small-text contrast.

## Chip

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Visible label |
| `count` | `number` | - | Optional count |
| `href` | `string` | - | Renders a native link with the complete touch and focus treatment |
| `pressed` | `boolean` | - | Optional toggle state |
| `dragOver` | `boolean` | `false` | High-visibility drag-over state on the root |
| `size` | `sm \| md` | `md` | Visual size |
| `variant` | `default \| danger` | `default` | Visual tone |
| `onclick` | `(event: MouseEvent) => void` | - | Renders a native button |
| `ondragover` | `(event: DragEvent) => void` | - | Drag-over handler |
| `ondragleave` | `(event: DragEvent) => void` | - | Drag-leave handler |
| `ondrop` | `(event: DragEvent) => void` | - | Drop handler |

With `href`, Chip renders a native 44px link. With `onclick`, it renders a native 44px button;
supplying `pressed` adds toggle semantics, while omitting it keeps one-shot commands as ordinary
buttons. Complete labels wrap within the Chip instead of being hidden behind an ellipsis. Without
either prop, Chip remains a compact display-only span. Long labels stay contained and transitions
stop under reduced motion.

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
| `ariaLabel` | `string` | - | Accessible name when a visible label would duplicate surrounding text |
| `size` | `sm \| md` | `md` | Track size |
| `variant` | `default \| accent \| muted \| warn \| danger` | `default` | Fill tone |

Progress normalizes invalid ranges, clamps visual and ARIA values together, and contains hostile
labels. It paints the exact clamped fraction without an inline style, using a decorative CSP-safe
SVG width attribute instead of rounded bucket classes. Default and accent fills retain their theme
hue while maintaining at least 3:1 fill-to-track contrast across supported themes, and width
transitions stop under reduced motion.

Use `--worn-progress-track` and `--worn-progress-fill` to override the shared visual. The accent,
muted, warning, and danger variants additionally accept `--worn-progress-accent-fill`,
`--worn-progress-muted-fill`, `--worn-progress-warn-fill`, and `--worn-progress-danger-fill`.

## Metrics

`MetricGrid` renders a named semantic list with responsive tracks. Pair it with `Metric` for
compact summary values.

| MetricGrid prop | Type | Default | Description |
|-----------------|------|---------|-------------|
| `ariaLabel` | `string` | required | Accessible list name |
| `mobileColumns` | `1 \| 2` | `1` | Number of columns at viewport widths up to 420 px |
| `class` | `string` | empty | Additional root class |

Set `mobileColumns={2}` when compact metrics should remain paired on narrow screens. The default
stays one column at 420 px and below; wider layouts retain the automatic fitting behavior.

`Metric` accepts `label`, `value`, optional `description`, a
`default | success | warning` tone, and optional child content such as `Progress`. Both surfaces
contain hostile text without relying on consumer CSS.

## Timeline

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entries` | `TimelineEntry[]` | required | Rows in display order |
| `badgePrefix` | `string` | `#` | Prefix for iteration badges |
| `ariaLabel` | `string` | `Release history` | Accessible ordered-list name |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Entry-title heading rank |
| `density` | `default \| compact` | `default` | Release or operational row density |
| `formatDate` | `(value: string) => string` | `formatTimelineDate` | Visible date formatter |
| `titleContent` | `Snippet<[TimelineEntry, number]>` | - | Optional structured title content; `title` remains its accessible fallback |
| `class` | `string` | empty | Additional root class |

`TimelineEntry` requires `title`; `iter`, `date`, `description`, `href`, and `meta` are optional.
Entries with `iter` retain the numbered release badge. Entries with `href` render as native linked
cards with a 44px target and visible keyboard focus; entries without `href` remain articles. Use
`--worn-timeline-focus` to override the linked-card focus color; it otherwise follows the host focus
or text token. Set `--worn-timeline-max-inline-size` on a container when a product timeline should
exceed the default readable width.

Timeline exposes native ordered-list, list-item, article, heading, and time semantics. Decorative
tracks stay out of the accessibility tree. Hostile labels and entries wrap inside the component,
compact content stacks below its date and stops at three lines on narrow screens, theme tokens have
standalone fallbacks, and rows render in their final position without presentation-only entrance
motion. Linked-card transitions are disabled under reduced motion. Use `titleContent` for structured
inline content such as mention links; keep `entry.href` empty when that content is interactive so
the component never creates nested links.
