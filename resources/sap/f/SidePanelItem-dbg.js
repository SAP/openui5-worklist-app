/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.f.SidePanelItem.
sap.ui.define([
	"sap/ui/core/Item"
], function(
	Item
) {
	"use strict";

	/**
	 * Constructor for a new <code>SidePanelItem</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 *
	 * <h3>Overview</h3>
	 *
	 * The SidePanel Action Item.
	 *
	 * @extends sap.ui.core.Item
	 *
	 * @author SAP SE
	 * @version 1.108.0
	 *
	 * @constructor
	 * @public
	 * @since 1.107
	 * @alias sap.f.SidePanelItem
	 * @experimental Since 1.107. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	 var SidePanelItem = Item.extend("sap.f.SidePanelItem", {
		metadata: {
			library: "sap.f",
			properties: {
				/**
				* Specifies the icon for the item.
				*/
				icon: { type: "sap.ui.core.URI", group: "Misc", defaultValue: '' }
			},
			defaultAggregation: "content",
			aggregations: {
				/**
				 * The list of controls for side content of the action item.
				 */
				content: { type: "sap.ui.core.Control", multiple: true }
			}
		}
	});

	return SidePanelItem;
});