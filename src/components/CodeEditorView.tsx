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

interface CodeEditorViewProps {
  selectedLang: Language;
  purpose: CodePurpose;
  gameMode: GameMode | null;
  uiLang: UILanguage;
  setUiLang: (lang: UILanguage) => void;
  onBack: () => void;
  translations: any;
  codeExamples: Record<string, string>;
  autocompleteOptions: string[];
}

const CodeEditorView = ({
  selectedLang,
  purpose,
  gameMode,
  uiLang,
  setUiLang,
  onBack,
  translations,
  codeExamples,
  autocompleteOptions
}: CodeEditorViewProps) => {
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

  const handleCodeChange = (value: string) => {
    setCode(value);
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    setCursorPosition(cursorPos);
    
    const textBeforeCursor = value.slice(0, cursorPos);
    const currentWord = textBeforeCursor.split(/[\s\(\)\{\}\[\],;]/).pop() || '';
    
    if (currentWord.length > 0) {
      const filtered = autocompleteOptions.filter(opt => 
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
    
    const extension = extensions[selectedLang];
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
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

export default CodeEditorView;
