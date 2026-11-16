import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
// Versión visible abajo a la izquierda: vMAYOR.MENOR.N, con N = número de commits. Sube sola con cada cambio publicado.
const mm = JSON.parse(readFileSync('./package.json', 'utf8')).version.split('.').slice(0, 2).join('.');
let n = 0; try { n = parseInt(execSync('git rev-list --count HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString(), 10) || 0; } catch (e) {}
export default { base: './', define: { __BUILD__: JSON.stringify('día-' + new Date().toISOString().slice(5, 16).replace('T', ' ')), __VER__: JSON.stringify('v' + mm + '.' + n) }, build: { chunkSizeWarningLimit: 900 } };
