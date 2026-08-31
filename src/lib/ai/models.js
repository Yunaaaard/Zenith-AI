export const ZENITH_MODELS = [
  {
    id: 'zenith-mikel',
    name: 'Mikel',
    apiModel: 'claude-opus-5-thinking',
    description: 'Flagship deep reasoning and complex coding (Opus 5)',
    badge: 'Recommended',
    contextWindow: '200k',
    speed: 'Deep',
    reasoning: 'Maximum',
    icon: 'Sparkles',
    default: true,
  },
  {
    id: 'zenith-charles',
    name: 'Charles',
    apiModel: 'claude-opus-4-8',
    description: 'High-precision advanced reasoning engine (Opus 4.8)',
    badge: 'Precision',
    contextWindow: '128k',
    speed: 'High',
    reasoning: 'Exceptional',
    icon: 'Brain',
    default: false,
  },
  {
    id: 'zenith-jerald',
    name: 'Jerald',
    apiModel: 'claude-opus-5',
    description: 'Balanced speed & power for everyday tasks (Opus 5)',
    badge: 'Balanced',
    contextWindow: '200k',
    speed: 'Fast',
    reasoning: 'High',
    icon: 'Sparkles',
    default: false,
  },
  {
    id: 'zenith-riezl',
    name: 'Riezl',
    apiModel: 'claude-opus-4-8-thinking',
    description: 'Quick responses with deep thinking mode (Opus 4.8)',
    badge: 'Ultra Fast',
    contextWindow: '128k',
    speed: 'Instant',
    reasoning: 'Balanced',
    icon: 'Zap',
    default: false,
  },
];

export const getModelById = (id) => {
  return ZENITH_MODELS.find((m) => m.id === id) || ZENITH_MODELS[0];
};
