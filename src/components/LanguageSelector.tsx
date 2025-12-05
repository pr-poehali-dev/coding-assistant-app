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

const LanguageSelector = ({ uiLang, setUiLang, onSelectLanguage, translations }: LanguageSelectorProps) => {
  const t = translations[uiLang];

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
                onClick={() => onSelectLanguage(lang)}
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
};

export default LanguageSelector;
