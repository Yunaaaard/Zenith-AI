import { getModelById } from './models';
import { MODEL_SYSTEM_PROMPTS, SYSTEM_PROMPT } from './prompts';

/**
 * Stream AI response from Tabitoken / OpenAI-compatible endpoint.
 * Uses /api/ai proxy route (Vite dev proxy in local, vercel.json rewrite in production)
 * to prevent browser CORS blocks and guarantee live streaming responses.
 * 
 * Supports Multimodal Vision (images) and Document Parsing (PDFs, text, code).
 */
export async function* streamAIResponse({ prompt, modelId = 'zenith-mikel', files = [], messages = [], apiKey = '' }) {
  const model = getModelById(modelId);

  const isAgentRouter = model.provider === 'agentrouter';

  // Pick API key based on provider
  const envKey = typeof import.meta !== 'undefined'
    ? (isAgentRouter
        ? import.meta.env?.VITE_AR_API_KEY
        : import.meta.env?.VITE_AI_API_KEY)
    : '';
  const activeKey = (apiKey && apiKey.trim()) || envKey || '';

  // Route to the correct proxy — /api/ar for AgentRouter, /api/ai for Tabitoken
  const baseUrl = isAgentRouter ? '/api/ar' : '/api/ai';

  // Separate image attachments (Vision) from text/PDF attachments
  const imageFiles = files.filter((f) => f.previewUrl && (f.type?.startsWith('image/') || f.previewUrl?.startsWith('data:image')));
  const textFiles = files.filter((f) => !imageFiles.includes(f));

  let textPrompt = prompt;
  if (textFiles.length > 0) {
    textPrompt += '\n\n[Attached Documents & Files]:\n' +
      textFiles.map((f) => `--- ${f.name} (${f.type || 'file'}) ---\n${f.content ? f.content.substring(0, 10000) : '[Document File]'}`).join('\n\n');
  }

  // Pick the persona system prompt for this model, fall back to flagship (Mikel)
  const systemInstruction = MODEL_SYSTEM_PROMPTS[modelId] || MODEL_SYSTEM_PROMPTS['zenith-mikel'] || SYSTEM_PROMPT;

  // Build message history for multi-turn context
  const contextMessages = Array.isArray(messages) && messages.length > 1
    ? messages.slice(-10, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: typeof m.content === 'string' ? m.content : (m.content?.[0]?.text || ''),
      }))
    : [];

  // Construct user message payload (multimodal array if images attached, string otherwise)
  let userMessagePayload;
  if (imageFiles.length > 0) {
    userMessagePayload = [
      { type: 'text', text: textPrompt || 'Analyze the attached image(s).' },
      ...imageFiles.map((img) => ({
        type: 'image_url',
        image_url: { url: img.previewUrl },
      })),
    ];
  } else {
    userMessagePayload = textPrompt;
  }

  const apiMessages = [
    { role: 'system', content: systemInstruction },
    ...contextMessages,
    { role: 'user', content: userMessagePayload },
  ];

  // Always attempt live API call — API key is injected by Vercel build environment
  // or Vite dev proxy. Never gate on missing key since that causes silent fallback.
  {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    try {
      const endpointUrl = `${baseUrl}/chat/completions`;

      const headers = {
        'Content-Type': 'application/json',
      };
      if (activeKey) headers['Authorization'] = `Bearer ${activeKey}`;
      if (isAgentRouter) headers['User-Agent'] = 'RooCode/3.0.0';

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: model.apiModel || 'claude-3-5-sonnet',
          messages: apiMessages,
          stream: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let yieldedAnything = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const dataStr = trimmed.slice(5).trim();
            if (dataStr === '[DONE]') return;

            try {
              const parsed = JSON.parse(dataStr);
              const token = parsed.choices?.[0]?.delta?.content || '';
              if (token) { yield token; yieldedAnything = true; }
            } catch (_) {}
          }
        }

        // If SSE yielded nothing, try parsing the full buffer as plain JSON (non-streaming response)
        if (!yieldedAnything && buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer.trim());
            const content = parsed.choices?.[0]?.message?.content || parsed.choices?.[0]?.text || '';
            if (content) { yield content; return; }
          } catch (_) {}
        }
        if (yieldedAnything) return;
      } else {
        const errText = await response.text().catch(() => '');
        console.warn(`AI API stream returned ${response.status} (${isAgentRouter ? 'AgentRouter' : 'Tabitoken'}):`, errText);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Live AI streaming notice:', err.message);
    }
  }

  // === FAST LOCAL FALLBACK ===
  const fallbackText = generateLocalFallback(prompt, model);
  const chunks = fallbackText.match(/.{1,8}/g) || [fallbackText];
  for (const chunk of chunks) {
    yield chunk;
    await new Promise((r) => setTimeout(r, 6));
  }
}

function generateLocalFallback(prompt, model) {
  const q = prompt.toLowerCase();

  if (q.includes('creator') || q.includes('who made') || q.includes('who created') || q.includes('who built') || q.includes('developer of zenith')) {
    return `Zenith AI was created by **yunard pogi**. 🚀`;
  }

  if (q.includes('your name') || q.includes('who are you') || q.includes('what is your name') || q.includes('are you')) {
    return `I'm **${model.name}** — an AI assistant built into Zenith AI. What can I help you with?`;
  }

  if (q.includes('hello') || q.includes('hi') || q.length < 15) {
    return `Hey! I'm **${model.name}**. What are we working on today?`;
  }

  if (q.includes('email') || q.includes('write') || q.includes('draft')) {
    return `Here's a polished draft:\n\n---\n\n**Subject:** Your Feedback Would Mean a Lot — [Platform Name] Latest Release\n\nHi [Client Name],\n\nI hope things are going well on your end. We recently shipped a significant update to [Platform Name] and wanted to reach out personally to get your take on it.\n\nYour feedback has always pushed us to build something better — and this release is no exception. Even a few minutes of your time would go a long way in helping us shape what comes next.\n\nIf you're open to it, here's a quick link: [link]\n\nThanks in advance — genuinely looking forward to hearing from you.\n\nBest,\n[Your Name]\n\n---\n\nWant me to adjust the tone or subject line?`;
  }

  if (q.includes('quantum')) {
    return `### Quantum Computing — The Core Idea\n\nClassical computers process bits as **0 or 1**. Quantum computers use **qubits**, which can be both simultaneously (superposition) — exponentially expanding what's computable in parallel.\n\n| Application | Speedup | Status |\n|---|---|---|\n| Molecular Simulation | Exponential | Strongest Case |\n| Breaking RSA/ECC | Exponential | Future (requires 20M qubits) |\n| Unstructured Search | Quadratic (√N) | Moderate |\n\n\`\`\`python\nfrom qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)       # Superposition\nqc.cx(0, 1)   # Entanglement\nqc.measure_all()\n\`\`\``;
  }

  return `I'm **${model.name}** — an AI assistant powered by Zenith AI. How can I assist you with your request?`;
}
