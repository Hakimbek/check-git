(function() {
    var loginForm = document.getElementById('loginFrom');
    var userId = document.getElementById('userId');

    userId.focus();

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        userId.value = userId.value.trim();
        loginForm.submit();
    });
})();
