const root = 'http://localhost:8080/';

const Api = {
    'userLogIn': (username, password) => `${root}/user/login?username=${username}&password=${password}`,
    'getDataList': () => `${root}/msg/list`,
};

export default Api;