import { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import PurposeSelector from '@/components/PurposeSelector';
import GameSelector from '@/components/GameSelector';
import CodeEditorView from '@/components/CodeEditorView';

type Language = 'lua' | 'luau' | 'cpp' | 'java' | 'python';
type UILanguage = 'ru' | 'en';
type CodePurpose = 'roblox-studio' | 'roblox-exploit' | 'minecraft-exploit' | 'blackrussia-exploit' | 'learn' | 'python-learn' | 'arizona-exploit';
type GameMode = 'mm2' | 'arsenal' | 'phantom-forces' | 'blackrussia' | 'other';

const translations = {
  ru: {
    title: 'Учи Код',
    selectLanguage: 'Выбрать язык',
    lua: 'Lua',
    luau: 'LuaU',
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    editor: 'Редактор',
    console: 'Консоль',
    tutorials: 'Обучение',
    settings: 'Настройки',
    save: 'Сохранить файл',
    run: 'Запустить',
    clear: 'Очистить',
    selectPurpose: 'Выберите цель',
    selectGame: 'Выберите игру',
    robloxStudio: 'Roblox Studio',
    robloxExploit: 'Эксплойт для Roblox',
    minecraftExploit: 'Эксплойт для Minecraft',
    blackrussiaExploit: 'Эксплойт для Black Russia',
    arizonaExploit: 'Эксплойт для Arizona RP',
    learn: 'Изучение',
    chatSupport: 'Чат поддержки',
    interfaceLanguage: 'Язык интерфейса',
    russian: 'Русский',
    english: 'English',
    startCoding: 'Начать писать код',
    fileName: 'Имя файла',
    syntaxHighlight: 'Подсветка синтаксиса',
    autoComplete: 'Автодополнение',
    saved: 'Файл сохранён',
    code_executed: 'Код выполнен',
    mm2: 'Murder Mystery 2',
    arsenal: 'Arsenal',
    phantomForces: 'Phantom Forces',
    blackrussia: 'Black Russia',
    other: 'Другая игра',
    tutorialTitle: 'Примеры и подсказки',
    espTutorial: 'ESP для игроков',
    aimbotTutorial: 'Аимбот',
    speedhackTutorial: 'Speedhack',
    flyTutorial: 'Fly / Полёт',
    wallhackTutorial: 'Wallhack',
    insertCode: 'Вставить код',
  },
  en: {
    title: 'Learn Code',
    selectLanguage: 'Select Language',
    lua: 'Lua',
    luau: 'LuaU',
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    editor: 'Editor',
    console: 'Console',
    tutorials: 'Tutorials',
    settings: 'Settings',
    save: 'Save File',
    run: 'Run',
    clear: 'Clear',
    selectPurpose: 'Select Purpose',
    selectGame: 'Select Game',
    robloxStudio: 'Roblox Studio',
    robloxExploit: 'Roblox Exploit',
    minecraftExploit: 'Minecraft Exploit',
    blackrussiaExploit: 'Black Russia Exploit',
    arizonaExploit: 'Arizona RP Exploit',
    learn: 'Learn',
    chatSupport: 'Chat Support',
    interfaceLanguage: 'Interface Language',
    russian: 'Русский',
    english: 'English',
    startCoding: 'Start Coding',
    fileName: 'File Name',
    syntaxHighlight: 'Syntax Highlighting',
    autoComplete: 'Auto Complete',
    saved: 'File saved',
    code_executed: 'Code executed',
    mm2: 'Murder Mystery 2',
    arsenal: 'Arsenal',
    phantomForces: 'Phantom Forces',
    blackrussia: 'Black Russia',
    other: 'Other Game',
    tutorialTitle: 'Examples & Tips',
    espTutorial: 'Player ESP',
    aimbotTutorial: 'Aimbot',
    speedhackTutorial: 'Speedhack',
    flyTutorial: 'Fly',
    wallhackTutorial: 'Wallhack',
    insertCode: 'Insert Code',
  },
};

const codeExamples = {
  'roblox-esp-mm2': `-- ESP для Murder Mystery 2
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local LocalPlayer = Players.LocalPlayer

local function createESP(player)
    local highlight = Instance.new("Highlight")
    highlight.Parent = player.Character
    highlight.FillColor = Color3.fromRGB(255, 0, 0)
    highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
    highlight.FillTransparency = 0.5
    highlight.OutlineTransparency = 0
end

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        wait(1)
        createESP(player)
    end)
end)`,

  'roblox-aimbot': `-- Аимбот для Roblox
local Camera = workspace.CurrentCamera
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")

local aimbotEnabled = false

UserInputService.InputBegan:Connect(function(input)
    if input.KeyCode == Enum.KeyCode.E then
        aimbotEnabled = not aimbotEnabled
    end
end)

game:GetService("RunService").RenderStepped:Connect(function()
    if aimbotEnabled then
        local closestPlayer = nil
        local shortestDistance = math.huge
        
        for _, player in pairs(Players:GetPlayers()) do
            if player ~= LocalPlayer and player.Character then
                local head = player.Character:FindFirstChild("Head")
                if head then
                    local distance = (head.Position - Camera.CFrame.Position).Magnitude
                    if distance < shortestDistance then
                        closestPlayer = player
                        shortestDistance = distance
                    end
                end
            end
        end
        
        if closestPlayer then
            local head = closestPlayer.Character.Head
            Camera.CFrame = CFrame.new(Camera.CFrame.Position, head.Position)
        end
    end
end)`,

  'cpp-esp-blackrussia': `// ESP для Black Russia (C++)
#include <Windows.h>
#include <d3d9.h>
#include <d3dx9.h>

struct Vector3 {
    float x, y, z;
};

class ESP {
public:
    void DrawBox(Vector3 pos, IDirect3DDevice9* device) {
        D3DVIEWPORT9 viewport;
        device->GetViewport(&viewport);
        
        D3DXVECTOR3 screen;
        D3DXMATRIX viewMatrix, projMatrix, worldMatrix;
        
        device->GetTransform(D3DTS_VIEW, &viewMatrix);
        device->GetTransform(D3DTS_PROJECTION, &projMatrix);
        D3DXMatrixIdentity(&worldMatrix);
        
        D3DXVECTOR3 worldPos(pos.x, pos.y, pos.z);
        D3DXVec3Project(&screen, &worldPos, &viewport, 
                       &projMatrix, &viewMatrix, &worldMatrix);
        
        DrawRect(screen.x - 20, screen.y - 40, 40, 80, 
                D3DCOLOR_ARGB(255, 255, 0, 0), device);
    }
    
private:
    void DrawRect(float x, float y, float w, float h, 
                 D3DCOLOR color, IDirect3DDevice9* device) {
        D3DRECT rect = {(LONG)x, (LONG)y, (LONG)(x+w), (LONG)(y+h)};
        device->Clear(1, &rect, D3DCLEAR_TARGET, color, 1.0f, 0);
    }
};`,

  'java-minecraft-esp': `// ESP для Minecraft (Java)
import net.minecraft.client.Minecraft;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.client.renderer.GlStateManager;
import org.lwjgl.opengl.GL11;

public class ESPModule {
    private Minecraft mc = Minecraft.getMinecraft();
    
    public void onRender() {
        for (Object obj : mc.world.loadedEntityList) {
            if (obj instanceof EntityPlayer) {
                EntityPlayer player = (EntityPlayer) obj;
                
                if (player != mc.player) {
                    drawESP(player);
                }
            }
        }
    }
    
    private void drawESP(EntityPlayer player) {
        double x = player.lastTickPosX + (player.posX - player.lastTickPosX);
        double y = player.lastTickPosY + (player.posY - player.lastTickPosY);
        double z = player.lastTickPosZ + (player.posZ - player.lastTickPosZ);
        
        GlStateManager.pushMatrix();
        GL11.glDisable(GL11.GL_TEXTURE_2D);
        GL11.glDisable(GL11.GL_DEPTH_TEST);
        GL11.glColor4f(1.0f, 0.0f, 0.0f, 0.5f);
        
        // Draw bounding box
        drawBoundingBox(x - 0.5, y, z - 0.5, x + 0.5, y + 1.8, z + 0.5);
        
        GL11.glEnable(GL11.GL_TEXTURE_2D);
        GL11.glEnable(GL11.GL_DEPTH_TEST);
        GlStateManager.popMatrix();
    }
}`,

  'python-basic': `# Основы Python
def hello_world():
    print("Hello, World!")

# Переменные
name = "Python"
age = 30
is_cool = True

# Циклы
for i in range(5):
    print(f"Iteration {i}")

# Функции
def calculate_sum(a, b):
    return a + b

result = calculate_sum(10, 20)
print(f"Sum: {result}")`,

  'python-arizona-esp': `# ESP для Arizona RP (Python)
import win32gui
import win32api
import win32con
from ctypes import *

class Player:
    def __init__(self, x, y, z, name):
        self.x = x
        self.y = y
        self.z = z
        self.name = name

class ArizonaESP:
    def __init__(self):
        self.hwnd = win32gui.FindWindow(None, "GTA:SA:MP")
        self.players = []
    
    def get_players(self):
        # Получение адреса списка игроков
        base_addr = 0x00B6F5F0  # Базовый адрес SAMP
        player_pool = base_addr + 0x21A0F8
        
        # Чтение памяти игроков
        for i in range(1000):
            player_ptr = self.read_memory(player_pool + i * 4)
            if player_ptr:
                x = self.read_float(player_ptr + 0x14)
                y = self.read_float(player_ptr + 0x18)
                z = self.read_float(player_ptr + 0x1C)
                name = self.read_string(player_ptr + 0x28)
                self.players.append(Player(x, y, z, name))
    
    def draw_esp(self):
        hdc = win32gui.GetDC(self.hwnd)
        for player in self.players:
            screen_x, screen_y = self.world_to_screen(
                player.x, player.y, player.z
            )
            # Рисуем бокс вокруг игрока
            win32gui.Rectangle(hdc, 
                screen_x - 20, screen_y - 40,
                screen_x + 20, screen_y + 40)
            # Выводим имя
            win32gui.TextOut(hdc, screen_x, screen_y - 50, 
                player.name, len(player.name))
        win32gui.ReleaseDC(self.hwnd, hdc)

esp = ArizonaESP()
while True:
    esp.get_players()
    esp.draw_esp()`,

  'lua-basics': `-- Основы Lua
-- Переменные
local name = "Lua"
local age = 30
local isActive = true

-- Функции
local function greet(person)
    print("Привет, " .. person)
end

greet("Мир")

-- Циклы
for i = 1, 5 do
    print("Итерация " .. i)
end

-- Таблицы
local player = {
    name = "Player1",
    health = 100,
    armor = 50
}

print(player.name .. " HP: " .. player.health)`,

  'cpp-basics': `// Основы C++
#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Функции
void greet(string name) {
    cout << "Привет, " << name << endl;
}

// Классы
class Player {
public:
    string name;
    int health;
    
    Player(string n, int h) : name(n), health(h) {}
    
    void showInfo() {
        cout << name << " HP: " << health << endl;
    }
};

int main() {
    // Переменные
    string name = "C++";
    int age = 30;
    
    // Циклы
    for (int i = 0; i < 5; i++) {
        cout << "Iteration " << i << endl;
    }
    
    // Использование класса
    Player player("Player1", 100);
    player.showInfo();
    
    return 0;
}`,

  'java-basics': `// Основы Java
public class Main {
    // Функции
    public static void greet(String name) {
        System.out.println("Привет, " + name);
    }
    
    // Классы
    static class Player {
        String name;
        int health;
        
        Player(String name, int health) {
            this.name = name;
            this.health = health;
        }
        
        void showInfo() {
            System.out.println(name + " HP: " + health);
        }
    }
    
    public static void main(String[] args) {
        // Переменные
        String name = "Java";
        int age = 30;
        boolean isActive = true;
        
        // Циклы
        for (int i = 0; i < 5; i++) {
            System.out.println("Iteration " + i);
        }
        
        // Использование класса
        Player player = new Player("Player1", 100);
        player.showInfo();
        
        greet("Мир");
    }
}`,
};

const luaKeywords = ['local', 'function', 'end', 'if', 'then', 'else', 'elseif', 'while', 'do', 'for', 'return', 'break', 'in', 'repeat', 'until', 'true', 'false', 'nil', 'and', 'or', 'not'];
const luaFunctions = ['print', 'type', 'tonumber', 'tostring', 'pairs', 'ipairs', 'next', 'select', 'unpack', 'rawget', 'rawset', 'getmetatable', 'setmetatable', 'pcall', 'xpcall', 'error', 'assert', 'wait'];
const robloxServices = ['GetService', 'WaitForChild', 'FindFirstChild', 'FindFirstChildOfClass', 'Clone', 'Destroy', 'Connect', 'Fire', 'Invoke', 'RemoteEvent', 'BindableEvent', 'RemoteFunction', 'TweenService', 'RunService', 'Players', 'Workspace'];
const cppKeywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'namespace', 'using', 'include', 'define', 'ifdef', 'endif', 'nullptr'];
const javaKeywords = ['int', 'float', 'double', 'boolean', 'void', 'class', 'public', 'private', 'protected', 'static', 'final', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'new', 'import', 'package', 'extends', 'implements'];
const pythonKeywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'lambda', 'pass', 'break', 'continue', 'True', 'False', 'None', 'print', 'range', 'len', 'str', 'int'];

const Index = () => {
  const [uiLang, setUiLang] = useState<UILanguage>('ru');
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [purpose, setPurpose] = useState<CodePurpose | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const getAutocompleteOptions = () => {
    if (!selectedLang) return [];
    
    if (selectedLang === 'cpp') return cppKeywords;
    if (selectedLang === 'java') return javaKeywords;
    if (selectedLang === 'python') return pythonKeywords;
    
    const baseOptions = [...luaKeywords, ...luaFunctions];
    if (purpose === 'roblox-studio' || purpose === 'roblox-exploit') {
      return [...baseOptions, ...robloxServices];
    }
    return baseOptions;
  };

  if (!selectedLang) {
    return (
      <LanguageSelector
        uiLang={uiLang}
        setUiLang={setUiLang}
        onSelectLanguage={setSelectedLang}
        translations={translations}
      />
    );
  }

  if (!purpose) {
    return (
      <PurposeSelector
        selectedLang={selectedLang}
        onSelectPurpose={setPurpose}
        onBack={() => setSelectedLang(null)}
        translations={translations}
        uiLang={uiLang}
      />
    );
  }

  if ((purpose === 'roblox-exploit' || purpose === 'minecraft-exploit') && !gameMode) {
    return (
      <GameSelector
        purpose={purpose}
        selectedLang={selectedLang}
        onSelectGame={setGameMode}
        onBack={() => setPurpose(null)}
        translations={translations}
        uiLang={uiLang}
      />
    );
  }

  return (
    <CodeEditorView
      selectedLang={selectedLang}
      purpose={purpose}
      gameMode={gameMode}
      uiLang={uiLang}
      setUiLang={setUiLang}
      onBack={() => {
        if (gameMode) {
          setGameMode(null);
        } else {
          setPurpose(null);
        }
      }}
      translations={translations}
      codeExamples={codeExamples}
      autocompleteOptions={getAutocompleteOptions()}
    />
  );
};

export default Index;