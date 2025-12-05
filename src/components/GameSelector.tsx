import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type CodePurpose = 'roblox-studio' | 'roblox-exploit' | 'minecraft-exploit' | 'blackrussia-exploit' | 'learn' | 'python-learn' | 'arizona-exploit';
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

  const games: { id: GameMode; icon: string; label: keyof typeof t; gradient: string }[] = 
    purpose === 'roblox-exploit' ? [
      { id: 'mm2', icon: 'Knife', label: 'mm2', gradient: 'from-red-500 to-pink-600' },
      { id: 'arsenal', icon: 'Crosshair', label: 'arsenal', gradient: 'from-orange-500 to-red-600' },
      { id: 'phantom-forces', icon: 'Target', label: 'phantomForces', gradient: 'from-blue-500 to-cyan-600' },
      { id: 'other', icon: 'Gamepad2', label: 'other', gradient: 'from-purple-500 to-indigo-600' },
    ] : [
      { id: 'other', icon: 'Pickaxe', label: 'other', gradient: 'from-green-500 to-emerald-600' },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-6">
      <Card className="w-full max-w-5xl p-12 bg-card/80 backdrop-blur-xl border-2 border-border shadow-2xl animate-fade-in">
        <div className="text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
              <Icon name="Gamepad2" size={40} className="text-primary" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.selectGame}
            </h1>
            <p className="text-xl text-muted-foreground font-light">{t[selectedLang]}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {games.map((g) => (
              <Button
                key={g.id}
                onClick={() => onSelectGame(g.id)}
                className={`h-36 text-2xl font-bold bg-gradient-to-br ${g.gradient} hover:scale-105 hover:shadow-2xl text-white transition-all duration-500 rounded-2xl border-0 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <Icon name={g.icon as any} size={36} className="group-hover:rotate-12 transition-transform duration-500" />
                  <span>{t[g.label]}</span>
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
            {t.selectPurpose}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameSelector;
