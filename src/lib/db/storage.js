import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/client';
import { getStoredConversations } from './conversations';

const SETTINGS_KEY = 'zenith_ai_user_settings';

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  language: 'English',
  density: 'comfortable',
  defaultModel: 'zenith-mikel',
  responseStyle: 'balanced',
  temperature: 0.7,
  streaming: true,
  saveHistory: true,
  autoTitle: true,
  apiKey: '',
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Save settings error:', e);
  }
};

/**
 * Computes live analytics metrics from Firestore user conversations data
 */
export const calculateFirestoreAnalytics = (conversations = []) => {
  let totalRequests = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  const modelCounts = {};

  const daysMap = {
    Sun: { requests: 0, tokens: 0 },
    Mon: { requests: 0, tokens: 0 },
    Tue: { requests: 0, tokens: 0 },
    Wed: { requests: 0, tokens: 0 },
    Thu: { requests: 0, tokens: 0 },
    Fri: { requests: 0, tokens: 0 },
    Sat: { requests: 0, tokens: 0 },
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  conversations.forEach((conv) => {
    const messages = conv.messages || [];

    messages.forEach((msg) => {
      if (msg.role === 'user') {
        totalRequests += 1;
        const estInput = Math.ceil((msg.content?.length || 0) / 4);
        totalInputTokens += estInput;

        let dayName = 'Today';
        if (conv.createdAt) {
          const d = new Date(conv.createdAt);
          if (!isNaN(d.getTime())) dayName = dayNames[d.getDay()];
        }
        if (daysMap[dayName]) {
          daysMap[dayName].requests += 1;
          daysMap[dayName].tokens += estInput;
        }
      } else if (msg.role === 'assistant') {
        const estOutput = Math.ceil((msg.content?.length || 0) / 4);
        totalOutputTokens += estOutput;

        const modelName = msg.model || 'Claude Opus 5';
        modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;
      }
    });
  });

  const totalTokens = totalInputTokens + totalOutputTokens;
  const estimatedCost = +(totalTokens * 0.000002).toFixed(4);

  const dailyLogs = dayNames.map((d) => ({
    date: d,
    requests: daysMap[d].requests,
    tokens: daysMap[d].tokens,
  }));

  const modelKeys = Object.keys(modelCounts);
  const totalModelReqs = totalRequests || 1;

  const modelUsage = modelKeys.length > 0
    ? modelKeys.map((name) => ({
        model: name,
        count: modelCounts[name],
        percentage: Math.round((modelCounts[name] / totalModelReqs) * 100),
      }))
    : [
        { model: 'Claude Opus 5', count: totalRequests, percentage: 100 },
      ];

  return {
    todayRequests: totalRequests,
    totalTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    estimatedCost,
    dailyLogs,
    modelUsage,
  };
};

/**
 * Sync usage analytics document to Firestore
 */
export const recordUsageToFirestore = async (userId, inputLength, outputLength, modelId) => {
  const estInput = Math.ceil(inputLength / 4);
  const estOutput = Math.ceil(outputLength / 4);

  if (isFirebaseConfigured && db && userId) {
    try {
      const statsRef = doc(db, 'users', userId, 'analytics', 'usage');
      const snap = await getDoc(statsRef);

      const current = snap.exists() ? snap.data() : { totalRequests: 0, totalTokens: 0, inputTokens: 0, outputTokens: 0 };

      await setDoc(statsRef, {
        totalRequests: (current.totalRequests || 0) + 1,
        totalTokens: (current.totalTokens || 0) + estInput + estOutput,
        inputTokens: (current.inputTokens || 0) + estInput,
        outputTokens: (current.outputTokens || 0) + estOutput,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore analytics record notice:', e);
    }
  }
};

export const recordUsage = (inputLength, outputLength, modelId) => {
  return recordUsageToFirestore(null, inputLength, outputLength, modelId);
};

export const getStoredUsageStats = (userId) => {
  return calculateFirestoreAnalytics(getStoredConversations(userId));
};
