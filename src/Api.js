const root = 'http://localhost:8080/';

const Api = {
    'userLogIn': (username, password) => `${root}/user/login?username=${username}&password=${password}`,
    'getDataList': () => `${root}/msg/list`,
    'uploadFile': () => `${root}/msg/uploadFile`,
    'getPlaceCount': () => `${root}/msg/getPlaceCount`,
    'getCategoryCount': () => `${root}/msg/getCategoryCount`,
    'getWordCount': () => `${root}/msg/getWordCount`,
    'getNameCount': () => `${root}/msg/getNameCount`,
    'getDetailByName': (name) => `${root}/msg/nameList/?describes=${name}`,
    'addMessage': (category, location, describes) => `${root}/msg/add?category=${category}&location=${location}&describes=${describes}`,
    'imageRecongnition': () => `${root}/msg/recognition`,
};

export default Api;