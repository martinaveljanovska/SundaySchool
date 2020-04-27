var config_ip = {
    packages: [
        89653,
        89654,
        89655,
    ],
    service_url: "https://services.inplayer.com"
}

function createItemElement(assetId, assetPhoto, assetTitle) {
    var output =
        '<div class="package-item"><div class="content" style="background-image:url(' +
        assetPhoto +
        ')">';
    output +=
        '<a href="./item.html?id=' +
        assetId +
        '" class="overlay-link"></a></div><div class="item-label"><div class="name">';
    output += assetTitle;
    output += "</div>";
    output += "</div></div>";
    return output;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


$(function () {


    $('#preview-item').html('<div id="inplayer-' + getParameterByName('id') + '" class="inplayer-paywall"></div>');


    $('.inplayer-paywall-logout').parent().hide();

    paywall.on('authenticated', () => {
        $('.inplayer-paywall-logout').parent().show();
        $('.inplayer-paywall-login').parent().hide();
    })
    paywall.on('logout', function () {
        location.reload();
    });


    // PACKAGES CREATE
    var packageNumber = 0;
    config_ip.packages.forEach((package, i) => {
        $.get(config_ip.service_url + "/items/packages/" + package, response => {

            var packageTitle = response.title;
            $("#package-title-" + package).html(packageTitle);

            $.get(
                config_ip.service_url + "/items/packages/" + package + "/items?limit=500",
                response => {

                    var output = "";
                    packageNumber++;

                    for (let item of response.collection) {
                        let asset = item,
                            assetId = asset.id,
                            assetPhoto = asset.metahash.paywall_cover_photo,
                            assetTitle = asset.title;

                        output += createItemElement(assetId, assetPhoto, assetTitle);

                        document.getElementById(
                            "package-items-" + package
                        ).innerHTML = output;
                    } // for
                }
            ); // get items
        }); // get packages
    }); //for each
    // console.log(screen.width)
})