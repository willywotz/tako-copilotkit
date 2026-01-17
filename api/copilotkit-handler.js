// Vercel Serverless Function for Tako Research Canvas Agent
// This replaces the Express server for production deployment

const { graph } = require('../agents/dist/agent.js');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['POST', 'OPTIONS']
    });
  }

  try {
    console.log('Agent invocation started');

    // Invoke the LangGraph agent
    const result = await graph.invoke(req.body);

    console.log('Agent invocation completed');
    return res.status(200).json(result);

  } catch (error) {
    console.error('Agent error:', error);

    // Return error with details in development
    return res.status(500).json({
      error: error.message || 'Internal server error',
      type: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
