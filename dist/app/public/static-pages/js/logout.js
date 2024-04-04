(function(win) {
    var booleanRegExp = /true|false/i;
    win.parseQuery = function (query) {
        return query
            .replace('?', '')
            .split('&')
            .reduce(function(acc, pairStr) {
                var pair = pairStr.split('=');
                if (pair.length > 1) {
                    acc[pair[0]] = booleanRegExp.test(pair[1]) ? JSON.parse(pair[1].toLowerCase()) : pair[1];
                }

                return acc;
            }, {});
    };
})(window);

(function(win) {
    win.history.pushState(null, null, win.location.href);
    win.onpopstate = function () {
        win.history.forward();
    };
    win.history.back();
})(window);

(function(win) {
    var loginButton = document.getElementById('login-button');
    var query = win.parseQuery(location.search);

    // ACUS-1632: disable trial period banner
    // initTrialBanner(query);
    initLoggedOffText(query);

    loginButton.addEventListener(
        'click',
        loginLinkClicked,
        {
            once: true
        }
    );

    function loginLinkClicked(e) {
        loginButton.setAttribute('disabled', true);
        loginButton.classList.toggle('loading');
    }

    function initTrialBanner(query) {
        var trialBannerDiv = document.getElementsByClassName('csn-trial-period-banner')[0];

        if (!query.trial) {
            trialBannerDiv.style.display = 'none';
        } else {
            trialBannerDiv.classList.add(query.expired ? 'trial-is-expired' : 'trial-is-active');

            if (!query.expired) {
                var trialActiveMessageElement = trialBannerDiv.getElementsByClassName('trial-active-message')[0];
                trialActiveMessageElement.textContent = trialActiveMessageElement.textContent.replace('<%= daysLeftCount %>', query.daysLeft || '');
            }
        }
    }

    function initLoggedOffText(query) {
        var loggedOffText = '';
        var loggedOffTextElement = document.getElementsByClassName('logged-off-text')[0];

        switch(query.reason) {
            case 'subscriptionend': {
                loggedOffText = [
                    'Your subscription is not currently active. For assistance, please contact Customer Support at ',
                    wkVars['csn.support'].upsellPhone
                ].join('');
                break;
            }
            case 'inactivitysessionend': {
                loggedOffText = 'You have been logged off due to inactivity and your session has ended';
                break;
            }
            default: {
                loggedOffText = 'You have logged out and your session has ended.';
            }
        }

        loggedOffTextElement.textContent = loggedOffTextElement.textContent.replace('<%= loggedOffText %>', loggedOffText);
    }
})(window);
