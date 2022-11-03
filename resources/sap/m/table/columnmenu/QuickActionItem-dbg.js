/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/m/table/columnmenu/Entry"
], function(
	Entry
) {
	"use strict";

	/**
	 * Constructor for a new QuickActionItem.
	 *
	 * @param {string} [sId] ID for the new QuickActionItem, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new QuickActionItem
	 *
	 * @class
	 * This element serves as a quick action item.
	 * It can be used to specify control- and application specific quick action items.
	 *
	 * @extends sap.m.table.columnmenu.Entry
	 *
	 * @author SAP SE
	 * @version 1.108.0
	 *
	 * @private
	 * @experimental
	 *
	 * @alias sap.m.table.columnmenu.QuickActionItem
	 */
	var QuickActionItem = Entry.extend("sap.m.table.columnmenu.QuickActionItem", {
		metadata: {
			library: "sap.m", properties: {
				/**
				 * The property name
				 */
				key: {type: "string"},
				/**
				 * Defines the text for the label.
				 */
				label: {type: "string", defaultValue: ""}
			}
		}
	});

	return QuickActionItem;
});