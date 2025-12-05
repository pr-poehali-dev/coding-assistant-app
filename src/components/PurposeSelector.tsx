import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Language = 'lua' | 'luau' | 'cpp' | 'java' | 'python';
type CodePurpose = 'roblox-studio' | 'roblox-exploit' | 'minecraft-exploit' | 'blackrussia-exploit' | 'learn' | 'python-learn' | 'arizona-exploit';

interface PurposeSelectorProps {
  selectedLang: Language;
  onSelectPurpose: (purpose: CodePurpose) => void;
  onBack: () => void;
  translations: any;
  uiLang: 'ru' | 'en';
}

const PurposeSelector = ({ selectedLang, onSelectPurpose, onBack, translations, uiLang }: PurposeSelectorProps) => {
  const t = translations[uiLang];

  const purposes: { id: CodePurpose; icon: string; label: keyof typeof t; gradient: string }[] = 
    selectedLang === 'lua' || selectedLang === 'luau' ? [
      { id: 'roblox-studio', icon: 'Blocks', label: 'robloxStudio', gradient: 'from-blue-500 to-cyan-600' },
      { id: 'roblox-exploit', icon: 'Zap', label: 'robloxExploit', gradient: 'from-purple-500 to-pink-600' },
      { id: 'learn', icon: 'GraduationCap', label: 'learn', gradient: 'from-green-500 to-emerald-600' },
    ] : selectedLang === 'java' ? [
      { id: 'minecraft-exploit', icon: 'Pickaxe', label: 'minecraftExploit', gradient: 'from-orange-500 to-amber-600' },
      { id: 'learn', icon: 'GraduationCap', label: 'learn', gradient: 'from-green-500 to-emerald-600' },
    ] : selectedLang === 'cpp' ? [
      { id: 'blackrussia-exploit', icon: 'Car', label: 'blackrussiaExploit', gradient: 'from-red-500 to-rose-600' },
      { id: 'learn', icon: 'GraduationCap', label: 'learn', gradient: 'from-green-500 to-emerald-600' },
    ] : [
      { id: 'python-learn', icon: 'GraduationCap', label: 'learn', gradient: 'from-green-500 to-emerald-600' },
      { id: 'arizona-exploit', icon: 'Car', label: 'arizonaExploit', gradient: 'from-yellow-500 to-orange-600' },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-6">
      <Card className="w-full max-w-5xl p-12 bg-card/80 backdrop-blur-xl border-2 border-border shadow-2xl animate-fade-in">
        <div className="text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
              <Icon name="Target" size={40} className="text-primary" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.selectPurpose}
            </h1>
            <p className="text-xl text-muted-foreground font-light">{t[selectedLang]}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {purposes.map((p) => (
              <Button
                key={p.id}
                onClick={() => onSelectPurpose(p.id)}
                className={`h-36 text-2xl font-bold bg-gradient-to-br ${p.gradient} hover:scale-105 hover:shadow-2xl text-white transition-all duration-500 rounded-2xl border-0 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <Icon name={p.icon as any} size={36} className="group-hover:rotate-12 transition-transform duration-500" />
                  <span>{t[p.label]}</span>
                </div>
              </Button>
            ))}
          </div>

          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="mt-12 border-2 border-primary/30 hover:border-primary text-lg px-8"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            {t.selectLanguage}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PurposeSelector;
