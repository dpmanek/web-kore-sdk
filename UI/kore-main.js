(function ($) {
	$(document).ready(function () {
		function assertion(options, callback) {
			var jsonData = {
				clientId: options.clientId,
				clientSecret: options.clientSecret,
				identity: options.userIdentity,
				aud: '',
				isAnonymous: false,
			};
			$.ajax({
				url: options.JWTUrl,
				type: 'post',
				data: jsonData,
				dataType: 'json',
				success: function (data) {
					options.assertion = data.jwt;
					options.handleError = koreBot.showError;
					options.chatHistory = koreBot.chatHistory;
					options.botDetails = koreBot.botDetails;
					callback(null, options);
					setTimeout(function () {
						if (koreBot && koreBot.initToken) {
							koreBot.initToken(options);
						}
					}, 2000);
				},
				error: function (err) {
					koreBot.showError(err.responseText);
				},
			});
		}
		function getBrandingInformation(options) {
			if (chatConfig.botOptions && chatConfig.botOptions.enableThemes) {
				var brandingAPIUrl = (
					chatConfig.botOptions.brandingAPIUrl || ''
				).replace(':appId', chatConfig.botOptions.botInfo._id);
				$.ajax({
					url: brandingAPIUrl,
					headers: {
						Authorization: 'bearer ' + options.authorization.accessToken,
					},
					type: 'get',
					dataType: 'json',
					success: function (data) {
						if (koreBot && koreBot.applySDKBranding) {
							koreBot.applySDKBranding(data);
						}
						if (koreBot && koreBot.initToken) {
							koreBot.initToken(options.authorization);
						}
					},
					error: function (err) {
						console.log(err);
					},
				});
			}
		}
		function onJWTGrantSuccess(options) {
			getBrandingInformation(options);
		}
		var chatConfig = window.KoreSDK.chatConfig;
		chatConfig.botOptions.assertionFn = assertion;
		chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;

		var koreBot = koreBotChat();

		//Logging Chat configuration
		console.log(':::::chatConfig::::');
		console.log(chatConfig);

		// Add fullscreen configuration
		//chatConfig.minimizeMode = false;

		// $('#kr_chatContainer').hide();

		koreBot.show(chatConfig);
		$('.openChatWindow').click(function () {
			koreBot.show(chatConfig);
		});
	});
})(
	jQuery ||
		(window.KoreSDK &&
			window.KoreSDK.dependencies &&
			window.KoreSDK.dependencies.jQuery)
);
