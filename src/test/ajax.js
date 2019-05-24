const xhr = new XMLHttpRequest();
xhr.addEventListener('load', () => console.log(xhr.response));
xhr.open('GET', 'http://localhost:3000/example/sdfd?sdsd=223');
xhr.send();
