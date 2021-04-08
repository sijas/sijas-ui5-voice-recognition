sap.ui.define([
	"./BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("in.sijas.app.ui5.voicerecognition.VoiceRecognition.controller.Display", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf in.sijas.app.ui5.voicerecognition.VoiceRecognition.view.Display
		 */
		onInit: function () {
			var oComponent = this.getOwnerComponent();
			this._oListManager = oComponent._oListManager;
			this.oSpeechRecognizer = oComponent.oSpeechRecognizer;

			this.oSpeechRecognizer.registerCommandWithOutParam("edit", function () {
				this.editCurrentItem();
			}.bind(this));
			this.getRouter().getRoute("detail").attachPatternMatched(this._detailMatched, this);
		},
		_detailMatched: function (oEvt) {
			var oParams = oEvt.getParameter("arguments"),
				oModel = this.getModel();
			oModel.metadataLoaded().then(function () {
				var bindPath = "/" + oModel.createKey("Employees", {
					EmployeeID: oParams.context
				});
				this._bindView(bindPath);
			}.bind(this));

		},
		_bindView: function (bindPath) {
			this.getView().bindElement({
				path: bindPath,
				events: {
					change: this._bindingChanged.bind(this)
				}
			});
		},
		_bindingChanged: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				//this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this._oListManager.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getBoundContext().getPath();

			this._oListManager.selectAListItem(sPath);
		},
		editCurrentItem: function () {
			var oView = this.getView(),
				oContext = oView.getBindingContext(),
				EmployeeID = oContext.getProperty("EmployeeID");

			this.getRouter().navTo("edit", {
				context: EmployeeID
			}, true);
		}
	});

});