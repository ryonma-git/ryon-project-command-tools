// ============================================================
// App.tsx — MaruFlow MVP Mock
// ============================================================
import { useState } from 'react';
import type { Screen } from './types';
import HomeScreen         from './screens/HomeScreen';
import PdfRegisterScreen  from './screens/PdfRegisterScreen';
import ScoringSetupScreen from './screens/ScoringSetupScreen';
import ScoringScreen      from './screens/ScoringScreen';
import OutputScreen       from './screens/OutputScreen';
import StatisticsScreen   from './screens/StatisticsScreen';
import HistoryScreen      from './screens/HistoryScreen';

const NAV_ITEMS: { label: string; screen: Screen }[] = [
  { label: 'ホーム',     screen: 'home'          },
  { label: 'PDF登録',    screen: 'pdf-register'  },
  { label: '採点欄設定', screen: 'scoring-setup' },
  { label: '採点',       screen: 'scoring'       },
  { label: '出力確認',   screen: 'output'        },
  { label: '統計',       screen: 'statistics'    },
  { label: '履歴',       screen: 'history'       },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (screen) {
      case 'home':          return <HomeScreen         onNavigate={setScreen} />;
      case 'pdf-register':  return <PdfRegisterScreen  onNavigate={setScreen} />;
      case 'scoring-setup': return <ScoringSetupScreen onNavigate={setScreen} />;
      case 'scoring':       return <ScoringScreen      onNavigate={setScreen} />;
      case 'output':        return <OutputScreen       onNavigate={setScreen} />;
      case 'statistics':    return <StatisticsScreen   onNavigate={setScreen} />;
      case 'history':       return <HistoryScreen      onNavigate={setScreen} />;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="logo">📝 MaruFlow</span>
        <span className="badge">MVP Mock</span>
        <nav>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.screen}
              className={screen === item.screen ? 'active' : ''}
              onClick={() => setScreen(item.screen)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        {renderScreen()}
      </main>
    </div>
  );
}
