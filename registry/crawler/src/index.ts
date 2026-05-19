#!/usr/bin/env node
/**
 * ods-crawler CLI
 *
 * Commands:
 *   validate <path>          Validate a manifest JSON file against the schema.
 *   ingest [--from-fixtures] [--output <dir>]
 *                            Ingest manifests from configured sources and emit MDX.
 *   --help                   Show usage.
 */

import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { validateManifest } from './validate.js';
import { ingestAll, resolveDefaults } from './ingest.js';

const args = process.argv.slice(2);

function printHelp(): void {
  console.log(`
ods-crawler — Open edX Design System registry crawler

USAGE
  ods-crawler validate <path-to-manifest>
      Validate a paragon.registry.json file against the component schema.
      Exits 0 on pass, 1 on failure.

  ods-crawler ingest [options]
      Fetch all configured MFE manifests, validate, and emit MDX docs.

      Options:
        --from-fixtures     Only process sources with ref="fixture" (local files)
        --output <dir>      Override the MDX output directory
                            (default: <repo-root>/site/content/registry)

  ods-crawler --help
      Show this message.
`);
}

async function cmdValidate(manifestPath: string): Promise<void> {
  const { schemaPath } = resolveDefaults();
  const absoluteManifest = resolve(process.cwd(), manifestPath);

  let raw: string;
  try {
    raw = await readFile(absoluteManifest, 'utf-8');
  } catch {
    console.error(`Error: Could not read file: ${absoluteManifest}`);
    process.exit(1);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error(`Error: File is not valid JSON: ${absoluteManifest}`);
    process.exit(1);
  }

  const result = await validateManifest(data, schemaPath);

  if (result.valid) {
    console.log(`✓ Manifest is valid. ${result.manifest.length} component(s) found.`);
    process.exit(0);
  } else {
    console.error(`✗ Manifest validation failed with ${result.errors.length} error(s):\n`);
    for (const err of result.errors) {
      console.error(`  ${err}`);
    }
    process.exit(1);
  }
}

async function cmdIngest(argv: string[]): Promise<void> {
  const { outputDir: defaultOutput, schemaPath } = resolveDefaults();

  let fromFixtures = false;
  let outputDir = defaultOutput;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--from-fixtures') {
      fromFixtures = true;
    } else if (argv[i] === '--output' && argv[i + 1]) {
      outputDir = resolve(process.cwd(), argv[i + 1]!);
      i++;
    }
  }

  console.log(`Ingesting manifests → ${outputDir}\n`);

  const results = await ingestAll({ outputDir, schemaPath, fromFixtures });

  let totalComponents = 0;
  let totalErrors = 0;

  for (const r of results) {
    totalComponents += r.components;
    totalErrors += r.errors.length;

    const status = r.errors.length > 0 ? '✗' : '✓';
    console.log(`${status} ${r.source}: ${r.components} component(s) written`);

    if (r.written.length > 0) {
      for (const p of r.written) {
        console.log(`    → ${p}`);
      }
    }

    if (r.errors.length > 0) {
      for (const e of r.errors) {
        console.error(`    ERROR: ${e}`);
      }
    }
  }

  console.log(`\nDone. ${totalComponents} component(s) written, ${totalErrors} error(s).`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

// ---- dispatch ----------------------------------------------------------------

const command = args[0];

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
} else if (command === 'validate') {
  const manifestPath = args[1];
  if (!manifestPath) {
    console.error('Error: "validate" requires a path argument.\n');
    printHelp();
    process.exit(1);
  }
  await cmdValidate(manifestPath);
} else if (command === 'ingest') {
  await cmdIngest(args.slice(1));
} else {
  console.error(`Error: Unknown command "${command}"\n`);
  printHelp();
  process.exit(1);
}
