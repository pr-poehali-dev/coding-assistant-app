import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Language = 'lua' | 'luau' | 'cpp';
type UILanguage = 'ru' | 'en';
type CodePurpose = 'studio' | 'exploit' | 'learn' | 'cpp-learn' | 'cpp-exploit';

const translations = {
  ru: {
    title: 'Учи Lua',
    selectLanguage: 'Выбрать язык',
    lua: 'Lua',
    luau: 'LuaU',
    cpp: 'C++',
    editor: 'Редактор',
    console: 'Консоль',
    learning: 'Обучение',
    settings: 'Настройки',
    save: 'Сохранить файл',
    run: 'Запустить',
    clear: 'Очистить',
    selectPurpose: 'Выберите цель',
    robloxStudio: 'Roblox Studio',
    robloxExploit: 'Эксплойт для Roblox',
    learnLua: 'Изучение Lua',
    learnCpp: 'Изучение C++',
    cppExploit: 'Эксплойт на C++',
    interfaceLanguage: 'Язык интерфейса',
    russian: 'Русский',
    english: 'English',
    startCoding: 'Начать писать код',
    fileName: 'Имя файла',
    syntaxHighlight: 'Подсветка синтаксиса',
    autoComplete: 'Автодополнение',
    saved: 'Файл сохранён',
    code_executed: 'Код выполнен',
  },
  en: {
    title: 'Learn Lua',
    selectLanguage: 'Select Language',
    lua: 'Lua',
    luau: 'LuaU',
    cpp: 'C++',
    editor: 'Editor',
    console: 'Console',
    learning: 'Learning',
    settings: 'Settings',
    save: 'Save File',
    run: 'Run',
    clear: 'Clear',
    selectPurpose: 'Select Purpose',
    robloxStudio: 'Roblox Studio',
    robloxExploit: 'Roblox Exploit',
    learnLua: 'Learn Lua',
    learnCpp: 'Learn C++',
    cppExploit: 'C++ Exploit',
    interfaceLanguage: 'Interface Language',
    russian: 'Русский',
    english: 'English',
    startCoding: 'Start Coding',
    fileName: 'File Name',
    syntaxHighlight: 'Syntax Highlighting',
    autoComplete: 'Auto Complete',
    saved: 'File saved',
    code_executed: 'Code executed',
  },
};

const luaKeywords = ['local', 'function', 'end', 'if', 'then', 'else', 'elseif', 'while', 'do', 'for', 'return', 'break', 'in', 'repeat', 'until', 'true', 'false', 'nil', 'and', 'or', 'not'];
const luaFunctions = ['print', 'type', 'tonumber', 'tostring', 'pairs', 'ipairs', 'next', 'select', 'unpack', 'rawget', 'rawset', 'getmetatable', 'setmetatable', 'pcall', 'xpcall', 'error', 'assert'];
const robloxServices = ['GetService', 'WaitForChild', 'FindFirstChild', 'Clone', 'Destroy', 'Connect', 'Fire', 'Invoke', 'RemoveEvent', 'BindableEvent', 'RemoteFunction'];
const cppKeywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'namespace', 'using', 'include', 'define', 'ifdef', 'endif'];

const Index = () => {
  const [uiLang, setUiLang] = useState<UILanguage>('ru');
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [purpose, setPurpose] = useState<CodePurpose | null>(null);
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
    
    if (selectedLang === 'cpp') {
      return cppKeywords;
    }
    
    const baseOptions = [...luaKeywords, ...luaFunctions];
    if (purpose === 'studio' || purpose === 'exploit') {
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

    if (value.endsWith('(')) {
      setCode(value + ')');
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = cursorPos;
          textarea.selectionEnd = cursorPos;
        }
      }, 0);
    } else if (value.endsWith('"') && !value.slice(0, -1).endsWith('"')) {
      setCode(value + '"');
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = cursorPos;
          textarea.selectionEnd = cursorPos;
        }
      }, 0);
    } else if (value.endsWith("'") && !value.slice(0, -1).endsWith("'")) {
      setCode(value + "'");
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = cursorPos;
          textarea.selectionEnd = cursorPos;
        }
      }, 0);
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
    const textBeforeWord = words.join(' ') + (words.length > 0 ? ' ' : '');
    
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

  const handleRun = () => {
    setConsoleOutput(prev => [...prev, `> ${t.code_executed}`, code, '---']);
    toast({ title: t.code_executed });
  };

  const handleSave = () => {
    const extension = selectedLang === 'cpp' ? '.cpp' : selectedLang === 'luau' ? '.luau' : '.lua';
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
        <Card className="w-full max-w-4xl p-12 bg-card border-border animate-fade-in">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-primary mb-2">{t.title}</h1>
              <p className="text-xl text-muted-foreground">{t.selectLanguage}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {(['lua', 'luau', 'cpp'] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className="h-32 text-2xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                  variant="default"
                >
                  <Icon name="Code" className="mr-3" size={32} />
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl p-12 bg-card border-border animate-fade-in">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-primary mb-2">{t.selectPurpose}</h1>
              <p className="text-lg text-muted-foreground">{t[selectedLang]}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {selectedLang !== 'cpp' ? (
                <>
                  <Button
                    onClick={() => setPurpose('studio')}
                    className="h-28 text-xl font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Icon name="Blocks" className="mr-3" size={28} />
                    {t.robloxStudio}
                  </Button>
                  <Button
                    onClick={() => setPurpose('exploit')}
                    className="h-28 text-xl font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Icon name="Zap" className="mr-3" size={28} />
                    {t.robloxExploit}
                  </Button>
                  <Button
                    onClick={() => setPurpose('learn')}
                    className="h-28 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Icon name="GraduationCap" className="mr-3" size={28} />
                    {t.learnLua}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setPurpose('cpp-learn')}
                    className="h-28 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Icon name="GraduationCap" className="mr-3" size={28} />
                    {t.learnCpp}
                  </Button>
                  <Button
                    onClick={() => setPurpose('cpp-exploit')}
                    className="h-28 text-xl font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Icon name="Shield" className="mr-3" size={28} />
                    {t.cppExploit}
                  </Button>
                </>
              )}
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setPurpose(null)}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          <div className="lg:col-span-2">
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
              
              <div className="flex-1 p-4 overflow-y-auto bg-background/50 font-mono text-sm">
                {consoleOutput.length === 0 ? (
                  <p className="text-muted-foreground italic">{t.console}...</p>
                ) : (
                  consoleOutput.map((line, idx) => (
                    <div key={idx} className="mb-1 text-foreground whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="bg-card border-border p-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Settings" size={20} className="text-primary" />
                <h2 className="text-lg font-semibold">{t.settings}</h2>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.syntaxHighlight}</span>
                  <Icon name="Check" size={16} className="text-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.autoComplete}</span>
                  <Icon name="Check" size={16} className="text-primary" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
