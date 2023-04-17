/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/Title",
	"sap/m/MessageBox",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/ResponsivePopover",
	"sap/m/p13n/Container",
	"sap/m/p13n/AbstractContainerItem",
	"sap/m/library"
], function(Control, Button, Bar, Title, MessageBox, Device, Dialog, ResponsivePopover, Container, AbstractContainerItem, mLibrary) {
	"use strict";

	//Shortcut to sap.m.P13nPopupMode
	var P13nPopupMode = mLibrary.P13nPopupMode;

	/**
	 * Constructor for a new <code>Popup</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * This control can be used to show personalization-related content in different popup controls.
	 *
	 * @class
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.108.0
	 *
	 * @public
	 * @experimental Since 1.97.
	 * @since 1.97
	 * @alias sap.m.p13n.Popup
	 */
	var Popup = Control.extend("sap.m.p13n.Popup", {
		metadata: {
			library: "sap.m",
			properties: {
				/**
				 * Text describing the personalization popup.
				 */
				title: {
					type: "string"
				},
				/**
				 * Describes the corresponding popup mode, see also {@link sap.m.P13nPopupMode}.
				 */
				mode: {
					type: "sap.m.P13nPopupMode",
					defaultValue: P13nPopupMode.Dialog
				},
				/**
				 * Warning text which appears as a message prior to executing the rest callback.
				 * <b>Note:</b> The <code>warningText</code> may only be used in case the <code>reset</code> callback has been provided.
				 */
				warningText: {
					type: "string"
				},
				/**
				 * A callback that will be executed once a reset has been triggered.
				 * <b>Note:</b> The Reset button will only be shown in case this callback is provided.
				 */
				reset: {
					type: "function"
				}
			},
			aggregations: {
				/**
				 * The panels that are displayed by the <code>sap.m.p13n.Popup</code>.
				 */
				panels: {
					type: "sap.m.p13n.IContent",
					multiple: true
				},
				/**
				 * Additional set of <code>sap.m.Button</code> controls that are added to the existing Ok and Cancel buttons.
				 */
				additionalButtons: {
					type: "sap.m.Button",
					multiple: true
				}
			},
			events: {
				/**
				 * This event is fired after the dialog has been closed.
				 */
				close: {
					/**
					 * The corresponding reason for closing the dialog (Ok & Cancel).
					 */
					reason: {
						type: "string"
					}
				}
			}
		},
		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
				oRm.openStart("div", oControl);
				oRm.style("height", "100%");
				oRm.openEnd();
				oRm.renderControl(oControl.getAggregation("_content"));
				oRm.close("div");
			}
		}
	});

	Popup.prototype.init = function() {
		Control.prototype.init.apply(this, arguments);
		this._aPanels = [];
	};

	/**
	 * Checks whether there is an open <code>Popup</code> control.
	 *
	 * @public
	 * @returns {boolean} Flag that indicates if there is an open popup
	 */
	Popup.prototype.isOpen = function() {
		return !!this._bIsOpen;
	};

	/**
	 * Sets the desired popup mode, see also {@link sap.m.P13nPopupMode}.
	 *
	 * @public
	 * @param {sap.m.P13nPopupMode} sMode The mode used for the popup creation
	 * @returns {sap.m.p13n.Popup} The popup instance
	 */
	Popup.prototype.setMode = function(sMode) {
		this.setProperty("mode", sMode);
		if (this._oPopup) {
			this._oPopup.removeAllContent();
			this._oPopup.destroy();
			var oPopup = this._createContainer();
			this.addDependent(oPopup);
			this._oPopup = oPopup;
		}
		return this;
	};

	/**
	 * Set the reset functionality callback
	 * <b>Note:</b> The Reset button will only be shown in case this callback is provided.
	 *
	 * @param {function} fnReset callback that will be executed once a reset has been triggered.
	 * @returns {sap.m.p13n.Popup} The <code>Popup</code> instance
	 */
	Popup.prototype.setReset = function(fnReset) {
		if (this._oPopup) {
			this._oPopup.setCustomHeader(this._createTitle());
			this._oPopup.invalidate();
		}
		this.setProperty("reset", fnReset);
		return this;
	};

	/**
	 * Opens the <code>Popup</code> control.
	 *
	 * @public
	 * @param {sap.ui.core.Control} oSource The referenced control instance (used as anchor, for example, on popovers)
	 * @param {object} [mSettings] Configuration for the related popup container
	 * @param {sap.ui.core.CSSSize} [mSettings.contentHeight] Height configuration for the related popup container
	 * @param {sap.ui.core.CSSSize} [mSettings.contentWidth] Width configuration for the related popup container
	 */
	Popup.prototype.open = function(oSource, mSettings) {

		if (!oSource) {
			throw new Error("Please provide a source control!");
		}

		if (!this._oPopup) {
			var oPopup = this._createContainer(mSettings);
			this.addDependent(oPopup);
			this._oPopup = oPopup;
		}

		if (this.getMode() === "Dialog") {
			this._oPopup.open();
		} else {
			this._oPopup.openBy(oSource);
		}

		this._bIsOpen = true;
	};

	/**
	 * Adds a new panel to the <code>panels</code> aggregation.
	 *
	 * @public
	 * @param {sap.m.p13n.IContent} oPanel The panel instance
	 * @param {string} [sKey] Optional key to be used for the panel registration instead of using the id
	 * @returns {sap.m.p13n.Popup} The popup instance
	 */
	Popup.prototype.addPanel = function(oPanel, sKey) {
		var oPanelTitleBindingInfo = oPanel.getBindingInfo("title"), oBindingInfo;
		if (oPanelTitleBindingInfo && oPanelTitleBindingInfo.parts) {
			oBindingInfo = {
				parts: oPanelTitleBindingInfo.parts
			};
		}
		this._getContainer().addView(new AbstractContainerItem({
			key: sKey || oPanel.getId(),
			text: oBindingInfo || (oPanel.getTitle instanceof Function ? oPanel.getTitle() : undefined), //oBindinfInfo is undefined in case no binding is provided
			content: oPanel
		}));
		this._aPanels.push(oPanel);
		return this;
	};

	/**
	 * Removes a panel instance.
	 *
	 * @public
	 * @param {sap.m.p13n.IContent} oPanel The panel instance
	 * @returns {sap.m.p13n.Popup} The popup instance
	 */
	Popup.prototype.removePanel = function(oPanel) {
		this._aPanels.splice(this._aPanels.indexOf(oPanel), 1);
		this._getContainer().removeView(this._getContainer().getView(oPanel));
		return this;
	};

	/**
	 * Removes all panels from the <code>panels</code> aggregation
	 */
	Popup.prototype.removeAllPanels = function() {
		this.getPanels().forEach(function(oPanel){
			this.removePanel(oPanel);
		}.bind(this));
	};

	/**
	 * Removes the current panels in the <code>panels</code> aggregation.
	 * @public
	 * @returns {sap.m.p13n.IContent[]} An array of panel instances
	 */
	Popup.prototype.getPanels = function() {
		return this._aPanels;
	};

	Popup.prototype._createContainer = function(mDialogSettings) {
		mDialogSettings = mDialogSettings ? mDialogSettings : {};
		var oPopup = this["_create" + this.getMode()].call(this, mDialogSettings);
		oPopup.addStyleClass("sapMP13nPopup");
		oPopup.isPopupAdaptationAllowed = function () {
			return false;
		};
		return oPopup;
	};

	Popup.prototype._createResponsivePopover = function(mDialogSettings) {

		var oPopover = new ResponsivePopover(this.getId() + "-responsivePopover", {
			title: this.getTitle(),
			horizontalScrolling: mDialogSettings.hasOwnProperty("horizontalScrolling") ? mDialogSettings.horizontalScrolling : false,
			verticalScrolling: false,
			contentWidth: mDialogSettings.contentWidth ? mDialogSettings.contentWidth : "30rem",
			resizable: mDialogSettings.hasOwnProperty("resizable") ? mDialogSettings.resizable : true,
			contentHeight: mDialogSettings.contentHeight ? mDialogSettings.contentHeight : "35rem",
			placement: mDialogSettings.placement ? mDialogSettings.placement : "Bottom",
			content: this.getPanels().length > 1 ? this._getContainer() : this.getPanels()[0],
			afterClose: function() {
				this._onClose(oPopover, "AutoClose");
			}.bind(this)
		});

		oPopover.setCustomHeader(this._createTitle());

		return oPopover;

	};

	Popup.prototype._createDialog = function(mDialogSettings) {

		var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
		var oContainer = new Dialog(this.getId() + "-dialog", {
			title: this.getTitle(),
			horizontalScrolling: mDialogSettings.hasOwnProperty("horizontalScrolling") ? mDialogSettings.horizontalScrolling : false,
			verticalScrolling: false,
			contentWidth: mDialogSettings.contentWidth ? mDialogSettings.contentWidth : "40rem",
			contentHeight: mDialogSettings.contentHeight ? mDialogSettings.contentHeight : "55rem",
			draggable: true,
			resizable: true,
			stretch: Device.system.phone,
			content: this.getPanels().length > 1 ? this._getContainer() : this.getPanels()[0],
			escapeHandler: function() {
				this._onClose(oContainer, "Escape");
			},
			buttons: [
				new Button(this.getId() + "-confirmBtn", {
					text:  mDialogSettings.confirm && mDialogSettings.confirm.text ?  mDialogSettings.confirm.text : oResourceBundle.getText("p13n.POPUP_OK"),
					type: "Emphasized",
					press: function() {
						this._onClose(oContainer, "Ok");
					}.bind(this)

				}), new Button(this.getId() + "-cancelBtn", {
					text: oResourceBundle.getText("p13n.POPUP_CANCEL"),
					press: function () {
						this._onClose(oContainer, "Cancel");
					}.bind(this)
				})
			]
		});

		oContainer.setCustomHeader(this._createTitle());

		this.getAdditionalButtons().forEach(function(oButton){
			oContainer.addButton(oButton);
		});

		return oContainer;
	};

	Popup.prototype._createTitle = function() {

		var fnReset = this.getReset();
		var sTitle = this.getTitle();
		var sWarningText = this.getWarningText();

		var oBar;

		if (fnReset instanceof Function) {

			oBar = new Bar({
				contentLeft: [
					new Title({
						text: sTitle
					})
				]
			});

			oBar.addContentRight(new Button(this.getId() + "-resetBtn", {
				text: sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("p13n.POPUP_RESET"),
				press: function(oEvt) {

					var oDialog =  oEvt.getSource().getParent().getParent();
					var oControl = oDialog.getParent();

					var sResetText = sWarningText;
					MessageBox.warning(sResetText, {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction === MessageBox.Action.OK) {
								// --> focus "OK" button after 'reset' has been triggered
								oDialog.getButtons()[0].focus();
								fnReset(oControl);
							}
						}
					});
				}
			}));

		}

		return oBar;

	};

	Popup.prototype._getContainer = function(oSource) {
		if (!this._oContainer){
			this._oContainer = new Container();
		}

		if (this._oContainer.getViews().length > 1) {
			this._oContainer.switchView(this._oContainer.getViews()[1].getKey());
		}

		return this._oContainer;
	};

	Popup.prototype._onClose = function(oContainer, sReason) {

		oContainer.close();

		this._bIsOpen = false;

		this.fireClose({
			reason: sReason
		});
	};

	Popup.prototype.exit = function() {
		if (this._oPopup) {
			this._oPopup.destroy();
		}
		this._aPanels = null;
	};

	return Popup;

});