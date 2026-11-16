export default { base: './', define: { __BUILD__: JSON.stringify('día-' + new Date().toISOString().slice(5, 16).replace('T', ' ')) }, build: { chunkSizeWarningLimit: 900 } };
