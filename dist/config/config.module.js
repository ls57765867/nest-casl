"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfigModule = exports.ConfigLoader = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const yaml = __importStar(require("js-yaml"));
const path_1 = require("path");
const lodash_1 = require("lodash");
class ConfigLoader {
    static load(env) {
        const baseConfig = this.loadYamlConfig('config.yaml');
        const envConfig = this.loadEnvConfig(env);
        const mergedConfig = this.deepMergeConfigs(baseConfig, envConfig);
        return () => mergedConfig;
    }
    static loadYamlConfig(fileName) {
        const filePath = (0, path_1.join)(__dirname, '../../config', fileName);
        if (!(0, fs_1.existsSync)(filePath))
            return {};
        return yaml.load((0, fs_1.readFileSync)(filePath, 'utf8')) || {};
    }
    static loadEnvConfig(env) {
        const configs = [
            this.loadYamlConfig(`config.${env}.yaml`),
            this.loadYamlConfig(`config.${env}.local.yaml`),
        ];
        const envVars = Object.entries(process.env)
            .filter(([key]) => key.startsWith('APP_'))
            .reduce((acc, [key, value]) => {
            const path = key.replace('APP_', '').toLowerCase().split('__');
            this.setDeepValue(acc, path, value);
            return acc;
        }, {});
        return configs.concat(envVars).reduce(this.deepMergeConfigs, {});
    }
    static deepMergeConfigs(target, source) {
        return (0, lodash_1.mergeWith)({}, target, source, (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                return srcValue ?? objValue;
            }
            if ((0, lodash_1.isPlainObject)(objValue)) {
                return this.deepMergeConfigs(objValue, srcValue || {});
            }
            return srcValue !== undefined ? srcValue : objValue;
        });
    }
    static setDeepValue(obj, path, value) {
        const lastKey = path.pop();
        let current = obj;
        for (const key of path) {
            current[key] = current[key] || {};
            current = current[key];
        }
        if (lastKey)
            current[lastKey] = value;
    }
}
exports.ConfigLoader = ConfigLoader;
let EnvConfigModule = class EnvConfigModule {
};
exports.EnvConfigModule = EnvConfigModule;
exports.EnvConfigModule = EnvConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [ConfigLoader.load(process.env.NODE_ENV ?? 'development')],
                isGlobal: true,
            }),
        ],
    })
], EnvConfigModule);
//# sourceMappingURL=config.module.js.map