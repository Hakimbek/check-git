window.onload = function() {
    /* eslint-disable max-len */
    var isSupportPasswordChange = true;
    var defaultPasswordRestoreError = 'This email is unknown. Please enter your Username of Sign up.';
    var inactiveAccountMessage = 'You no longer have access to CCH AnswerConnect. For assistance, please contact <a href="https://support.cch.com/chat/" target="_blank">customer service</a>.'
    var accountSuspendedMessage = inactiveAccountMessage;
    var accountDelinquentMessage = inactiveAccountMessage;
    var accountTemporaryBlockedMessage = 'The number of login attempts has been exceeded. User is temporarily blocked.';
    var userBlockedAsLoginNumExceededMessage = 'Your account has been temporarily locked because there were too many failed login attempts. Use the “Forgot Password?” link to retrieve your password, or <a href="https://support.cch.com/contact/" target="_blank">contact</a> support for additional assistance.';
    var defaultFailureMessage = 'The site is currently down for maintenance and will be available soon. Please contact <a href="https://support.cch.com/contact/" target="_blank">support</a> if you need additional assistance.';

    /* eslint-enable max-len */

    var BUTTON_VIEW_TYPE_GO_TO_LOGIN_OK = 'OK';
    var BUTTON_VIEW_TYPE_GO_TO_LOGIN_CANCEL = 'Cancel';

    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var forgotPassword = document.querySelector('#forgotPasswordEmail');
    var submitBtn = document.getElementsByClassName('id-login-button')[0];
    var forgotPasswordLink = document.querySelector('.forgot-password-link');
    var loginForm = document.querySelector('.wk-login-form[name="loginFrom"]');
    var forgotPasswordForm = document.querySelector('.forgot-password-form');
    var forgotPasswordSubmitBtn = document.querySelector('.forgot-password-submit');
    var forgotPasswordCancelBtn = document.querySelector('#gotoLogin');
    var restorePasswordInputCont = document.querySelector('.restore-pwd-input-cont');
    var isAgentIE = navigator.userAgent.indexOf('MSIE') > 0 || !(window.ActiveXObject) && 'ActiveXObject' in window;

    username.value ? password.focus() : username.focus();

    if (errorCode !== '$errorMessageKey') {
        loginError = document.querySelector('.login-error-cont');
        loginError.innerHTML = handleAuthErrorCode(errorCode);
        loginError.style.display = 'block';
        document.querySelector('.ping-messages')?.focus();
        document.title = loginErrorViewTitle;
    }

    if (isSupportPasswordChange) {
        var failureMsgCont = document.querySelector('.forgot-password-error');
        var successMsgCont = document.querySelector('.restore-pwd-success-messages');
        var infoMessage = document.querySelector('.forgot-password-form .info-message');
        var isRestorePasswordEnabled = true;
    }

    if (isAgentIE) {
        setupCustomPlaceholders();
    }

    function submitCredentials(event) {
        var isSubmit = username.validity.valid && password.validity.valid;
        if (isSubmit) {
            event.preventDefault();
            submitBtn.disabled = true;
            loginForm.submit();
        }
    }

    if (forgotPasswordLink) {
        var forgotPasswordPh = document.getElementById('forgotPasswordEmailPh');
        var usernamePh = document.getElementById('usernamePh');

        forgotPasswordLink.addEventListener('click', function() {
            restorePasswordInputCont.style.display = 'block';
            forgotPasswordSubmitBtn.style.display = 'block';
            loginForm.style.display = 'none';
            forgotPasswordForm.style.display = 'block';
            forgotPassword.value = username.value;

            if (forgotPasswordPh) {
                forgotPasswordPh.style.visibility = forgotPassword.value.length ? 'hidden' : 'visible';
            }

            forgotPassword.focus();
            changeForgotPasswordView(BUTTON_VIEW_TYPE_GO_TO_LOGIN_CANCEL);
            hideRestorePasswordMessages();
            document.body.classList.toggle('restore-password');
            document.title = forgotPasswordViewTitle;
        });

        forgotPasswordCancelBtn.addEventListener('click', function() {
            loginForm.style.display = 'block';
            forgotPasswordForm.style.display = 'none';
            username.value = forgotPassword.value;

            if (usernamePh) {
                usernamePh.style.visibility = username.value.length ? 'hidden' : 'visible';
            }

            username.focus();
            changeForgotPasswordView(BUTTON_VIEW_TYPE_GO_TO_LOGIN_CANCEL);
            document.body.classList.toggle('restore-password');
            document.title = loginViewTitle;
        });

        forgotPasswordSubmitBtn.addEventListener('click', restorePassword);
    }

    submitBtn.addEventListener('click', submitCredentials);
    loginForm.addEventListener('submit', submitCredentials);

    function hideRestorePasswordMessages() {
        failureMsgCont.style.display = 'none';
        successMsgCont.style.display = 'none';
    }

    function setMobile(mobile) {
        var className = ' mobile';
        var hasClass = (bodyTag.className.indexOf(className) !== -1);

        if (mobile && !hasClass) {
            bodyTag.className += className;

        } else if (!mobile && hasClass) {
            bodyTag.className = bodyTag.className.replace(className, '');
        }
    }

    function getScreenWidth() {
        return (window.outerHeight) ? window.outerWidth : document.body.clientWidth;
    }

    var bodyTag = document.getElementsByTagName('body')[0];
    var width = getScreenWidth();

    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setMobile(true);
    } else {
        setMobile((width <= 480));
        window.onresize = function() {
            width = getScreenWidth();
            setMobile((width <= 480));
        };
    }

    function restorePassword(event) {
        if (!isRestorePasswordEnabled || !forgotPassword.validity.valid) {
            return;
        }

        event.preventDefault();

        var xhr = new XMLHttpRequest();
        var emailInput = document.forms[1].querySelector('#forgotPasswordEmail');
        var restorePasswordUrl = document.forms[1].action + '?cmd=forgotPassword';
        var data = '{"' + emailInput.name + '" : "' + emailInput.value + '"}';
        showPreloader();
        xhr.open('POST', restorePasswordUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');

        hideRestorePasswordMessages();

        xhr.addEventListener('load', function(evt) {
            var response = {};
            try {
                response = JSON.parse(evt.currentTarget.response);
            } catch (e) {
                hidePreloader();
                successMsgCont.firstElementChild.innerText = defaultPasswordRestoreError;
                failureMsgCont.style.display = 'block';
                failureMsgCont.focus();
            }

            if (response.success) {
                restorePasswordInputCont.style.display = 'none';
                forgotPasswordSubmitBtn.style.display = 'none';
                failureMsgCont.style.display = 'none';
                changeForgotPasswordView(BUTTON_VIEW_TYPE_GO_TO_LOGIN_OK);
                successMsgCont.style.display = 'block';
            } else {
                failureMsgCont.style.display = 'block';
                failureMsgCont.focus();
                successMsgCont.style.display = 'none';
            }
            hidePreloader();
        });

        xhr.addEventListener('error', function(evt) {
            failureMsgCont.firstElementChild.innerText = defaultPasswordRestoreError;
            failureMsgCont.style.display = 'block';
            failureMsgCont.focus();
            hidePreloader();
        });

        xhr.send(data);
    }

    function setupCustomPlaceholders() {
        var inputsConfig = [
            { id: 'usernamePh', node: username },
            { id: 'passwordPh', node: password },
            { id: 'forgotPasswordEmailPh', className: 'forgot-password-email-ph', node: forgotPassword }
        ];

        inputsConfig.forEach(function(inputConfig) {
            var inputPh = document.createElement('span');
            var node = inputConfig.node;

            inputPh.id = inputConfig.id;
            inputPh.innerText = node.placeholder;
            inputPh.className += 'ie-placeholder ' + (inputConfig.className || '');
            inputPh.style.visibility = node.value.length ? 'hidden' : 'visible';

            node.placeholder = '';
            node.parentNode.insertBefore(inputPh, node);
            node.parentNode.style.position = 'relative';

            inputPh.addEventListener('click', setInputFocus);
            node.addEventListener('input', handleInput);
        });

        function setInputFocus() {
            this.parentElement.querySelector('input').focus();
        }

        function handleInput(event) {
            event.stopPropagation();

            document.querySelector('#' + this.id + 'Ph').style.visibility = this.value.length ? 'hidden' : 'visible';
        }
    }

    function showPreloader() {
        document.querySelector('.preloader-overlay').style.display = 'block';
    }

    function hidePreloader() {
        document.querySelector('.preloader-overlay').style.display = 'none';
        submitBtn.disabled = false;
    }

    function handleAuthErrorCode(code) {
        switch (code) {
            case '60001': // login failure
            case '60004': // password failure
            case 'loginFailureMessage':
                return loginFailureMessage;
            case '60002':
            case 'accountSuspendedMessage':
                return accountSuspendedMessage;
            case '60030':
            case 'accountDelinquentMessage':
                return accountDelinquentMessage;
            case '60060':
            case 'accountTemporaryBlockedMessage':
            case 'blocked':
                return accountTemporaryBlockedMessage;
            case '60200':
            case 'userBlockedAsLoginNumExceeded':
                return userBlockedAsLoginNumExceededMessage;
            default:
                return defaultFailureMessage;
        }
    }

    function changeForgotPasswordView(viewType) {
        if (viewType === BUTTON_VIEW_TYPE_GO_TO_LOGIN_OK &&
            forgotPasswordCancelBtn.classList.contains('back-to-login')) {
            infoMessage.style.display = 'none';
            forgotPasswordCancelBtn.classList.toggle('wk-button-full');
            forgotPasswordCancelBtn.classList.toggle('wk-button-secondary');
            forgotPasswordCancelBtn.classList.toggle('back-to-login');
            forgotPasswordCancelBtn.classList.toggle('go-to-login');
            forgotPasswordCancelBtn.innerText = BUTTON_VIEW_TYPE_GO_TO_LOGIN_OK;
        }

        if (viewType === BUTTON_VIEW_TYPE_GO_TO_LOGIN_CANCEL &&
            forgotPasswordCancelBtn.classList.contains('go-to-login')) {
            forgotPasswordCancelBtn.classList.toggle('wk-button-full');
            forgotPasswordCancelBtn.classList.toggle('wk-button-secondary');
            forgotPasswordCancelBtn.classList.toggle('back-to-login');
            forgotPasswordCancelBtn.classList.toggle('go-to-login');
            infoMessage.style.display = 'block';
            forgotPasswordCancelBtn.innerText = BUTTON_VIEW_TYPE_GO_TO_LOGIN_CANCEL;
        }
    }
};
