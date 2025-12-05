import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Language = 'lua' | 'luau' | 'cpp' | 'java' | 'python';
type UILanguage = 'ru' | 'en';
type CodePurpose = 'roblox-studio' | 'roblox-exploit' | 'minecraft-exploit' | 'blackrussia-exploit' | 'learn' | 'python-learn' | 'python-exploit';
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
    learn: 'Изучение',
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
    learn: 'Learn',
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
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const t = translations[uiLang];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, fileName]);

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

  const handleCodeChange = (value: string) => {
    setCode(value);
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    setCursorPosition(cursorPos);
    
    const textBeforeCursor = value.slice(0, cursorPos);
    const currentWord = textBeforeCursor.split(/[\s\(\)\{\}\[\],;]/).pop() || '';
    
    if (currentWord.length > 0) {
      const options = getAutocompleteOptions();
      const filtered = options.filter(opt => 
        opt.toLowerCase().startsWith(currentWord.toLowerCase())
      );
      
      if (filtered.length > 0) {
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    if (value.endsWith('(') && !value.slice(0, -1).endsWith('(')) {
      setCode(value + ')');
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = cursorPos;
          textarea.selectionEnd = cursorPos;
        }
      }, 0);
    } else if (value.endsWith('{') && !value.slice(0, -1).endsWith('{')) {
      setCode(value + '}');
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = cursorPos;
          textarea.selectionEnd = cursorPos;
        }
      }, 0);
    } else if (value.endsWith('"') && !value.slice(0, -1).endsWith('"')) {
      const beforeQuote = value.slice(0, -1);
      const quoteCount = (beforeQuote.match(/"/g) || []).length;
      if (quoteCount % 2 === 0) {
        setCode(value + '"');
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = cursorPos;
            textarea.selectionEnd = cursorPos;
          }
        }, 0);
      }
    } else if (value.endsWith("'") && !value.slice(0, -1).endsWith("'")) {
      const beforeQuote = value.slice(0, -1);
      const quoteCount = (beforeQuote.match(/'/g) || []).length;
      if (quoteCount % 2 === 0) {
        setCode(value + "'");
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = cursorPos;
            textarea.selectionEnd = cursorPos;
          }
        }, 0);
      }
    }
  };

  const insertSuggestion = (suggestion: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = code.slice(0, cursorPos);
    const textAfterCursor = code.slice(cursorPos);
    const words = textBeforeCursor.split(/[\s\(\)\{\}\[\],;]/);
    const currentWord = words.pop() || '';
    const textBeforeWord = textBeforeCursor.slice(0, -currentWord.length);
    
    const newCode = textBeforeWord + suggestion + textAfterCursor;
    setCode(newCode);
    setShowSuggestions(false);
    
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = textBeforeWord.length + suggestion.length;
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
        textarea.focus();
      }
    }, 0);
  };

  const insertCodeExample = (exampleCode: string) => {
    setCode(exampleCode);
    toast({ title: t.insertCode });
  };

  const handleRun = () => {
    setConsoleOutput(prev => [...prev, `> ${t.code_executed}`, code, '---']);
    toast({ title: t.code_executed });
  };

  const handleSave = () => {
    const extensions: Record<Language, string> = {
      lua: '.lua',
      luau: '.luau',
      cpp: '.cpp',
      java: '.java',
      python: '.py'
    };
    
    const extension = selectedLang ? extensions[selectedLang] : '.txt';
    const name = fileName || `script${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.endsWith(extension) ? name : name + extension;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: t.saved, description: name });
  };

  const handleClear = () => {
    setConsoleOutput([]);
  };

  if (!selectedLang) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-5xl p-12 bg-card border-border animate-fade-in">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-primary mb-2">{t.title}</h1>
              <p className="text-xl text-muted-foreground">{t.selectLanguage}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
              {(['lua', 'luau', 'cpp', 'java', 'python'] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className="h-32 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 flex flex-col gap-2"
                  variant="default"
                >
                  <Icon name="Code" size={32} />
                  {t[lang]}
                </Button>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-center gap-4">
                <Icon name="Globe" size={20} className="text-muted-foreground" />
                <Select value={uiLang} onValueChange={(v) => setUiLang(v as UILanguage)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">{t.russian}</SelectItem>
                    <SelectItem value="en">{t.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!purpose) {
    const purposes: { id: CodePurpose; icon: string; label: keyof typeof t }[] = 
      selectedLang === 'lua' || selectedLang === 'luau' ? [
        { id: 'roblox-studio', icon: 'Blocks', label: 'robloxStudio' },
        { id: 'roblox-exploit', icon: 'Zap', label: 'robloxExploit' },
        { id: 'learn', icon: 'GraduationCap', label: 'learn' },
      ] : selectedLang === 'java' ? [
        { id: 'minecraft-exploit', icon: 'Pickaxe', label: 'minecraftExploit' },
        { id: 'learn', icon: 'GraduationCap', label: 'learn' },
      ] : selectedLang === 'cpp' ? [
        { id: 'blackrussia-exploit', icon: 'Car', label: 'blackrussiaExploit' },
        { id: 'learn', icon: 'GraduationCap', label: 'learn' },
      ] : [
        { id: 'python-learn', icon: 'GraduationCap', label: 'learn' },
        { id: 'python-exploit', icon: 'Shield', label: 'robloxExploit' },
      ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl p-12 bg-card border-border animate-fade-in">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-primary mb-2">{t.selectPurpose}</h1>
              <p className="text-lg text-muted-foreground">{t[selectedLang]}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {purposes.map((p) => (
                <Button
                  key={p.id}
                  onClick={() => setPurpose(p.id)}
                  className="h-28 text-xl font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all hover:scale-105"
                >
                  <Icon name={p.icon as any} className="mr-3" size={28} />
                  {t[p.label]}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setSelectedLang(null)}
              variant="outline"
              className="mt-8"
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              {t.selectLanguage}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if ((purpose === 'roblox-exploit' || purpose === 'minecraft-exploit') && !gameMode) {
    const games: { id: GameMode; icon: string; label: keyof typeof t }[] = 
      purpose === 'roblox-exploit' ? [
        { id: 'mm2', icon: 'Knife', label: 'mm2' },
        { id: 'arsenal', icon: 'Crosshair', label: 'arsenal' },
        { id: 'phantom-forces', icon: 'Target', label: 'phantomForces' },
        { id: 'other', icon: 'Gamepad2', label: 'other' },
      ] : [
        { id: 'other', icon: 'Pickaxe', label: 'other' },
      ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl p-12 bg-card border-border animate-fade-in">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-primary mb-2">{t.selectGame}</h1>
              <p className="text-lg text-muted-foreground">{t[selectedLang]}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {games.map((g) => (
                <Button
                  key={g.id}
                  onClick={() => setGameMode(g.id)}
                  className="h-28 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
                >
                  <Icon name={g.icon as any} className="mr-3" size={28} />
                  {t[g.label]}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setPurpose(null)}
              variant="outline"
              className="mt-8"
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              {t.selectPurpose}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (gameMode) {
                  setGameMode(null);
                } else {
                  setPurpose(null);
                }
              }}
            >
              <Icon name="ArrowLeft" size={18} />
            </Button>
            <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Code" size={16} />
              <span>{t[selectedLang]}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={uiLang} onValueChange={(v) => setUiLang(v as UILanguage)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">{t.russian}</SelectItem>
                <SelectItem value="en">{t.english}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleRun} className="bg-primary hover:bg-primary/90">
              <Icon name="Play" className="mr-2" size={18} />
              {t.run}
            </Button>
            
            <Button onClick={handleSave} variant="secondary">
              <Icon name="Save" className="mr-2" size={18} />
              {t.save}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col bg-card border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="FileCode" size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold">{t.editor}</h2>
                </div>
                <input
                  type="text"
                  placeholder={t.fileName}
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="px-3 py-1 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={t.startCoding}
                  className="h-full font-mono text-sm resize-none bg-background border-0 focus-visible:ring-0"
                  spellCheck={false}
                />
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-4 top-4 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[200px]">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertSuggestion(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm font-mono transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="BookOpen" size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold">{t.tutorials}</h2>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {gameMode === 'mm2' && (
                    <>
                      <Button
                        onClick={() => insertCodeExample(codeExamples['roblox-esp-mm2'])}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Icon name="Eye" size={16} />
                            {t.espTutorial}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Murder Mystery 2
                          </div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => insertCodeExample(codeExamples['roblox-aimbot'])}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Icon name="Crosshair" size={16} />
                            {t.aimbotTutorial}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Автонаведение
                          </div>
                        </div>
                      </Button>
                    </>
                  )}
                  
                  {purpose === 'blackrussia-exploit' && (
                    <Button
                      onClick={() => insertCodeExample(codeExamples['cpp-esp-blackrussia'])}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <Icon name="Eye" size={16} />
                          {t.espTutorial} C++
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Black Russia
                        </div>
                      </div>
                    </Button>
                  )}
                  
                  {purpose === 'minecraft-exploit' && (
                    <Button
                      onClick={() => insertCodeExample(codeExamples['java-minecraft-esp'])}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <Icon name="Eye" size={16} />
                          {t.espTutorial} Java
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Minecraft
                        </div>
                      </div>
                    </Button>
                  )}
                  
                  {(purpose === 'learn' || purpose === 'python-learn') && (
                    <Button
                      onClick={() => insertCodeExample(codeExamples['python-basic'])}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <Icon name="Code" size={16} />
                          Основы {t[selectedLang]}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Примеры кода
                        </div>
                      </div>
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </Card>

            <Card className="flex-1 flex flex-col bg-card border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Terminal" size={20} className="text-secondary" />
                  <h2 className="text-lg font-semibold">{t.console}</h2>
                </div>
                <Button onClick={handleClear} variant="ghost" size="sm">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4 bg-background/50 font-mono text-sm">
                {consoleOutput.length === 0 ? (
                  <p className="text-muted-foreground italic">{t.console}...</p>
                ) : (
                  consoleOutput.map((line, idx) => (
                    <div key={idx} className="mb-1 text-foreground whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
