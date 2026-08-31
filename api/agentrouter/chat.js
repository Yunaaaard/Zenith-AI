/**
 * Vercel Serverless Endpoint for AgentRouter
 * Runs in Vercel's Node.js Serverless Runtime
 * Sets User-Agent: RooCode/3.0.0 server-side (bypasses browser header restriction)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { model, messages, apiKey, stream = true } = req.body || {};
  const activeKey = apiKey || process.env.VITE_AR_API_KEY || 'sk-XPNksTKdCi5W5Mf9KT54UGaqFghTpqASrzM9HKEoBDRxH8mQ';

  try {
    const arResponse = await fetch('https://agentrouter.org/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeKey}`,
        'User-Agent': 'RooCode/3.0.0',
      },
      body: JSON.stringify({
        model: model || 'deepseek-v4-flash',
        messages: messages || [],
        stream: stream === true,
      }),
    });

    if (!arResponse.ok) {
      const errorText = await arResponse.text().catch(() => '');
      return res.status(arResponse.status).send(errorText);
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = arResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      return res.end();
    } else {
      const data = await arResponse.json();
      return res.json(data);
    }
  } catch (err) {
    console.error('Vercel AgentRouter proxy error:', err);
    return res.status(500).json({ error: 'AgentRouter serverless proxy failed', details: err.message });
  }
}
