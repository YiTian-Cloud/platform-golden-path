#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node scripts/new-service.js <service-name>');
  process.exit(1);
}

if (process.argv.length < 3) {
  usage();
}

const rawName = process.argv[2];          // e.g. "orders-api"
const SERVICE_NAME = rawName.toLowerCase();
const SERVICE_CLASS_NAME = toPascalCase(SERVICE_NAME); // OrdersApi

const rootDir = process.cwd();
const templatesDir = path.join(rootDir, 'templates');
const servicesDir = path.join(rootDir, 'services');
const infraDir = path.join(rootDir, 'infra');

function toPascalCase(name) {
  return name
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function copyTemplateDir(srcDir, destDir, tokens) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    let destName = entry.name
      .replace(/{{SERVICE_NAME}}/g, tokens.SERVICE_NAME)
      .replace(/{{SERVICE_CLASS_NAME}}/g, tokens.SERVICE_CLASS_NAME);

    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      copyTemplateDir(srcPath, destPath, tokens);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content
        .replace(/{{SERVICE_NAME}}/g, tokens.SERVICE_NAME)
        .replace(/{{SERVICE_CLASS_NAME}}/g, tokens.SERVICE_CLASS_NAME);
      fs.writeFileSync(destPath, content, 'utf8');
    }
  }
}

const tokens = {
  SERVICE_NAME,
  SERVICE_CLASS_NAME,
};

console.log(`Scaffolding new service: ${SERVICE_NAME}`);

// 1) Service code
const serviceTemplateDir = path.join(templatesDir, 'service');
const serviceDestDir = path.join(servicesDir, SERVICE_NAME);
copyTemplateDir(serviceTemplateDir, serviceDestDir, tokens);
console.log(` → Service created at services/${SERVICE_NAME}`);

// 2) Infra (CDK) code
const infraTemplateDir = path.join(templatesDir, 'infra');
const infraDestDir = path.join(infraDir, `${SERVICE_NAME}-infra`);
copyTemplateDir(infraTemplateDir, infraDestDir, tokens);
console.log(` → Infra created at infra/${SERVICE_NAME}-infra`);

// 3) CI workflow
const ciTemplateDir = path.join(templatesDir, 'ci');
copyTemplateDir(
  ciTemplateDir,
  path.join(rootDir),
  tokens
);
console.log(` → CI workflow added/updated`);

console.log('\nNext steps:');
console.log(`  1. cd services/${SERVICE_NAME} && npm install`);
console.log(`  2. cd ../../infra/${SERVICE_NAME}-infra && npm install`);
console.log('  3. Commit and push to GitHub to see CI run');
