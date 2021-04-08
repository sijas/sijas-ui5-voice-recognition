sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"./controller/ListManager",
	"./util/SpeechRecognizer"
], function (UIComponent, Device, models, ListManager, SpeechRecognizer) {
	"use strict";

	return UIComponent.extend("in.sijas.app.ui5.voicerecognition.VoiceRecognition.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this._oListManager = new ListManager();
			this.oSpeechRecognizer = new SpeechRecognizer(this,true);
			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});