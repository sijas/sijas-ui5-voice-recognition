sap.ui.define([
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("in.sijas.app.ui5.voicerecognition.VoiceRecognition.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf in.sijas.app.ui5.voicerecognition.VoiceRecognition.view.Master
		 */
		onInit: function () {
			var oList = this.byId("list"),
				oSearchField = this.byId("searchField"),
				oComponent = this.getOwnerComponent();

			this._oListManager = oComponent._oListManager;
			this.oSpeechRecognizer = oComponent.oSpeechRecognizer;
			this.oSpeechRecognizer.registerCallButton(this.byId("mic"));
			 
			this.oSpeechRecognizer.registerCommandWithParam("search", function (text) {
				oSearchField.setValue(text);
				this._performSearch(text);
			}.bind(this));
			this.oSpeechRecognizer.registerCommandWithOutParam("Clear Search", function () {
				oSearchField.setValue('');
				this._performSearch('');
			}.bind(this));
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this._oListManager.setBoundList(oList);
				}.bind(this)
			});
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
		},

		_onMasterMatched: function () {
			this._oListManager.oWhenListLoadingIsDone.then(
				function (mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					if (!mParams.list.getSelectedItem()) {
						this.getRouter().navTo("detail", {
							context: encodeURIComponent(mParams.firstListitem.getBindingContext().getProperty("EmployeeID"))
						}, true);
					}
				}.bind(this),
				function (mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);

		},
		_showDetail: function (oItem) {
			this.getRouter().navTo("detail", {
				context: encodeURIComponent(oItem.getBindingContext().getProperty("EmployeeID"))
			}, true);
		},
		onSelectionChange: function (oEvent) {
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			this._showDetail(oItem);
		},
		onSearch: function (oEvt) {
			var sQuery = oEvt.getParameter("query");
			this._performSearch(sQuery);
		},
		_performSearch: function (sQuery) {
			var oList = this.byId("list"),
				oBinding = oList.getBinding("items"),
				aFilter = [];
			if (sQuery) {
				aFilter.push(new Filter("FirstName", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("LastName", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("Address", FilterOperator.Contains, sQuery));

				oBinding.filter(new Filter({
					filters: aFilter,
					and: false
				}));
			} else {
				oBinding.filter(null);
			}
		}
	});

});