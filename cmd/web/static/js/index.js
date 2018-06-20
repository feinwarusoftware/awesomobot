"use strict";

const windowOpenCenteredFocused = (url, title, w, h) => {

    const dualScreenLeft = window.screenLeft === undefined ? window.screenX : window.screenLeft;
    const dualScreenTop = window.screenTop === undefined ? window.screenY : window.screenTop;

    const width = window.innerWidth === undefined ? document.documentElement.clientWidth === undefined ? screen.width : document.documentElement.clientWidth : window.innerWidth;
    const height = window.innerHeight === undefined ? document.documentElement.clientHeight === undefined ? screen.height : document.documentElement.clientHeight : window.innerHeight;

    const left = ((width / 2) - (w / 2)) + dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;

    const popupWindow = window.open(url, title, `width = ${w}, height = ${h}, top = ${top}, left = ${left}`);

    if (window.focus) {
        popupWindow.focus();
    }

    return popupWindow;
}

const windowOpenDiscordLogin = (redirect) => {

    const popupWindow = windowOpenCenteredFocused("/auth/discord", "_blank", 500, 720);

    const redirectIntervalId = setInterval(() => {

        if (popupWindow.location.href === `${popupWindow.location.protocol}//${popupWindow.location.hostname}${redirect}`) {

            clearInterval(redirectIntervalId);

            popupWindow.close();
            window.location.href = redirect;
        }
    }, 50);
}

window.onload = () => {

    const discordLoginButtons = document.getElementsByClassName("btn_login_discord");

    for (let i = 0; i < discordLoginButtons.length; i++) {

        discordLoginButtons[i].onclick = e => {

            windowOpenDiscordLogin("/dashboard");
        }
    }
}
