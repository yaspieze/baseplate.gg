import { GeneratedSystem, SHOWCASE_PRESETS, SceneArchetype } from '../data/presets';

function toPascalCase(input: string): string {
  const words = input
    .replace(/@[A-Za-z0-9_.]+/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['make', 'build', 'create', 'with', 'that', 'the', 'and', 'for', 'into', 'from', 'game', 'system', 'using'].includes(w.toLowerCase()))
    .slice(0, 3);

  if (words.length === 0) return 'CustomMechanic';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function detectArchetype(prompt: string): { scene: SceneArchetype; accent: string; genre: string } {
  const p = prompt.toLowerCase();
  if (/(gun|shoot|fps|sniper|rifle|rivals|weapon|aim|crosshair)/.test(p)) {
    return { scene: 'rivals', accent: '#00A2FF', genre: 'Shooter game' };
  }
  if (/(blade|parry|deflect|sword|katana|dodge|combat|slash)/.test(p)) {
    return { scene: 'blade', accent: '#FF3B5C', genre: 'Combat arena' };
  }
  if (/(horror|scary|monster|night|campfire|flashlight|door|survive|zombie|tsunami)/.test(p)) {
    return { scene: 'horror', accent: '#FFB300', genre: 'Survival game' };
  }
  if (/(pet|egg|hatch|critter|inventory|trade)/.test(p)) {
    return { scene: 'pets', accent: '#A855F7', genre: 'Pet simulator' };
  }
  if (/(aura|rng|roll|luck|cutscene|brainrot|cart)/.test(p)) {
    return { scene: 'aura', accent: '#38BDF8', genre: 'RNG / Aura' };
  }
  if (/(bed|bridge|wool|team|obby|checkpoint|lava|jump|tower)/.test(p)) {
    return { scene: 'bedwars', accent: '#F97316', genre: 'Action / Obby' };
  }
  if (/(murder|sheriff|mystery|role|round|admin|ban|cmd)/.test(p)) {
    return { scene: 'mystery', accent: '#EF4444', genre: 'Round / Admin' };
  }
  return { scene: 'garden', accent: '#00E676', genre: 'Simulator' };
}

export function synthesizeSystemFromPrompt(rawPrompt: string): GeneratedSystem {
  const trimmed = rawPrompt.trim();

  // Exact or close preset match
  const exact = SHOWCASE_PRESETS.find(
    (p) => p.prompt.toLowerCase() === trimmed.toLowerCase() || p.title.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;

  const pascal = toPascalCase(trimmed);
  const { scene, accent, genre } = detectArchetype(trimmed);
  const mentions = Array.from(trimmed.matchAll(/@([A-Za-z0-9_]+)/g)).map((m) => m[1]);
  const mentionSummary = mentions.length > 0 ? `@${mentions.join(', @')}` : '@Workspace, @ReplicatedStorage, @ServerScriptService, @StarterGui';

  return {
    id: `custom-${Date.now()}`,
    title: `${pascal} Suite`,
    genre,
    shortTag: 'CUSTOM AI BUILD',
    ccu: 'LIVE',
    creator: '@You',
    prompt: trimmed,
    accent,
    sceneType: scene,
    summary: `Synthesized server-authoritative ${pascal} architecture across ${mentionSummary} with RemoteEvent rate-limiting, leaderstats persistence, and animated UICorner/UIStroke HUD.`,
    thinkingSteps: [
      `Indexing active Studio Explorer context (${mentionSummary})...`,
      `Planning server-authoritative state machine for "${trimmed.slice(0, 68)}${trimmed.length > 68 ? '...' : ''}"...`,
      `Generating --!strict Luau modules with exploit-safe RemoteEvent sanity checks...`,
      `Building responsive UDim2 Scale ScreenGui + TweenService spring animations...`,
    ],
    explorerItems: [
      { id: 'c1', name: `${pascal}WorldZone`, className: 'Folder', parentService: 'Workspace', isNew: true },
      { id: 'c2', name: `${pascal}Remotes`, className: 'Folder', parentService: 'ReplicatedStorage', isNew: true },
      { id: 'c3', name: `${pascal}Action`, className: 'RemoteEvent', parentService: 'ReplicatedStorage', isNew: true },
      { id: 'c4', name: `${pascal}Config`, className: 'ModuleScript', parentService: 'ReplicatedStorage', linesAdded: 36, isNew: true },
      { id: 'c5', name: `${pascal}Server`, className: 'Script', parentService: 'ServerScriptService', linesAdded: 94, isNew: true },
      { id: 'c6', name: `${pascal}Controller`, className: 'LocalScript', parentService: 'StarterPlayerScripts', linesAdded: 68, isNew: true },
      { id: 'c7', name: `${pascal}Gui`, className: 'ScreenGui', parentService: 'StarterGui', isNew: true },
    ],
    scripts: [
      {
        name: `${pascal}Server`,
        className: 'Script',
        parentService: 'ServerScriptService',
        code: `--!strict
-- Auto-Synced by Baseplate.gg Studio Bridge v2.4
-- Prompt: ${trimmed.replace(/\n/g, ' ')}
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")

local Config = require(ReplicatedStorage:WaitForChild("${pascal}Config"))
local Remotes = ReplicatedStorage:WaitForChild("${pascal}Remotes")
local ActionRemote = Remotes:WaitForChild("${pascal}Action") :: RemoteEvent

local Store = DataStoreService:GetDataStore("${pascal}_Prod_v1")
local cooldowns: { [Player]: number } = {}

Players.PlayerAdded:Connect(function(player: Player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local coins = Instance.new("IntValue")
	coins.Name = Config.CurrencyName
	coins.Value = Config.StartingBalance
	coins.Parent = leaderstats

	local level = Instance.new("IntValue")
	level.Name = "Level"
	level.Value = 1
	level.Parent = leaderstats

	local ok, saved = pcall(function()
		return Store:GetAsync("u_" .. tostring(player.UserId))
	end)
	if ok and type(saved) == "table" then
		coins.Value = saved.Balance or Config.StartingBalance
		level.Value = saved.Level or 1
	end
end)

ActionRemote.OnServerEvent:Connect(function(player: Player, command: string, payload: any)
	local now = os.clock()
	if now - (cooldowns[player] or 0) < Config.RateLimitSeconds then
		return -- Server rate-limit guard
	end
	cooldowns[player] = now

	local stats = player:FindFirstChild("leaderstats")
	local coins = stats and stats:FindFirstChild(Config.CurrencyName) :: IntValue?
	local level = stats and stats:FindFirstChild("Level") :: IntValue?
	if not coins or not level then return end

	if command == "TriggerPrimary" then
		local gain = math.floor(Config.BaseReward * (1 + (level.Value - 1) * 0.35))
		coins.Value += gain
		ActionRemote:FireClient(player, "StateSynced", {
			Reward = gain,
			Balance = coins.Value,
			Level = level.Value,
			PromptTag = "${pascal}",
		})
	elseif command == "UpgradeTier" then
		local cost = level.Value * Config.UpgradeStepCost
		if coins.Value >= cost then
			coins.Value -= cost
			level.Value += 1
			ActionRemote:FireClient(player, "UpgradeSuccess", level.Value, coins.Value)
		end
	end
end)

Players.PlayerRemoving:Connect(function(player: Player)
	cooldowns[player] = nil
	local stats = player:FindFirstChild("leaderstats")
	if not stats then return end
	local coins = stats:FindFirstChild(Config.CurrencyName) :: IntValue?
	local level = stats:FindFirstChild("Level") :: IntValue?
	if coins and level then
		pcall(function()
			Store:SetAsync("u_" .. tostring(player.UserId), {
				Balance = coins.Value,
				Level = level.Value,
			})
		end)
	end
end)`,
      },
      {
        name: `${pascal}Config`,
        className: 'ModuleScript',
        parentService: 'ReplicatedStorage',
        code: `--!strict
-- Shared tuning configuration for ${pascal} Suite
export type SystemTuning = {
	SystemName: string,
	CurrencyName: string,
	StartingBalance: number,
	BaseReward: number,
	UpgradeStepCost: number,
	RateLimitSeconds: number,
}

local ${pascal}Config: SystemTuning = {
	SystemName = "${pascal}",
	CurrencyName = "Coins",
	StartingBalance = 250,
	BaseReward = 45,
	UpgradeStepCost = 150,
	RateLimitSeconds = 0.22,
}

return table.freeze(${pascal}Config)`,
      },
      {
        name: `${pascal}Controller`,
        className: 'LocalScript',
        parentService: 'StarterPlayerScripts',
        code: `--!strict
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local Remotes = ReplicatedStorage:WaitForChild("${pascal}Remotes")
local ActionRemote = Remotes:WaitForChild("${pascal}Action") :: RemoteEvent

-- Build clean Roblox ScreenGui with UICorner + UIStroke + spring bounce
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "${pascal}Gui"
screenGui.ResetOnSpawn = false
screenGui.Parent = player:WaitForChild("PlayerGui")

local card = Instance.new("Frame")
card.Name = "MainFrame"
card.Size = UDim2.fromScale(0.24, 0.14)
card.Position = UDim2.fromScale(0.02, 0.82)
card.BackgroundColor3 = Color3.fromRGB(18, 22, 32)
card.Parent = screenGui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 14)
corner.Parent = card

local stroke = Instance.new("UIStroke")
stroke.Thickness = 2
stroke.Color = Color3.fromRGB(0, 230, 118)
stroke.Parent = card

local actionBtn = Instance.new("TextButton")
actionBtn.Size = UDim2.fromScale(0.88, 0.56)
actionBtn.Position = UDim2.fromScale(0.06, 0.22)
actionBtn.BackgroundColor3 = Color3.fromRGB(0, 212, 106)
actionBtn.Font = Enum.Font.BuilderSansBold
actionBtn.TextColor3 = Color3.fromRGB(8, 24, 14)
actionBtn.TextScaled = true
actionBtn.Text = "ACTIVATE ${pascal.toUpperCase()} [E]"
actionBtn.Parent = card

Instance.new("UICorner", actionBtn).CornerRadius = UDim.new(0, 10)

local function firePrimary()
	ActionRemote:FireServer("TriggerPrimary")
	TweenService:Create(card, TweenInfo.new(0.09, Enum.EasingStyle.Back), {
		Size = UDim2.fromScale(0.252, 0.148),
	}):Play()
	task.delay(0.1, function()
		TweenService:Create(card, TweenInfo.new(0.16, Enum.EasingStyle.Quad), {
			Size = UDim2.fromScale(0.24, 0.14),
		}):Play()
	end)
end

actionBtn.Activated:Connect(firePrimary)
UserInputService.InputBegan:Connect(function(inp, gp)
	if not gp and inp.KeyCode == Enum.KeyCode.E then
		firePrimary()
	end
end)`,
      },
    ],
  };
}
