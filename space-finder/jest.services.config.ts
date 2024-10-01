import { Config } from "@jest/types";

const baseTestDir = '<rootDir>/test/services/spaces';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        `${baseTestDir}/**/*test.ts`
    ]
}

export default config;