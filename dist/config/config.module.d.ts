export declare class ConfigLoader {
    static load<T>(env: string): () => T;
    private static loadYamlConfig;
    private static loadEnvConfig;
    private static deepMergeConfigs;
    private static setDeepValue;
}
export declare class EnvConfigModule {
}
