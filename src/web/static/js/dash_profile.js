const getImageSize = url => {
    return new Promise((resolve, reject) => {

        const img = new Image();
        img.addEventListener("load", function () {

            resolve(`${this.naturalWidth}x${this.naturalHeight}`);
        });
        img.src = url;
    });
}

//Animation init
new WOW().init();

//Modal
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
});

// Material Select Initialization
$(document).ready(function () {
    $('.mdb-select').material_select();

});

/*$(window).load(function () {
    $("#form-about-checkbox").click(function () {
        if ($("#form-about-checkbox").checked === true) {
            $("#form-about-section").hide();
        } else {
            $("#form-about-section").show();
        }
    })
}); */


// SideNav Button Initialization
$(".button-collapse").sideNav();
// SideNav Scrollbar Initialization
var sideNavScrollbar = document.querySelector('.custom-scrollbar');
Ps.initialize(
    sideNavScrollbar);

// Tooltips Initialization
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
const id = window.location.pathname.substring(20);
const profile = new XMLHttpRequest();
profile.open("GET", `/api/v3/users/${id}`, false);
profile
    .send();
const profileyay = JSON.parse(profile.response);
//$("#username").text("YOUR FUCKING MA");
$("#bio").text(profileyay.bio);
$("#about").text(profileyay.about);
$("#banner").attr("src",
    profileyay.banner);

if (profileyay.verified == true) {
    $("#verified").html(
        `<span class="text-info font-weight-bold" data-toggle="tooltip" data-placement="top" title="<%= trans.VERIFIED %>">
<i class="fa fa-check pr-1"></i>
</span>`
    )
};

for (let i = 0; i < profileyay.artwork.length; i++) {

    $("#artwork").append(
        `
    <figure class="col-lg-4 col-md-6">
        <a id='${`art-${i}`}' href="${profileyay.artwork[i]}">
            <img id="artworkimg" src="${profileyay.artwork[i]}" alt="placeholder" class="img-fluid">
        </a>
    </figure>
    `
    );

    getImageSize(profileyay.artwork[i]).then(size => {

        document.getElementById(`art-${i}`).setAttribute("data-size", size);
    });
};
for (let i = 0; i < profileyay.socials.length; i++) {
    $("#socials").append(
        `
        <li class="list-inline-item pr-2">
            <a href="${profileyay.socials[i].link}" class="white-text">
            <i class="fa fa-${profileyay.socials[i].icon} pr-1"></i>${profileyay.socials[i].name}</a>
        </li>
    `
    );
};

if (profileyay.socials === undefined || profileyay.socials.length == 0) {
    $("#socials").append(
        `
        <li class="list-inline-item pr-2">
            <a class="white-text"><%= trans.NO_SOCIALS %></a>
        </li>
    `
    );
};

if (profileyay.modules.about === false) {
    $("#about-card").hide();
};

if (profileyay.modules.artwork === false) {
    $("#artwork-card").hide();
};

//trophies
if (profileyay.trophies === undefined || profileyay.trophies.length == 0) {
    $("#trophycase").append(
        `
        <h5 class="grey-text"><%= trans.NO_TROPHIES %></h5>
    `
    );
};
if (profileyay.trophies.indexOf("feinwaru-dev") !== -1) {
    $("#trophycase").append(
        `<div class="mx-auto chip white-text feinwaru" data-toggle="tooltip" data-placement="top" title="Pretends that he develops, but he does the html so no lol">
<img src="/img/trophy/trophy-fs.png"> <%= trans.FEINWARU_DEV %>
</div>`
    )
};
if (profileyay.trophies.indexOf("ac18ww") !== -1) {
    $("#trophycase").append(
        `<div class="mx-auto chip white-text" style="background-color: #7289DA;">
<img src="/img/trophy/trophy-art.png"> <%= trans.AC18WW %>
</div>`
    )
};

const me = new XMLHttpRequest();
me.open("GET", `/api/v3/users/@me`, false);
me.send();
const meyay = JSON.parse(me.response);
if (meyay.discord_id === id) {
    //show da modal
    $('#modalPrompt').modal('show');
    //fill out da form
    $('#form-imageurl').attr("value", meyay.banner);
    $('#form-bio').attr("value", meyay.bio);
    $('#form-about').text(meyay.about);

    if (meyay.socials !== undefined && meyay.socials.length !== 0) {

        $('#form-social-name1').attr("value", meyay.socials[0].name);
        $('#form-social-url1').attr("value", meyay.socials[0].link);

        $('#form-social-name2').attr("value", meyay.socials[1].name);
        $('#form-social-url2').attr("value", meyay.socials[1].link);

        $('#form-social-name3').attr("value", meyay.socials[2].name);
        $('#form-social-url3').attr("value", meyay.socials[2].link);
    };

};

let artworkcunt = meyay.artwork.length;

for (let i = 0; i < meyay.artwork.length; i++) {
    $("#form-artwork-section").append(
        `
        <input placeholder="<%= trans.ENTER_IMAGE_URL %>" value="${meyay.artwork[i]}" type="text" id="form-artwork-${i}" class="form-control form-art-api">
        `
    );
};

function socialIconChanger1() {
    const value = $("#form-social-url1").val()

    if (value.includes("twitch.tv") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-twitch prefix");
        $("#form-social-icon1").attr("social", "twitch");
    } else if (value.includes("instagram.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-instagram prefix");
        $("#form-social-icon1").attr("social", "instagram");
    } else if (value.includes("github.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-github prefix");
        $("#form-social-icon1").attr("social", "github");
    } else if (value.includes("facebook.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-facebook prefix");
        $("#form-social-icon1").attr("social", "facebook");
    } else if (value.includes("deviantart.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-deviantart prefix");
        $("#form-social-icon1").attr("social", "deviantart");
    } else if (value.includes("last.fm") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-lastfm prefix");
        $("#form-social-icon1").attr("social", "lastfm");
    } else if (value.includes("linkedin.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-linkedin prefix");
        $("#form-social-icon1").attr("social", "linkedin");
    } else if (value.includes("pinterest.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-pinterest prefix");
        $("#form-social-icon1").attr("social", "pinterest");
    } else if (value.includes("reddit.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-reddit-alien prefix");
        $("#form-social-icon1").attr("social", "reddit-alien");
    } else if (value.includes("snapchat.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-snapchat-ghost prefix");
        $("#form-social-icon1").attr("social", "snapchat-ghost");
    } else if (value.includes("soundcloud.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-soundcloud prefix");
        $("#form-social-icon1").attr("social", "soundcloud");
    } else if (value.includes("steamcommunity.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-steam prefix");
        $("#form-social-icon1").attr("social", "steam");
    } else if (value.includes("tumblr.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-tumblr prefix");
        $("#form-social-icon1").attr("social", "tumblr");
    } else if (value.includes("twitter.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-twitter prefix");
        $("#form-social-icon1").attr("social", "twitter");
    } else if (value.includes("youtube.com") == true) {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-youtube-play prefix");
        $("#form-social-icon1").attr("social", "youtube-play");
    } else {
        $("#form-social-icon1").removeClass();
        $("#form-social-icon1").addClass("fa fa-globe prefix");
        $("#form-social-icon1").attr("social", "globe");
    }
};

function socialIconChanger2() {
    const value = $("#form-social-url2").val()

    if (value.includes("twitch.tv") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-twitch prefix");
        $("#form-social-icon2").attr("social", "twitch");
    } else if (value.includes("instagram.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-instagram prefix");
        $("#form-social-icon2").attr("social", "instagram");
    } else if (value.includes("github.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-github prefix");
        $("#form-social-icon2").attr("social", "github");
    } else if (value.includes("facebook.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-facebook prefix");
        $("#form-social-icon2").attr("social", "facebook");
    } else if (value.includes("deviantart.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-deviantart prefix");
        $("#form-social-icon2").attr("social", "deviantart");
    } else if (value.includes("last.fm") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-lastfm prefix");
        $("#form-social-icon2").attr("social", "lastfm");
    } else if (value.includes("linkedin.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-linkedin prefix");
        $("#form-social-icon2").attr("social", "linkedin");
    } else if (value.includes("pinterest.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-pinterest prefix");
        $("#form-social-icon2").attr("social", "pinterest");
    } else if (value.includes("reddit.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-reddit-alien prefix");
        $("#form-social-icon2").attr("social", "reddit-alien");
    } else if (value.includes("snapchat.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-snapchat-ghost prefix");
        $("#form-social-icon2").attr("social", "snapchat-ghost");
    } else if (value.includes("soundcloud.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-soundcloud prefix");
        $("#form-social-icon2").attr("social", "soundcloud");
    } else if (value.includes("steamcommunity.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-steam prefix");
        $("#form-social-icon2").attr("social", "steam");
    } else if (value.includes("tumblr.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-tumblr prefix");
        $("#form-social-icon2").attr("social", "tumblr");
    } else if (value.includes("twitter.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-twitter prefix");
        $("#form-social-icon2").attr("social", "twitter");
    } else if (value.includes("youtube.com") == true) {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-youtube-play prefix");
        $("#form-social-icon2").attr("social", "youtube-play");
    } else {
        $("#form-social-icon2").removeClass();
        $("#form-social-icon2").addClass("fa fa-globe prefix");
        $("#form-social-icon2").attr("social", "globe");
    }
};

function socialIconChanger3() {
    const value = $("#form-social-url3").val()

    if (value.includes("twitch.tv") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-twitch prefix");
        $("#form-social-icon3").attr("social", "twitch");
    } else if (value.includes("instagram.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-instagram prefix");
        $("#form-social-icon3").attr("social", "instagram");
    } else if (value.includes("github.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-github prefix");
        $("#form-social-icon3").attr("social", "github");
    } else if (value.includes("facebook.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-facebook prefix");
        $("#form-social-icon3").attr("social", "facebook");
    } else if (value.includes("deviantart.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-deviantart prefix");
        $("#form-social-icon3").attr("social", "deviantart");
    } else if (value.includes("last.fm") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-lastfm prefix");
        $("#form-social-icon3").attr("social", "lastfm");
    } else if (value.includes("linkedin.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-linkedin prefix");
        $("#form-social-icon3").attr("social", "linkedin");
    } else if (value.includes("pinterest.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-pinterest prefix");
        $("#form-social-icon3").attr("social", "pinterest");
    } else if (value.includes("reddit.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-reddit-alien prefix");
        $("#form-social-icon3").attr("social", "reddit-alien");
    } else if (value.includes("snapchat.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-snapchat-ghost prefix");
        $("#form-social-icon3").attr("social", "snapchat-ghost");
    } else if (value.includes("soundcloud.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-soundcloud prefix");
        $("#form-social-icon3").attr("social", "soundcloud");
    } else if (value.includes("steamcommunity.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-steam prefix");
        $("#form-social-icon3").attr("social", "steam");
    } else if (value.includes("tumblr.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-tumblr prefix");
        $("#form-social-icon3").attr("social", "tumblr");
    } else if (value.includes("twitter.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-twitter prefix");
        $("#form-social-icon3").attr("social", "twitter");
    } else if (value.includes("youtube.com") == true) {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-youtube-play prefix");
        $("#form-social-icon3").attr("social", "youtube-play");
    } else {
        $("#form-social-icon3").removeClass();
        $("#form-social-icon3").addClass("fa fa-globe prefix");
        $("#form-social-icon3").attr("social", "globe");
    }
};

window.onload = () => {
    socialIconChanger1();
    socialIconChanger2();
    socialIconChanger3();

    const aboutcheckbox = document.getElementById("form-about-checkbox");
    const artworkcheckbox = document.getElementById("form-artwork-checkbox");

    if (meyay.modules.about === true) {
        aboutcheckbox.checked = true;
        $("#form-about-section").show();
        $("#about-label").html("<strong><%= trans.ABOUT_SECTION %></strong>");
    } else {
        aboutcheckbox.checked = false;
        $("#form-about-section").hide();
        $("#about-label").html(
            "<strong><%= trans.ABOUT_SECTION %> (<%= trans.DISABLED %>)</strong>");
    }

    aboutcheckbox.onclick = () => {
        if (aboutcheckbox.checked === true) {
            $("#form-about-section").show();
            $("#about-label").html("<strong><%= trans.ABOUT_SECTION %></strong>");
        } else {
            $("#form-about-section").hide();
            $("#about-label").html(
                "<strong><%= trans.ABOUT_SECTION %> (<%= trans.DISABLED %>)</strong>");
        }
    }

    if (meyay.modules.artwork === true) {
        artworkcheckbox.checked = true;
        $("#form-artwork-section").show();
        $("#artwork-label").html("<strong><%= trans.ARTWORK_SHOWCASE %></strong>");
    } else {
        artworkcheckbox.checked = false;
        $("#form-artwork-section").hide();
        $("#artwork-label").html(
            "<strong><%= trans.ARTWORK_SHOWCASE %> (<%= trans.DISABLED %>)</strong>");
    }

    artworkcheckbox.onclick = () => {
        if (artworkcheckbox.checked === true) {
            $("#form-artwork-section").show();
            $("#artwork-label").html("<strong><%= trans.ARTWORK_SHOWCASE %></strong>");
        } else {
            $("#form-artwork-section").hide();
            $("#artwork-label").html(
                "<strong><%= trans.ARTWORK_SHOWCASE %> (<%= trans.DISABLED %>)</strong>");
        }
    }
    $("#form-artwork-add").click(function () {
        $("#form-artwork-section").append(
            `
            <input placeholder="<%= trans.ENTER_IMAGE_URL %>" value="" type="text" id="form-artwork-${artworkcunt++}" class="form-control form-art-api">
        `
        );
    });


    /*if ($("#form-social-url1").val()) {
       alert("ahhh its twitch")
        $("#form-social-url1").add
    };
    */
    {
        // dragons nice code goes here, if you put jquery here i will actually end you

        const submitButton = document.getElementById("save-profile");


        submitButton.onclick = () => {
            const banner = document.getElementById("form-imageurl");
            const bio = document.getElementById("form-bio");
            const social_icon_1 = document.getElementById("form-social-icon1").getAttribute(
                "social");
            const social_name_1 = document.getElementById("form-social-name1");
            const social_url_1 = document.getElementById("form-social-url1");
            const social_icon_2 = document.getElementById("form-social-icon2").getAttribute(
                "social");
            const social_name_2 = document.getElementById("form-social-name2");
            const social_url_2 = document.getElementById("form-social-url2");
            const social_icon_3 = document.getElementById("form-social-icon3").getAttribute(
                "social");
            const social_name_3 = document.getElementById("form-social-name3");
            const social_url_3 = document.getElementById("form-social-url3");
            const about_checkbox = document.getElementById("form-about-checkbox");
            const artwork_checkbox = document.getElementById("form-artwork-checkbox");
            const about = document.getElementById("form-about");
            const artwork = document.getElementsByClassName("form-art-api");
            const body = {
                banner: banner.value,
                bio: bio.value,
                socials: [{
                        icon: social_icon_1,
                        name: social_name_1.value,
                        link: social_url_1.value
                    },
                    {
                        icon: social_icon_2,
                        name: social_name_2.value,
                        link: social_url_2.value
                    },
                    {
                        icon: social_icon_3,
                        name: social_name_3.value,
                        link: social_url_3.value
                    }
                ],
                modules: {
                    about: about_checkbox.checked,
                    artwork: artwork_checkbox.checked
                },
                about: about.value,
                artwork: []
            }

            for (let art of artwork) {

                body.artwork.push(art.value);
            }

            const upd = new XMLHttpRequest();
            upd.open("PATCH", `/api/v3/users/@me`, false);
            upd.setRequestHeader("Content-Type", "application/json");
            upd.send(JSON.stringify(body));

            const upd_res = JSON.parse(upd.response);
            if (upd_res.status === 200) {

                // success
                toastr["success"]("<%= trans.USER_UPDATE_SUCCESS %>");

                setTimeout(function(){
                    location.reload();
                },2000)
                
            } else {
                // failure
                toastr["error"](typeof upd_res.error === "string" ? upd_res.error :
                    `${upd_res.status} - ${upd_res.message}`);
            }
        }
    }

};