import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Dusk over a meadow: deep indigo grays, firefly-gold accent.
const { theme, problems } = makeColors({
  label: 'Firefly meadow',
  only: 'dark',
  roles: { accent: '#e8c45a', danger: '#e07a6a', success: '#8fc47a', warning: '#e0a24e', pro: '#a98fd6' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#15142a',
        'surface-1': '#1c1a33',
        'surface-2': '#221f3b',
        'surface-3': '#282443',
        'text-primary': '#f3ecd9',
        'text-secondary': '#d2c9b6',
        'text-muted': '#aaa194',
      },
    },
  },
})

const SCENE = 'firefly-meadow'
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: SCENE, glass: { blur: 14, tint: '#15142a', opacity: 0.55 } },
}

// Context fill, in whole percent, bucketed to 5 so the scene redraws gently.
const fill = atom({ plugin: 'firefly-meadow', key: 'fill' } as const, 0)

const BASE = 8
const MAX_EXTRA = 64

const bucket = (percent: number | undefined) =>
  Math.max(0, Math.min(100, Math.round((percent ?? 0) / 5) * 5))

// Small seeded RNG so each firefly keeps its place as more arrive.
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

const fireflies = (count: number) => {
  const r = rng(7)
  let out = ''
  for (let i = 0; i < count; i++) {
    const x = 40 + r() * 1520
    const y = 300 + r() * 520
    const size = 2.2 + r() * 2.4
    const drift = 1 + Math.floor(r() * 4)
    const dDur = (14 + r() * 16).toFixed(1)
    const gDur = (3.5 + r() * 4).toFixed(1)
    const dDel = (-r() * 30).toFixed(1)
    const gDel = (-r() * 8).toFixed(1)
    out +=
      `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">` +
      `<g class="d${drift}" style="animation-duration:${dDur}s;animation-delay:${dDel}s">` +
      `<g class="g" style="animation-duration:${gDur}s;animation-delay:${gDel}s">` +
      `<circle r="${(size * 4).toFixed(1)}" fill="url(#halo)"/>` +
      `<circle r="${size.toFixed(1)}" fill="#fff3b0"/>` +
      `</g></g></g>`
  }
  return out
}

const stars = (() => {
  const r = rng(42)
  let out = ''
  for (let i = 0; i < 60; i++) {
    out += `<circle cx="${(r() * 1600).toFixed(0)}" cy="${(r() * 330).toFixed(0)}" r="${(0.6 + r() * 1.1).toFixed(1)}" fill="#fdf6e3" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`
  }
  return out
})()

const grass = (() => {
  const r = rng(99)
  let out = ''
  for (let i = 0; i < 140; i++) {
    const x = (i / 140) * 1600 + r() * 10
    const h = 30 + r() * 70
    const lean = (r() - 0.5) * 30
    out += `<path d="M${x.toFixed(0)} 900 Q${(x + lean / 2).toFixed(0)} ${(900 - h / 2).toFixed(0)} ${(x + lean).toFixed(0)} ${(900 - h).toFixed(0)}" stroke="#0b0a17" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  }
  return out
})()

const scene = (count: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#0f0e26"/>
<stop offset="0.45" stop-color="#2a2150"/>
<stop offset="0.72" stop-color="#6a3f67"/>
<stop offset="0.9" stop-color="#c47a5a"/>
</linearGradient>
<radialGradient id="halo">
<stop offset="0" stop-color="#ffe98a" stop-opacity="0.85"/>
<stop offset="0.35" stop-color="#e8d25a" stop-opacity="0.35"/>
<stop offset="1" stop-color="#c8d24a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="moonglow">
<stop offset="0" stop-color="#fbe9c8" stop-opacity="0.5"/>
<stop offset="1" stop-color="#fbe9c8" stop-opacity="0"/>
</radialGradient>
</defs>
<style>
.g { opacity: 0.8; animation-name: glow; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
.d1, .d2, .d3, .d4 { animation-iteration-count: infinite; animation-timing-function: ease-in-out; animation-direction: alternate; }
.d1 { animation-name: d1; } .d2 { animation-name: d2; } .d3 { animation-name: d3; } .d4 { animation-name: d4; }
@keyframes glow { 0%, 100% { opacity: 0.15; } 45% { opacity: 1; } 60% { opacity: 0.9; } }
@keyframes d1 { from { transform: translate(0px, 0px); } to { transform: translate(60px, -40px); } }
@keyframes d2 { from { transform: translate(0px, 0px); } to { transform: translate(-50px, -30px); } }
@keyframes d3 { from { transform: translate(0px, 0px); } to { transform: translate(30px, 45px); } }
@keyframes d4 { from { transform: translate(0px, 0px); } to { transform: translate(-40px, 35px); } }
.sway { animation: sway 9s ease-in-out infinite alternate; transform-origin: 800px 900px; }
@keyframes sway { from { transform: skewX(-1deg); } to { transform: skewX(1deg); } }
</style>
<rect width="1600" height="900" fill="url(#sky)"/>
${stars}
<circle cx="1280" cy="150" r="90" fill="url(#moonglow)"/>
<circle cx="1280" cy="150" r="26" fill="#f6e4c2" opacity="0.9"/>
<path d="M0 640 C 250 560 480 600 720 620 S 1200 560 1600 600 L1600 900 L0 900 Z" fill="#2b2140"/>
<path d="M0 720 C 300 650 600 700 900 690 S 1350 650 1600 700 L1600 900 L0 900 Z" fill="#1c1730"/>
<path d="M0 800 C 400 760 800 790 1100 780 S 1450 770 1600 790 L1600 900 L0 900 Z" fill="#110f20"/>
${fireflies(count)}
<g class="sway">${grass}</g>
</svg>`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const usage = await $.session.usage()
    await update($, fill, () => bucket(usage.context.percent))
    const set = await $.theme.set(LOOK)
    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('context')) {
      const b = bucket(e.context.percent)
      await update($, fill, old => (old === b ? old : b))
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const percent = await read($, fill)
    const count = BASE + Math.round((percent / 100) * MAX_EXTRA)

    return (
      <Svg
        source={scene(count)}
        alt={`Fireflies drifting over a meadow at dusk, ${count} of them`}
      />
    )
  })
}
