import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type Language = 'lua' | 'luau' | 'cpp' | 'java' | 'python';
type UILanguage = 'ru' | 'en';

interface LanguageSelectorProps {
  uiLang: UILanguage;
  setUiLang: (lang: UILanguage) => void;
  onSelectLanguage: (lang: Language) => void;
  translations: any;
}

const languageIcons = {
  lua: 'Moon',
  luau: 'Sparkles',
  cpp: 'Cpu',
  java: 'Coffee',
  python: 'Snake'
};

const languageColors = {
  lua: 'from-blue-500 to-indigo-600',
  luau: 'from-purple-500 to-pink-600',
  cpp: 'from-green-500 to-teal-600',
  java: 'from-orange-500 to-red-600',
  python: 'from-yellow-500 to-green-600'
};

const LanguageSelector = ({ uiLang, setUiLang, onSelectLanguage, translations }: LanguageSelectorProps) => {
  const t = translations[uiLang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDEzOSwgOTIsIDI0NSwgMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <Card className="w-full max-w-6xl p-12 bg-card/80 backdrop-blur-xl border-2 border-border shadow-2xl animate-fade-in relative z-10">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <Icon name="Code2" size={48} className="text-primary" />
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
              {t.title}
            </h1>
            <p className="text-2xl text-muted-foreground font-light">{t.selectLanguage}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-16">
            {(['lua', 'luau', 'cpp', 'java', 'python'] as Language[]).map((lang) => (
              <Button
                key={lang}
                onClick={() => onSelectLanguage(lang)}
                className={`h-40 text-2xl font-bold bg-gradient-to-br ${languageColors[lang]} hover:scale-110 hover:shadow-2xl text-white transition-all duration-500 flex flex-col gap-4 rounded-2xl border-0 relative overflow-hidden group`}
                variant="default"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Icon name={languageIcons[lang] as any} size={48} className="group-hover:rotate-12 transition-transform duration-500" />
                <span className="relative z-10">{t[lang]}</span>
              </Button>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-6">
              <Icon name="Globe" size={24} className="text-primary" />
              <Select value={uiLang} onValueChange={(v) => setUiLang(v as UILanguage)}>
                <SelectTrigger className="w-56 h-12 text-lg border-2 border-primary/30 hover:border-primary transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru" className="text-lg">{t.russian}</SelectItem>
                  <SelectItem value="en" className="text-lg">{t.english}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={() => window.open('https://www.AiHelpLuaPython.com', '_blank')}
                variant="outline"
                size="lg"
                className="border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8"
              >
                <Icon name="MessageCircle" className="mr-3" size={24} />
                {t.chatSupport}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LanguageSelector;
