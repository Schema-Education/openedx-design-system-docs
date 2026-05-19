/**
 * Schema validation for registry manifests.
 *
 * Each manifest is a JSON array of component records. We validate each entry
 * individually against `registry/schema/component.schema.json` and aggregate
 * errors with their array index so callers know exactly which component failed.
 */

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
// ajv and ajv-formats are CJS-only packages. We load them via createRequire
// so that TypeScript's NodeNext resolver doesn't choke on the missing `exports`
// field, and cast to the known public interface via the type-only imports below.
//
// We use Ajv2020 (JSON Schema draft 2020-12) because component.schema.json
// declares `"$schema": "https://json-schema.org/draft/2020-12/schema"`.
const _require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const AjvCtor = _require('ajv/dist/2020').default as new (opts?: Record<string, unknown>) => {
  compile: (schema: object) => ValidateFunction;
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const addFormats = _require('ajv-formats').default as (ajv: unknown) => void;

import type { ValidateFunction } from 'ajv';
import type { RegistryManifest } from './types.js';

/** Result of a manifest validation. */
export type ValidationResult =
  | { valid: true; manifest: RegistryManifest }
  | { valid: false; errors: string[] };

/** Cached compiled validator (keyed by schemaPath). */
const validatorCache = new Map<string, ValidateFunction>();

async function getValidator(schemaPath: string): Promise<ValidateFunction> {
  if (validatorCache.has(schemaPath)) {
    return validatorCache.get(schemaPath)!;
  }

  const raw = await readFile(schemaPath, 'utf-8');
  const schema = JSON.parse(raw) as object;

  const ajv = new AjvCtor({ allErrors: true });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  validatorCache.set(schemaPath, validate);
  return validate;
}

/**
 * Validate a parsed manifest (top-level array) against the component schema.
 *
 * @param data       The parsed JSON — expected to be an array.
 * @param schemaPath Absolute path to `component.schema.json`.
 */
export async function validateManifest(
  data: unknown,
  schemaPath: string
): Promise<ValidationResult> {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      errors: ['Manifest must be a JSON array of component objects.'],
    };
  }

  const validate = await getValidator(schemaPath);
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const isValid = validate(entry);
    if (!isValid && validate.errors) {
      for (const err of validate.errors) {
        const field = err.instancePath ? err.instancePath.replace(/^\//, '') : err.params
          ? JSON.stringify(err.params)
          : '(unknown field)';
        errors.push(`[${i}] ${field}: ${err.message ?? 'validation error'}`);
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, manifest: data as RegistryManifest };
}
