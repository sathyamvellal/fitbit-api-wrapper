class FitbitConfig {
    constructor(keys) {
        this.keys = keys;
    }

    getConfig() {
        return {
            clientId: this.keys.clientId,
            clientSecret: this.keys.clientSecret,
            apiVersion: '1.2',
            scope: 'activity heartrate sleep nutrition weight'
        }
    }
};

module.exports = FitbitConfig;