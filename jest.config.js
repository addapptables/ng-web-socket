module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testEnvironment: "jsdom",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.spec.ts"],
  moduleNameMapper: {
    "^@addapptables/ng-web-socket$":
      "<rootDir>/projects/addapptables/ng-web-socket/src/public-api.ts",
    "^@addapptables/ng-socket-io$":
      "<rootDir>/projects/addapptables/ng-socket-io/src/public-api.ts",
    "^@addapptables/ng-signal-r$":
      "<rootDir>/projects/addapptables/ng-signal-r/src/public-api.ts",
  },
  transform: {
    "^.+\\.(ts|js|mjs|html|svg)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.(html|svg)$",
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$|@angular|rxjs)"],
  collectCoverageFrom: [
    "projects/**/src/lib/**/*.ts",
    "!projects/**/src/lib/**/index.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
};
