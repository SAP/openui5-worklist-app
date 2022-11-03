/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/date/CalendarWeekNumbering","sap/ui/core/Configuration","sap/ui/core/LocaleData"],function(e,a,i){"use strict";var t={ISO_8601:{firstDayOfWeek:1,minimalDaysInFirstWeek:4},MiddleEastern:{firstDayOfWeek:6,minimalDaysInFirstWeek:1},WesternTraditional:{firstDayOfWeek:0,minimalDaysInFirstWeek:1}};var r={getWeekConfigurationValues:function(r,n){var s;if(t.hasOwnProperty(r)){return t[r]}r=r||e.Default;if(r===e.Default){n=n||a.getFormatSettings().getFormatLocale();s=i.getInstance(n);return{firstDayOfWeek:s.getFirstDayOfWeek(),minimalDaysInFirstWeek:s.getMinimalDaysInFirstWeek()}}return undefined}};return r});