var config_ip = {
	packages: [97576, 97577, 97578, 97579],
	service_url: "https://services.inplayer.com",
};

var paywall = new InplayerPaywall('3da670ca-d4c8-4c57-8511-c5c90562fc27', [{
    id: 97576,
    options: {
      noPreview: true,
      noInject: true
    }
  }],
    // {
    //   oauthAppKey: '17c128af636af78c894d217a783c07dc',
    //   brandingId: 823
    // });


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
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function () {
	$("#preview-item").html(
		'<div id="inplayer-' +
			getParameterByName("id") +
			'" class="inplayer-paywall"></div>'
	);

	$(".inplayer-paywall-logout").parent().hide();

	paywall.on("authenticated", () => {
		$(".inplayer-paywall-logout").parent().show();
		$(".inplayer-paywall-login").parent().hide();
	});
	paywall.on("logout", function () {
		location.reload();
	});

	// PACKAGES CREATE
	var packageNumber = 0;
	config_ip.packages.forEach((package, i) => {
		$.get(config_ip.service_url + "/items/packages/" + package, (response) => {
			var packageTitle = response.title;
			$("#package-title-" + package).html(packageTitle);

			$.get(
				config_ip.service_url +
					"/items/packages/" +
					package +
					"/items?limit=500",
				(response) => {
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
});
