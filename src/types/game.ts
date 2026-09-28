export type TopicType = 'GLB' | 'GLBB';
export type CognitiveLevel = 'C1' | 'C2' | 'C3';

export type GraphKind =
  | 'vt-glb'           // Kecepatan tetap terhadap waktu (garis mendatar)
  | 'st-glb'           // Jarak bertambah teratur terhadap waktu (garis miring lurus naik)
  | 'vt-glbb'          // Kecepatan berubah teratur terhadap waktu (garis miring naik GLBB)
  | 'st-compare'       // Perbandingan grafik s-t dua mobil (Mobil A vs Mobil B)
  | 'st-calc-speed'    // Grafik s-t dengan nilai angka untuk menghitung kelajuan v = s/t
  | 'at-glb'           // Percepatan nol (a = 0)
  | 'at-glbb'          // Percepatan tetap konstan (garis mendatar di a > 0)
  | 'vt-calc-distance' // Grafik v-t GLB dengan angka tertentu untuk menghitung jarak
  | 'vt-calc-accel';   // Grafik v-t GLBB dengan angka untuk menghitung percepatan

export interface GraphDefinition {
  kind: GraphKind;
  title?: string;
  yAxisLabel: string; // e.g. "v (m/s)" or "s (m)" or "a (m/s²)"
  xAxisLabel: string; // e.g. "t (s)"
  values?: {
    v0?: number;
    vt?: number;
    t?: number;
    s?: number;
    a?: number;
  };
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  text: string;
  topic: TopicType;
  cognitiveLevel: CognitiveLevel;
  graph?: GraphDefinition;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface PlayerColorTheme {
  name: string;
  primary: string;       // Tailwind class
  accentHex: string;     // Hex color for SVG/glow
  lightHex: string;
  glowHex: string;
  borderClass: string;
  bgBadgeClass: string;
  buttonClass: string;
}

export interface PlayerState {
  id: number;
  name: string;
  colorTheme: PlayerColorTheme;
  score: number;
  correctCount: number;
  wrongCount: number;
  progress: number; // 0 to 100
  isFinished: boolean;
  finishRank?: number;
  currentQuestion: Question;
  usedQuestionIds: string[];
  feedback: 'idle' | 'correct' | 'wrong';
  isMoving: boolean;
  streak: number;
}

export interface GameSettings {
  playerCount: 2 | 3 | 4 | 5;
  targetQuestions: number; // 5, 7, 10
  materialMode: 'all' | 'glb' | 'glbb';
  soundEnabled: boolean;
}
