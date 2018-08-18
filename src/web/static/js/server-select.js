"use strict";

const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const initServerSelect = () => {

    const server_select = document.getElementById("server-select");
    const server_image = document.getElementById("current-server-img");

    //const guilds = new XMLHttpRequest();
    //guilds.open("GET", "/api/v3/guilds/temp/userguilds", false);
    //guilds.send();

    //const guilds_res = JSON.parse(guilds.response);

    const guilds_res = [{

        id: "405129031445381120",
        icon: "cc25586f0ba64afbc7d3bcf09b78bbac",
        name: "fstest-hardcoded"
    }];

    let i = 0;
    for (let guild_res of guilds_res) {

        const cookie = getCookie("guild");
        if (cookie === "") {
            document.cookie = "guild=" + guild_res.id;
        }

        server_select.innerHTML += `<a id="server-${guild_res.id}" class="dropdown-item waves-effect waves-light server-selector-thingy">
            <img src="${guild_res.icon === null ? "https://cdn.discordapp.com/embed/avatars/0.png" : `https://cdn.discordapp.com/icons/${guild_res.id}/${guild_res.icon}.png`}" class="rounded-circle z-depth-0 mr-2"
            alt="there is supposed to be an image but dragon 🅱roke it" style="background-color: #333333; height: 32px">
            ${guild_res.name}
            </a>`;

        const current_id = getCookie("guild");
        if (current_id === guild_res.id) {
            server_image.src = `${guild_res.icon === null ? "https://cdn.discordapp.com/embed/avatars/0.png" : `https://cdn.discordapp.com/icons/${guild_res.id}/${guild_res.icon}.png`}`;
        }

        i++;
    }

    $(".server-selector-thingy").click(function () {
        document.cookie = "guild=" + $(this).attr("id").substring(7);
        location.reload();
    });
}
