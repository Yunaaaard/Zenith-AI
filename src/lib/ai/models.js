export const ZENITH_MODELS = [
  {
    id: 'zenith-mikel',
    name: 'Mikel',
    apiModel: 'claude-opus-5-thinking',
    provider: 'tabitoken',
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
    apiModel: 'claude-opus-4-8-thinking',
    provider: 'tabitoken',
    description: 'High-precision advanced reasoning engine (Opus 4.8)',
    badge: 'Precision',
    contextWindow: '128k',
    speed: 'High',
    reasoning: 'Exceptional',
    icon: 'Brain',
    default: false,
  },
];

export const getModelById = (id) => {
  return ZENITH_MODELS.find((m) => m.id === id) || ZENITH_MODELS[0];
};
