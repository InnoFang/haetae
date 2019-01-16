const root = 'http://localhost:8080/';

const Api = {
    'userLogIn': (username, password) => `${root}/user/login?username=${username}&password=${password}`,
    'getDataList': () => `${root}/msg/list`,
    'uploadFile': () => `${root}/msg/uploadFile`,
    'getPlaceCount': () => `${root}/msg/getPlaceCount`,
    'getPlaceCountByDate': (start, end) => `${root}/msg/getPlaceCount?start=${start}&end=${end}`,
    'getCategoryCount': () => `${root}/msg/getCategoryCount`,
    'getCategoryCountByDate': (start, end) => `${root}/msg/getCategoryCount?start=${start}&end=${end}`,
    'getWordCount': () => `${root}/msg/getWordCount`,
    'getNameCount': () => `${root}/msg/getNameCount`,
    'getDetailByName': (name) => `${root}/msg/nameList/?describes=${name}`,
    'addMessage': (category, location, describes) => `${root}/msg/add?category=${category}&location=${location}&describes=${describes}`,
    'imageRecongnition': () => `${root}/msg/recognition`,
    'getName': () => `${root}/name/getName`,
    'uploadPersonnelFile': () => `${root}/name/uploadFile`
};

export default Api;