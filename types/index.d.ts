export type Fill = number

declare module 'claude-code' {
  interface PluginState {
    'firefly-meadow': { fill: Fill }
  }
}
