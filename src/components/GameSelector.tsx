import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type CodePurpose = 'roblox-studio' | 'roblox-exploit' | 'minecraft-exploit' | 'blackrussia-exploit' | 'learn' | 'python-learn' | 'python-exploit';
type GameMode = 'mm2' | 'arsenal' | 'phantom-forces' | 'blackrussia' | 'other';
type Language = 'lua' | 'luau' | 'cpp' | 'java' | 'python';

interface GameSelectorProps {
  purpose: CodePurpose;
  selectedLang: Language;
  onSelectGame: (game: GameMode) => void;
  onBack: () => void;
  translations: any;
  uiLang: 'ru' | 'en';
}

const GameSelector = ({ purpose, selectedLang, onSelectGame, onBack, translations, uiLang }: GameSelectorProps) => {
  const t = translations[uiLang];

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
                onClick={() => onSelectGame(g.id)}
                className="h-28 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
              >
                <Icon name={g.icon as any} className="mr-3" size={28} />
                {t[g.label]}
              </Button>
            ))}
          </div>

          <Button
            onClick={onBack}
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
};

export default GameSelector;
