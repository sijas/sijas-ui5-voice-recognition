sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
	return BaseObject.extend("ListManager", {
		constructor: function () {
			this._oWhenListHasBeenSet = new Promise(function (fnResolveListHasBeenSet) {
				this._fnResolveListHasBeenSet = fnResolveListHasBeenSet;
			}.bind(this));
			// This promise needs to be created in the constructor, since it is allowed to
			// invoke selectItem functions before calling setBoundMasterList
			this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
				// Used to wait until the setBound masterList function is invoked
				this._oWhenListHasBeenSet
					.then(function (oList) {
						oList.getBinding("items").attachEventOnce("change",
							function () {
								var oFirstListItem = oList.getItems()[0];
								if (oFirstListItem) {
									// Have to make sure that first list Item is selected
									// and a select event is triggered. Like that, the corresponding
									// detail page is loaded automatically
									fnResolve({
										list: oList,
										firstListitem: oFirstListItem
									});
								} else {
									// No items in the list
									fnReject({
										list: oList,
										error: false
									});
								}
							}.bind(this)
						);
					}.bind(this));
			}.bind(this));
		},
		setBoundList: function (oList) {
			this._oList = oList;
			this._fnResolveListHasBeenSet(oList);
		},
		selectAListItem: function (sBindingPath) {
			this.oWhenListLoadingIsDone.then(
				function () {
					var oList = this._oList,
						oSelectedItem;

					if (oList.getMode() === "None") {
						return;
					}

					oSelectedItem = oList.getSelectedItem();

					// skip update if the current selection is already matching the object path
					if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
						return;
					}

					oList.getItems().some(function (oItem) {
						if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
							oList.setSelectedItem(oItem);
							return true;
						}
					});
				}.bind(this),
				function () {
					jQuery.sap.log.warning("Could not select the list item with the path" + sBindingPath +
						" because the list encountered an error or had no items");
				}
			);
		},
		clearMasterListSelection: function () {
			//use promise to make sure that 'this._oList' is available
			this._oWhenListHasBeenSet.then(function () {
				this._oList.removeSelections(true);
			}.bind(this));
		}
	});
});