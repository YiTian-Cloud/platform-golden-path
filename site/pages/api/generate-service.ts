// site/pages/api/generate-service.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import archiver from "archiver";

function toPascalCase(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join("");
}

type Tokens = {
  SERVICE_NAME: string;
  SERVICE_CLASS_NAME: string;
};

function addTemplateDirToArchive(
  archive: archiver.Archiver,
  srcDir: string,
  baseDestDir: string,
  tokens: Tokens
) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);

    let destName = entry.name
      .replace(/{{SERVICE_NAME}}/g, tokens.SERVICE_NAME)
      .replace(/{{SERVICE_CLASS_NAME}}/g, tokens.SERVICE_CLASS_NAME);

    const destPath = path.join(baseDestDir, destName);

    if (entry.isDirectory()) {
      addTemplateDirToArchive(archive, srcPath, destPath, tokens);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      content = content
        .replace(/{{SERVICE_NAME}}/g, tokens.SERVICE_NAME)
        .replace(/{{SERVICE_CLASS_NAME}}/g, tokens.SERVICE_CLASS_NAME);

      archive.append(content, { name: destPath });
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawName = (req.query.name as string | undefined)?.trim();
  if (!rawName) {
    return res.status(400).json({ error: "Missing ?name=service-name" });
  }

  const SERVICE_NAME = rawName.toLowerCase();
  const SERVICE_CLASS_NAME = toPascalCase(SERVICE_NAME);
  const tokens: Tokens = { SERVICE_NAME, SERVICE_CLASS_NAME };

  // templates are in repo root /templates, and site/ is one level deeper
  const repoRoot = path.join(process.cwd(), "..");
  const templatesDir = path.join(repoRoot, "templates");

  const serviceTemplateDir = path.join(templatesDir, "service");
  const infraTemplateDir = path.join(templatesDir, "infra");
  const ciTemplateDir = path.join(templatesDir, "ci");

  // Set headers for zip download
  const zipFileName = `${SERVICE_NAME}-scaffold.zip`;
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${zipFileName}"`
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    console.error("Archiver error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create archive" });
    } else {
      res.end();
    }
  });

  archive.pipe(res);

  // Put generated content into zip structure:
  // services/<service-name>/
  // infra/<service-name>-infra/
  // .github/workflows/...
  addTemplateDirToArchive(
    archive,
    serviceTemplateDir,
    path.join("services", SERVICE_NAME),
    tokens
  );

  addTemplateDirToArchive(
    archive,
    infraTemplateDir,
    path.join("infra", `${SERVICE_NAME}-infra`),
    tokens
  );

  addTemplateDirToArchive(
    archive,
    ciTemplateDir,
    ".",
    tokens
  );

  archive.finalize();
}
