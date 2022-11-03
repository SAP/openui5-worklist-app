/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/core/Control", 	"sap/ui/fl/variants/VariantManagement", "sap/ui/fl/Utils", "sap/m/p13n/enum/PersistenceMode", "sap/ui/layout/VerticalLayout"
], function(CoreControl, VariantManagement, Utils, mode, VerticalLayout) {
	"use strict";

	/**
	 * The <code>PersistenceProvider</code> control provides certain persistence capabilities, such as transient personalization and global persistence.
	 * The <code>PersistenceProvider</code> control can be used in a similar way as <code>sap.ui.fl.variants.VariantManagement</code>,
	 * since any control that is a direct or indirect descendant of the provided <code>for</code> association is affected by this configuration.
	 * For example, this controller can be used for <code>sap.ui.mdc</code> controls.
	 *
	 * @private
	 *
	 * @experimental
	 * @since 1.104
	*/
	var PersistenceProvider = CoreControl.extend("sap.m.p13n.PersistenceProvider", /** @lends sap.ui.mdc.p13n.PersistenceProvider.prototype */ {
		metadata: {
			library: "sap.m",
			designtime: "sap/ui/mdc/designtime/p13n/PersistenceProvider.designtime",
			properties:  {
				/**
				 * Provides the mode setting for the <code>PersistenceProvider</code>.
				 * Allowed options are {@link sap.ui.mdc.enum.PersistenceMode}
				 */
				mode: {
					type: "sap.m.p13n.enum.PersistenceMode",
					group: "Data",
					defaultValue: mode.Auto
				}
			},
			associations: {
				/**
				 * Contains the controls for which the variant management is responsible.
				 */
				"for": {
					type: "sap.ui.core.Control",
					multiple: true
				}
			}
		},
		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
				oRm.openStart("div", oControl);
				oRm.openEnd();
				oRm.close("div");
			}
		}
	});

	PersistenceProvider.prototype.init = function () {
		CoreControl.prototype.init.apply(this, arguments);
		this.attachModelContextChange(this._setModel, this);

		this._oModelPromise = new Promise(function (resolve, reject) {
			this._fnResolveModel = resolve;
		}.bind(this));
	};

	PersistenceProvider.prototype._setModel = function () {

		var oModel = this.getModel(Utils.VARIANT_MODEL_NAME);
		if (oModel) {
			this._fnResolveModel(oModel);
		}
	};

	PersistenceProvider.prototype.applySettings = function () {
		CoreControl.prototype.applySettings.apply(this, arguments);
		this._bmodeLocked = true;

		if (this.getMode() === mode.Transient) {
			var oVM = new VariantManagement(this.getId() + "--vm", {"for": this.getAssociation("for")});
			this._oModelPromise.then(function (oModel) {
				oVM.setModel(oModel, Utils.VARIANT_MODEL_NAME);
			});
			this._oWrapper = new VerticalLayout(this.getId() + "--accWrapper", {
				visible: true,
				content: [
					oVM
				]
			});

			this._oWrapper.onAfterRendering = function() {
				VerticalLayout.prototype.onAfterRendering.apply(this, arguments);
				this.getDomRef().setAttribute("aria-hidden", true);
			};

			var oStatic = sap.ui.getCore().getUIArea(sap.ui.getCore().getStaticAreaRef());
			oStatic.addContent(this._oWrapper);
		}

		return this;
	};

	PersistenceProvider.prototype.addFor = function (sControlId) {
		this.addAssociation("for", sControlId);

		var oVM = sap.ui.getCore().byId(this.getId() + "--vm");
		if (this.getMode() === mode.Transient && oVM) {
			oVM.addFor(sControlId);
		}

		return this;
	};

	PersistenceProvider.prototype.removeFor = function (sControlId) {
		this.removeAssociation("for", sControlId);

		var oVM = sap.ui.getCore().byId(this.getId() + "--vm");
		if (this.getMode() === mode.Transient && oVM) {
			oVM.removeFor(sControlId);
		}

		return this;
	};

	/**
	 * Set the mode for the <code>PersistenceProvider</code>.
	 *
	 * @override
	 * @private
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	PersistenceProvider.prototype.setMode = function (sValue) {

		if (this._bmodeLocked && sValue !== this.getMode()) {
			throw new Error("mode is a final property.");
		}

		this.setProperty("mode", sValue);

		return this;
	};

	PersistenceProvider.prototype.exit = function () {
		if (this._oWrapper) {
			var oStatic = sap.ui.getCore().getUIArea(sap.ui.getCore().getStaticAreaRef());
			oStatic.removeContent(this._oWrapper);

			this._oWrapper.destroy();
			this._oWrapper = null;
		}

		this._oModelPromise = null;
		this._fnResolveModel = null;
		this._bmodeLocked = null;

		CoreControl.prototype.exit.apply(this, arguments);
	};

	return PersistenceProvider;
});