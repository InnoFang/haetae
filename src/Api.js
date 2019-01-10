const root = 'http://localhost:8080/';

const Api = {
    'userLogIn': (username, password) => `${root}/user/login?username=${username}&password=${password}`,
    'getDataList': () => `${root}/msg/list`,
    'uploadFile': () => `${root}/msg/uploadFile`,
    'getPlaceCount': () => `${root}/msg/getPlaceCount`,
    'getCategoryCount': () => `${root}/msg/getCategoryCount`,
    'getWordCount': () => `${root}/msg/getWordCount`,

};

export default Api;