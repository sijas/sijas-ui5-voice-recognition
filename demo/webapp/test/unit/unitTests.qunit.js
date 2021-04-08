/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"in/sijas/app/ui5/voicerecognition/VoiceRecognition/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});