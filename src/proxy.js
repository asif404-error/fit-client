const { createServer } = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  changeOrigin: true,
  pathFilter: "/api",
});