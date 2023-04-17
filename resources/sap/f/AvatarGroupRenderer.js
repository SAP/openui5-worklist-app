/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/library"],function(t){"use strict";var e=t.AvatarSize;var r={apiVersion:2};r.render=function(t,r){var a="sapFAvatarGroup",o=r.getGroupType(),i=r.getAvatarDisplaySize(),s=r.getAvatarCustomDisplaySize(),n=r.getAvatarCustomFontSize(),u=a+o,l=r.getItems(),p=r._shouldShowMoreButton(),v=r.getProperty("_interactive");t.openStart("div",r).class(a).class(u).class(a+i);if(p){t.class("sapFAvatarGroupShowMore")}if(!v){t.class("sapFAvatarGroupNonInteractive")}if(r._bAutoWidth){t.style("width","auto")}if(o==="Group"){t.attr("role","button")}if(i===e.Custom){t.style("height",s);t.style("min-width",s);t.style("font-size",n);t.style("line-height",s)}t.openEnd();for(var f=0;f<r._iAvatarsToShow;f++){t.renderControl(l[f])}if(p){t.renderControl(r._oShowMoreButton)}t.close("div")};return r},true);
//# sourceMappingURL=AvatarGroupRenderer.js.map