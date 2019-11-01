class ConfigurationApp {

    constructor() {}

    static get port(): number {
        return parseInt(process.env.PORT || '3001', 10);
    }

    static get database() : string {
        return process.env.HOSTDB || ""
    }

    static get seed(): string {
        return process.env.SEED || 'seed-de-desarrollo';
    }

    static get token_expire(): string {
        return process.env.TOKEN_EXPIRE || '24h';
    }
}

export default ConfigurationApp;
