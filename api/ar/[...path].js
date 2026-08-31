/**
 * Vercel Serverless Proxy for AgentRouter
 * Injects required User-Agent: RooCode/3.0.0 header
 * Routes: /api/ar/* → https://agentrouter.org/v1/*
 */
export default async function handler(req, res) {
  const path = req.query.path;
  const targetPath = Array.isArray(path) ? path.join('/') : path || '';
  const targetUrl = `https://agentrouter.org/v1/${targetPath}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'RooCode/3.0.0',
    };

    // Forward Authorization header from client, or fallback to server env key / working key
    const defaultArKey = process.env.VITE_AR_API_KEY || process.env.AR_API_KEY || 'sk-XPNksTKdCi5W5Mf9KT54UGaqFghTpqASrzM9HKEoBDRxH8mQ';
    if (req.headers.authorization && req.headers.authorization.length > 10) {
      headers['Authorization'] = req.headers.authorization;
    } else if (defaultArKey) {
      headers['Authorization'] = `Bearer ${defaultArKey}`;
    }

    const requestBody = req.body
      ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body))
      : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? requestBody : undefined,
    });

    // Forward streaming response
    const contentType = response.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    res.status(response.status);

    if (contentType.includes('text/event-stream') || contentType.includes('stream')) {
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.end();
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (err) {
    console.error('AgentRouter proxy error:', err);
    res.status(500).json({ error: 'AgentRouter proxy failed', details: err.message });
  }
}
