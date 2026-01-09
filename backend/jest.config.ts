import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/__tests__/**/*.test.ts"],

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "src/middleware/**/*.ts",
  ],
};

export default config;
