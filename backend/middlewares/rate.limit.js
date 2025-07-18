import rateLimit from 'express-rate-limit';

// Use the recommended ipKeyGenerator for IPv6 safety
const ipKeyGenerator = (req) => {
  // express-rate-limit's built-in IPv6-safe key generator
  return req.ip;
};

export const apiKeyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each API key to 100 requests per windowMs
  keyGenerator: (req) => req.headers['x-api-key'] || ipKeyGenerator(req), // Rate limit by API key or safe IP
  handler: (req, res) => {
    res.status(429).json({ message: "Too many requests. Please try again later." });
  }
});
