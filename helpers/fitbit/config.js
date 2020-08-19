const config = {};

/// base urls and paths
config.apiHost = 'https://api.fitbit.com';
config.oauthAuthorizeBaseUrl = 'https://www.fitbit.com/oauth2/authorize';
config.oauthTokenPath = '/oauth2/token';
config.apiVersionPath = '/1.2';
config.userBasePath = '/user';
config.currentUserPath = '/-';
config.activitiesBasePath = '/activities';
config.hrBasePath = '/heart';
config.sleepBasePath = '/sleep';
config.dateBasePath = '/date';
config.timeBasePath = '/time';
config.foodBasePath = '/foods/log'
config.weightBasePath = '/body/log/weight'
config.jsonSuffix = '.json';

// derived urls and paths
config.oauthTokenRequestBaseUrl = config.apiHost + config.oauthTokenPath;

// functional urls and paths
config.getApiBaseUrl = () => {
    return config.apiHost + config.apiVersionPath;
};

config.getUserUrl = (user) => {
    var url = config.getApiBaseUrl() + config.userBasePath;

    if (user) {
        url += '/' + user.userId;
    } else {
        url += config.currentUserPath;
    }

    return url;
};

/// TODO: The following fields are sent as-is to Fitbit API. Add a layer of abstraction here.
// fields = {
//    date:
//    period:
//    detailLevel:
//    startDate:
//    endDate:
//    startTime:
//    endTime:
// }
config.getHeartratePath = (fields) => {
    var dataPath = '';

    if (fields.date && fields.period) {
        dataPath += config.dateBasePath + '/' + fields.date + '/' + fields.period;
    }
    if (fields.startDate && fields.endDate) {
        dataPath += config.dateBasePath + '/' + fields.startDate + '/' + fields.endDate;
    }
    if (dataPath != '') {
        if (fields.detailLevel) {
            dataPath += '/' + fields.detailLevel;
        }
        if (fields.startTime && fields.endTime) {
            dataPath += config.timeBasePath + '/' + fields.startTime + '/' + fields.endTime;
        }
    }

    return config.hrBasePath + dataPath;
};

config.getHeartrateUrl = (params) => {
    return config.getUserUrl(params.user) + config.activitiesBasePath + config.getHeartratePath(params.fields) + config.jsonSuffix;
};

config.getActivityPath = (fields) => {
    return config.dateBasePath + '/' + fields.date;
};

config.getActivityUrl = (params) => {
    return config.getUserUrl(params.user) + config.activitiesBasePath + config.getActivityPath(params.fields) + config.jsonSuffix;
};

config.getSleepPath = (fields) => {
    return config.dateBasePath + '/' + fields.date;
};

config.getSleepUrl = (params) => {
    return config.getUserUrl(params.user) + config.sleepBasePath + config.getSleepPath(params.fields) + config.jsonSuffix;
};

config.getFoodPath = (fields) => {
    return config.dateBasePath + '/' + fields.date;
}

config.getFoodUrl = (params) => {
    return config.getUserUrl(params.user) + config.foodBasePath + config.getFoodPath(params.fields) + config.jsonSuffix;
}

config.getWeightPath = (fields) => {
    return config.dateBasePath + '/' + fields.date;
}

config.getWeightUrl = (params) => {
    return config.getUserUrl(params.user) + config.weightBasePath + config.getWeightPath(params.fields) + config.jsonSuffix;
}

module.exports = config;