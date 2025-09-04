import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function syncVersions() {
  try {
    // Ler versão do package.json raiz
    const rootPackagePath = join(__dirname, '.', 'package.json');
    const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf8'));
    const version = rootPackage.version;

    // Atualizar frontend/package.json
    const frontendPackagePath = join(__dirname, '.', 'frontend', 'package.json');
    const frontendPackage = JSON.parse(readFileSync(frontendPackagePath, 'utf8'));
    
    frontendPackage.version = version;
    writeFileSync(frontendPackagePath, JSON.stringify(frontendPackage, null, 2) + '\n');

    console.log(`✅ Versões sincronizadas: ${version}`);
  } catch (error) {
    console.error('❌ Erro ao sincronizar versões:', error);
    process.exit(1);
  }
}

syncVersions();