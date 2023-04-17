/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"./ListBase",
	"./NotificationListRenderer"
],
function(
	ListBase,
	NotificationListRenderer
	) {
	'use strict';

	/**
	 * Constructor for a new <code>NotificationList<code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The NotificationList control provides a container for <code>NotificationListGroup</code>
	 * and <code>NotificationListItem</code>.
	 *
	 * @extends sap.m.ListBase
	 *
	 * @author SAP SE
	 * @version 1.108.0
	 *
	 * @constructor
	 * @public
	 * @since 1.90
	 * @alias sap.m.NotificationList
	 */
	var NotificationList = ListBase.extend('sap.m.NotificationList', /** @lends sap.m.NotificationList.prototype */ {
		metadata: {
			library: 'sap.m'
		},

		renderer: NotificationListRenderer
	});

	NotificationList.prototype.onItemFocusIn = function() { };

	return NotificationList;
});
