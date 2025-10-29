/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

declare global {
  const test: typeof import('vitest').test
  const describe: typeof import('vitest').describe
  const it: typeof import('vitest').it
  const expect: typeof import('vitest').expect
  const beforeEach: typeof import('vitest').beforeEach
  const afterEach: typeof import('vitest').afterEach
  const vi: typeof import('vitest').vi
}
