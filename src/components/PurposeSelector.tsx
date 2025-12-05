import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Language = 'lua' | 'luau' | 'cpp' | 'java' | 'python';
type CodePurpose = 'roblox-studio' | 'roblox-exploit' | 'minecraft-exploit' | 'blackrussia-exploit' | 'learn' | 'python-learn' | 'python-exploit';

interface PurposeSelectorProps {
  selectedLang: Language;
  onSelectPurpose: (purpose: CodePurpose) => void;
  onBack: () => void;
  translations: any;
  uiLang: 'ru' | 'en';
}

const PurposeSelector = ({ selectedLang, onSelectPurpose, onBack, translations, uiLang }: PurposeSelectorProps) => {
  const t = translations[uiLang];

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
                onClick={() => onSelectPurpose(p.id)}
                className="h-28 text-xl font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all hover:scale-105"
              >
                <Icon name={p.icon as any} className="mr-3" size={28} />
                {t[p.label]}
              </Button>
            ))}
          </div>

          <Button
            onClick={onBack}
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
};

export default PurposeSelector;
