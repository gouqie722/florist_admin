document.getElementsByTagName('button')[0].addEventListener('click', () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/user/getUsers');
  xhr.setRequestHeader('token', localStorage.getItem('token') || '');
  xhr.withCredentials = true;
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const res = JSON.parse(xhr.responseText);
      console.log(xhr, res);
    }
  }
}, false);
document.getElementsByTagName('button')[1].addEventListener('click', () => {
  axios.post('/api/user/login', {
    username: 'admin',
    password: '123'
  }, {
    // headers: {'token': localStorage.getItem('token')},
  })
  .then(function (response) {
    console.log(response);
    const { token } = response.data.data;
    localStorage.setItem('token', token);
  })
  .catch(function (error) {
    console.log(error);
  });
}, false);
document.getElementsByTagName('button')[2].addEventListener('click', () => {
  axios.post('/api/user/loginOut', {}, {
    headers: { token: localStorage.getItem('token') },
  })
  .then(function (response) {
    console.log(response);
    localStorage.removeItem('token');
  })
  .catch(function (error) {
    console.log(error);
  });
}, false)
console.log(axios);

const input = document.getElementsByTagName('input')[0];
const img = document.getElementsByTagName('img')[0];
input.onchange = function(){
  var file = input.files[0];
  console.log(file);
  var form = new FormData();
  form.append("file", file); //第一个参数是后台读取的请求key值
  form.append("fileName", file.name);
  // form.append("other", "666666"); //实际业务的其他请求参数
  var xhr = new XMLHttpRequest();
  var action = 'http://localhost:3000/api/upload'; //上传服务的接口地址
  xhr.open("POST", action);
  xhr.setRequestHeader('token', localStorage.getItem('token') || '');
  xhr.send(form); // 发送表单数据
  xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status == 200){
      var resultObj = JSON.parse(xhr.responseText);
      console.log(resultObj, '文件上传');
      img.src = resultObj.data.filepath;
    }
  }
}

const button = document.getElementsByTagName('button')[3];
button.addEventListener('click', () => {
  axios.post('/api/user/register', {
    // username: 'admin',
    // password: '123',
    // role: 'admin',
    // phone: 1233,
    // introduce: '管理员',
    // headImg: 'https://www.xueyueob.cn/cube/cube01.bmp',
    username: 'editor',
    password: '456',
    role: 'editor',
    phone: 123322,
    introduce: '搬砖码农',
    headImg: 'https://www.xueyueob.cn/cube/cube02.bmp',
  }, {})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}, false);

const putBtn = document.getElementsByClassName('put')[0];
putBtn.addEventListener('click', () => {
  axios.post('/api/flower/add', {
    name: '玫瑰',
    imgUrl: 'http://localhost:3000/upload/94329cd243cd027f123cde700.png',
    type: '切花',
    expiration: Date.now() + 1000 * 60 * 60 * 24 * 10,
    price: 1,
    hot: 2,
    stock: 99,
    describe: '玫瑰(英文名称：rose)：是蔷薇目，蔷薇科、蔷薇属多种植物和培育花卉的通称名字',
  }, {
    headers: { token: localStorage.getItem('token') },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}, false);


const item = document.getElementsByClassName('item')[0];
item.addEventListener('click', () => {
  axios.get('/api/flower/list', {
    headers: { token: localStorage.getItem('token') },
  })
  .then(function (response) {
    console.log(response.data, '商品列表');
  })
  .catch(function (error) {
    console.log(error);
  });
}, false)

const cart = document.getElementsByClassName('cart')[0];
cart.addEventListener('click', () => {
  axios.get('/api/cart/list', {
    headers: { token: localStorage.getItem('token') },
  })
  .then(function (response) {
    console.log(response.data, '购物车列表');
  })
  .catch(function (error) {
    console.log(error);
  });
}, false);


const cart_add = document.getElementsByClassName('cart_add')[0];
cart_add.addEventListener('click', () => {
  axios.post('/api/cart/add', {
    num: 2,
    flowerId: '63b05a08c2a8a4eb211e6a54'
  }, {
    headers: { token: localStorage.getItem('token') },
  })
  .then(function (response) {
    console.log(response.data, '添加成功 =》购物车');
  })
  .catch(function (error) {
    console.log(error);
  });
}, false);

const clear = document.getElementsByClassName('clear')[0];
clear.addEventListener('click', () => {
  axios.post('/api/cart/clear', {}, {
    headers: { token: localStorage.getItem('token') },
  })
  .then(function (response) {
    console.log(response.data, '清空成功 =》购物车');
  })
  .catch(function (error) {
    console.log(error);
  });
}, false);