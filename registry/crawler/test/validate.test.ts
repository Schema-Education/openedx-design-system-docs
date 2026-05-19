/**
 * Tests for src/validate.ts
 *
 * Uses the node:test runner (Node 20+) and local fixtures — no network calls.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifest } from '../src/validate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = resolve(__dirname, '..', '..', '..', 'registry', 'schema', 'component.schema.json');
const FIXTURE_PATH = resolve(__dirname, '..', 'fixtures', 'frontend-app-learning.registry.json');

// Minimal valid component for unit tests.
const validComponent = {
  name: 'CourseCard',
  atomicLevel: 'molecule',
  status: 'stable',
  sourceMfe: 'frontend-app-learning',
  sourceRepo: 'openedx/frontend-app-learning',
  sourcePath: 'src/course-home/CourseCard.jsx',
  version: '5.0.0',
  figmaCodeConnectUrl: null,
  consumers: [],
  a11y: 'AA',
  lastIngested: '2026-05-19T00:00:00Z',
};

describe('validateManifest', () => {
  it('passes validation for the real fixture file', async () => {
    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(FIXTURE_PATH, 'utf-8');
    const data = JSON.parse(raw);

    const result = await validateManifest(data, SCHEMA_PATH);

    assert.equal(result.valid, true, `Fixture should be valid. Errors: ${
      result.valid ? '' : result.errors.join(', ')
    }`);
    if (result.valid) {
      assert.equal(result.manifest.length, 5, 'Fixture should contain 5 components');
    }
  });

  it('passes validation for a single-item valid manifest', async () => {
    const result = await validateManifest([validComponent], SCHEMA_PATH);
    assert.equal(result.valid, true, `Valid manifest should pass. Errors: ${
      result.valid ? '' : result.errors.join(', ')
    }`);
  });

  it('fails when atomicLevel is missing', async () => {
    const { atomicLevel: _omitted, ...withoutAtomicLevel } = validComponent;
    const result = await validateManifest([withoutAtomicLevel], SCHEMA_PATH);

    assert.equal(result.valid, false, 'Manifest missing atomicLevel should fail');
    if (!result.valid) {
      const mentionsField = result.errors.some(
        (e) => e.includes('atomicLevel') || e.includes('required')
      );
      assert.ok(mentionsField, `Errors should mention 'atomicLevel'. Got: ${result.errors.join('; ')}`);
    }
  });

  it('fails when status is an invalid enum value ("beta")', async () => {
    const withBadStatus = { ...validComponent, status: 'beta' };
    const result = await validateManifest([withBadStatus], SCHEMA_PATH);

    assert.equal(result.valid, false, 'Invalid status "beta" should fail validation');
    if (!result.valid) {
      const hasIndexPrefix = result.errors.some((e) => e.startsWith('[0]'));
      assert.ok(hasIndexPrefix, `Errors should include array index prefix. Got: ${result.errors.join('; ')}`);
    }
  });

  it('fails when a11y is an invalid enum value ("compliant")', async () => {
    const withBadA11y = { ...validComponent, a11y: 'compliant' };
    const result = await validateManifest([withBadA11y], SCHEMA_PATH);

    assert.equal(result.valid, false, 'Invalid a11y "compliant" should fail validation');
    if (!result.valid) {
      const mentionsA11y = result.errors.some(
        (e) => e.includes('a11y') || e.includes('must be equal to one of')
      );
      assert.ok(mentionsA11y, `Error should mention 'a11y'. Got: ${result.errors.join('; ')}`);
    }
  });

  it('fails when the manifest is not an array', async () => {
    const result = await validateManifest({ name: 'Button' }, SCHEMA_PATH);
    assert.equal(result.valid, false, 'Non-array input should fail');
  });

  it('includes array index in error messages for multi-entry manifests', async () => {
    const badEntry = { ...validComponent, status: 'beta' };
    const result = await validateManifest([validComponent, badEntry], SCHEMA_PATH);

    assert.equal(result.valid, false, 'Should fail due to second entry');
    if (!result.valid) {
      const hasIndexOne = result.errors.some((e) => e.startsWith('[1]'));
      assert.ok(hasIndexOne, `Should report error at index [1]. Got: ${result.errors.join('; ')}`);
    }
  });
});
