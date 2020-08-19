const fetch = require('node-fetch');
const url = require('url');

const config = require('./config');

class FitbitApi {
    constructor(config) {
        this.clientId = config.clientId;
        this.scope = config.scope;
        this.apiVersion = config.apiVersion;
        this.basicToken = Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64');
        this.token = undefined;
    };

    /// TODO: Convert this into a promise to maintain consistency.
    getAuthorizationUrl() {
        var authorizationUrl = config.oauthAuthorizeBaseUrl;
        authorizationUrl += '?client_id=' + this.clientId;
        authorizationUrl += '&response_type=code';
        authorizationUrl += '&scope=' + this.scope;

        return authorizationUrl;
    };

    /// TODO: Convert this into a promise to maintain consistency.
    getTokenRequestUrl() {
        return config.oauthTokenRequestBaseUrl;
    };

    /// TODO: This is currently persisting the token. Something needs to be done here.
    getToken(code) {
        var params = new url.URLSearchParams();
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('client_id', this.clientId);
        var that = this;

        return fetch(this.getTokenRequestUrl(), {
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + this.basicToken
            },
            body: params
        }).then(data => data.json()).then(data => {
            that.token = {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: data.expires_in,
                scope: data.scope
            };
            return that.token;
        }).catch((err) => {
            return err;
        });
    };

    _error(message) {
        return new Promise((resolve, reject) => {
            reject(message);
        })
    }

    getHeartrateData(params) {
        if ((this.token === undefined || this.token.accessToken === undefined)) { 
            return this._error("Invalid token..."); 
        }

        const heartrateUrl = config.getHeartrateUrl(params);
        var that = this;
        return fetch(heartrateUrl, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + that.token.accessToken
            }
        }).then(data => data.json()).then(data => {
            /// TODO: format this data before sending to upper layers
            return data;
        }).catch(err => {
            return err;
        });
    };

    getActivityData(params) {
        if ((this.token === undefined || this.token.accessToken === undefined)) { 
            return this._error("Invalid token..."); 
        }

        const activityUrl = config.getActivityUrl(params);
        var that = this;
        return fetch(activityUrl, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + that.token.accessToken
            }
        }).then(data => data.json()).then(data => {
            /// TODO: fomat this data before sending to upper layers
            return data;
        }).catch(err => {
            return err;
        });
    };

    getSleepData(params) {
        if ((this.token === undefined || this.token.accessToken === undefined)) {
            return this._error("Invalid token...");
        }

        const sleepUrl = config.getSleepUrl(params);
        var that = this;
        return fetch(sleepUrl, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + that.token.accessToken
            }
        }).then(data => data.json()).then(data => {
            /// TODO: format this data before sending to upper layers
            return data;
        }).catch(err => {
            return err;
        });
    };

    getFoodData(params) {
        if ((this.token === undefined || this.token.accessToken === undefined)) {
            return this._error("Invalid token...");
        }

        const foodUrl = config.getFoodUrl(params);
        var that = this;
        return fetch(foodUrl, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + that.token.accessToken
            }
        }).then(data => data.json()).then(data => {
            /// TODO: format this data before sending to upper layers
            return data;
        }).catch(err => {
            return err;
        });
    };

    getWeightData(params) {
        if ((this.token === undefined || this.token.accessToken === undefined)) {
            return this._error("Invalid tokne...");
        }

        const weightUrl = config.getWeightUrl(params);
        var that = this;
        return fetch(weightUrl, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + that.token.accessToken
            }
        }).then(data => data.json()).then(data => {
            /// TODO: format this data before sending to upper layers
            return data;
        }).catch(err => {
            return err;
        });
    };

    getAllData(params) {
        if ((this.token === undefined || this.token.accessToken === undefined)) {
            return this._error("Invalid token...");
        }

        var that = this;
        return new Promise((resolve, reject) => {
            Promise.all([
                that.getActivityData(params),
                that.getHeartrateData(params),
                that.getSleepData(params),
                that.getFoodData(params),
                that.getWeightData(params)
            ]).then((results) => {
                resolve({
                    activity: results[0],
                    hr: results[1],
                    sleep: results[2],
                    food: results[3],
                    weight: results[4]
                });
            }).catch((err) => {
               reject(err);
            });
        });
    };
};

module.exports = FitbitApi;