# baseplate.gg — Roblox Studio AI Agent & GUI Forge (`v2.4`)

Official TypeScript + React web workspace for **Baseplate.gg**, the open creator AI coding assistant and 9-slice `ScreenGui` generator built for **Roblox Studio**.

## Key Capabilities

- **Baseplate-R3 Luau Engine:** Generates multi-script `--!strict` Luau 0.654 systems (`ServerScriptService`, `ReplicatedStorage`, `StarterPlayerScripts`) with server-authoritative `RemoteEvent` validation.
- **Bidirectional Auto-Sync Bridge:** Connects to Roblox Studio via local loopback (`ws://127.0.0.1:38412`) or `BaseplateMCP` for live `@Explorer` context mentions.
- **9-Slice GUI Forge:** Responsive `UDim2.fromScale()` frames, `UICorner`, `UIStroke`, and `TweenService` controllers with native `.rbxmx` XML export.
- **Playtest Viewport:** Interactive 3D Baseplate preview and runtime mechanic sandbox directly in the browser.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```
