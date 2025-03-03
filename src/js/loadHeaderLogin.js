fetch('../headers/headerLogin.html')
    .then(response => response.text())
    .then(data => document.getElementById('navbar-placeholder').innerHTML = data);