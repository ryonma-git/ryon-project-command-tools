// ============================================================
// StateSelector.tsx — 今日の状態入力コンポーネント
// ============================================================

import type {
  TodayState,
  TimeSlot,
  EnergyLevel,
  Location,
  AgentAvailability,
  Mood,
} from '../types';

interface Props {
  state: TodayState;
  onChange: (next: TodayState) => void;
}

const TIME_OPTIONS: TimeSlot[] = ['15分', '30分', '1時間', '2時間以上'];
const ENERGY_OPTIONS: EnergyLevel[] = ['低', '中', '高'];
const LOCATION_OPTIONS: Location[] = ['学校', '自宅', '外'];
const AGENT_OPTIONS: AgentAvailability[] = [
  'ChatGPTのみ',
  'Codexあり',
  'Claude Codeあり',
  'Manusあり',
  '全部なし',
];
const MOOD_OPTIONS: Mood[] = [
  'とにかく進めたい',
  '記録だけしたい',
  '実装したい',
  '授業を考えたい',
  '校務を片付けたい',
  'キャリアを進めたい',
  '何も決められない',
];

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="state-field">
      <div className="field-label">{label}</div>
      <div className="btn-group">
        {options.map((opt) => (
          <button
            key={opt}
            className={`toggle-btn${value === opt ? ' active' : ''}`}
            onClick={() => onChange(opt)}
            type="button"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StateSelector({ state, onChange }: Props) {
  return (
    <div className="section-card">
      <div className="section-title">
        <span className="step-badge">1</span>
        今日の状態を入力
      </div>

      <div className="state-grid">
        <ToggleGroup
          label="使える時間"
          options={TIME_OPTIONS}
          value={state.time}
          onChange={(v) => onChange({ ...state, time: v })}
        />
        <ToggleGroup
          label="気力"
          options={ENERGY_OPTIONS}
          value={state.energy}
          onChange={(v) => onChange({ ...state, energy: v })}
        />
        <ToggleGroup
          label="場所"
          options={LOCATION_OPTIONS}
          value={state.location}
          onChange={(v) => onChange({ ...state, location: v })}
        />
        <ToggleGroup
          label="使えるエージェント"
          options={AGENT_OPTIONS}
          value={state.agent}
          onChange={(v) => onChange({ ...state, agent: v })}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <ToggleGroup
          label="今日の気分"
          options={MOOD_OPTIONS}
          value={state.mood}
          onChange={(v) => onChange({ ...state, mood: v })}
        />
      </div>
    </div>
  );
}
