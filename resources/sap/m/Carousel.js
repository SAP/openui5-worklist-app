/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Control","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/library","sap/m/IllustratedMessage","sap/m/IllustratedMessageType","./CarouselRenderer","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/thirdparty/mobify-carousel","sap/ui/core/IconPool","./CarouselLayout","sap/ui/dom/jquery/Selectors"],function(e,t,i,s,o,a,r,n,g,h,u,jQuery){"use strict";var l=a.BusyIndicatorSize;var f=e.ImageHelper;var p=e.CarouselArrowsPlacement;var d=e.PlacementType;var c=i.extend("sap.m.Carousel",{metadata:{library:"sap.m",designtime:"sap/m/designtime/Carousel.designtime",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},loop:{type:"boolean",group:"Misc",defaultValue:false},showPageIndicator:{type:"boolean",group:"Appearance",defaultValue:true},pageIndicatorPlacement:{type:"sap.m.PlacementType",group:"Appearance",defaultValue:d.Bottom},showBusyIndicator:{type:"boolean",group:"Appearance",defaultValue:true,deprecated:true},arrowsPlacement:{type:"sap.m.CarouselArrowsPlacement",group:"Appearance",defaultValue:p.Content}},defaultAggregation:"pages",aggregations:{pages:{type:"sap.ui.core.Control",multiple:true,singularName:"page"},customLayout:{type:"sap.m.CarouselLayout",multiple:false},_emptyPage:{type:"sap.m.IllustratedMessage",multiple:false,visibility:"hidden"}},associations:{activePage:{type:"sap.ui.core.Control",multiple:false}},events:{loadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},unloadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},pageChanged:{parameters:{oldActivePageId:{type:"string"},newActivePageId:{type:"string"},activePages:{type:"array"}}},beforePageChanged:{parameters:{activePages:{type:"array"}}}}},renderer:g});c._INNER_SELECTOR=".sapMCrslInner";c._PAGE_INDICATOR_SELECTOR=".sapMCrslBulleted";c._PAGE_INDICATOR_ARROWS_SELECTOR=".sapMCrslIndicatorArrow";c._CONTROLS=".sapMCrslControls";c._ITEM_SELECTOR=".sapMCrslItem";c._LEFTMOST_CLASS="sapMCrslLeftmost";c._RIGHTMOST_CLASS="sapMCrslRightmost";c._MODIFIERNUMBERFORKEYBOARDHANDLING=10;c._BULLETS_TO_NUMBERS_THRESHOLD=9;c.prototype.init=function(){this._fnAdjustAfterResize=function(){var e=this.$().find(c._INNER_SELECTOR);this._oMobifyCarousel.resize(e);if(this.getPages().length>1){this._setWidthOfPages(this._getNumberOfItemsToShow())}}.bind(this);this._aAllActivePages=[];this._aAllActivePagesIndexes=[];this._onBeforePageChangedRef=this._onBeforePageChanged.bind(this);this._onAfterPageChangedRef=this._onAfterPageChanged.bind(this);this.data("sap-ui-fastnavgroup","true",true);this._oRb=t.getLibraryResourceBundle("sap.m")};c.prototype.exit=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.destroy();delete this._oMobifyCarousel}if(this._oArrowLeft){this._oArrowLeft.destroy();delete this._oArrowLeft}if(this._oArrowRight){this._oArrowRight.destroy();delete this._oArrowRight}if(this._sResizeListenerId){o.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this.$().off("afterSlide");this._fnAdjustAfterResize=null;this._$InnerDiv=null;this._aAllActivePages=null;this._aAllActivePagesIndexes=null};c.prototype.onBeforeRendering=function(){if(!this.getActivePage()&&this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true)}var e=this.getActivePage();if(e){this._updateActivePages(e)}if(this._sResizeListenerId){o.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this.$().off("beforeSlide",this._onBeforePageChangedRef);this.$().off("afterSlide",this._onAfterPageChangedRef);return this};c.prototype._getNumberOfItemsToShow=function(){var e=this.getPages().length,t=this.getCustomLayout(),i=1;if(t&&t.isA("sap.m.CarouselLayout")){i=Math.max(t.getVisiblePagesCount(),1)}if(i>1&&e<i){return e}return i};c.prototype.onAfterRendering=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.unbind();setTimeout(function(){if(this._oMobifyCarousel){this._oMobifyCarousel.onTransitionComplete()}}.bind(this),0)}var e=this._getNumberOfItemsToShow();this.$().carousel(undefined,{numberOfItemsToShow:e});this._oMobifyCarousel=this.getDomRef()._carousel;this._oMobifyCarousel.setLoop(this.getLoop());this._oMobifyCarousel.setRTL(t.getConfiguration().getRTL());if(e>1){this._setWidthOfPages(e)}var i=this.getActivePage();if(i){var s=this._getPageIndex(i);if(isNaN(s)||s==0){if(this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true);this._adjustHUDVisibility()}}else{if(t.isThemeApplied()){this._moveToPage(s,s+1,false)}else{t.attachThemeChanged(this._handleThemeLoad,this)}if(this.getParent()&&this.getParent().isA("sap.zen.commons.layout.PositionContainer")){if(this._isCarouselUsedWithCommonsLayout===undefined){setTimeout(this["invalidate"].bind(this),0);this._isCarouselUsedWithCommonsLayout=true}}}}this.$().on("beforeSlide",this._onBeforePageChangedRef);this.$().on("afterSlide",this._onAfterPageChangedRef);this._$InnerDiv=this.$().find(c._INNER_SELECTOR)[0];this._sResizeListenerId=o.register(this._$InnerDiv,this._fnAdjustAfterResize);var a=this.getParent();while(a){if(a.isA("sap.m.IconTabBar")){var r=this;a.attachExpand(function(e){var t=e.getParameter("expand");if(t&&s>0){r._moveToPage(s,s+1,false)}});break}a=a.getParent()}};c.prototype.getFocusDomRef=function(){return this.getDomRef(this.getActivePage()+"-slide")||this.getDomRef("noData")};c.prototype._onBeforePageChanged=function(e,t,i){if(e.target!==this.getDomRef()){return}var s=this.getPages()[i-1].getId();this._updateActivePages(s);this.fireBeforePageChanged({activePages:this._aAllActivePagesIndexes})};c.prototype._onAfterPageChanged=function(e,t,i){var s=this.getPages().length>0;if(e.target!==this.getDomRef()){return}if(!s){return}var o;if(this._iNewActivePageIndex!==undefined){o=this._iNewActivePageIndex}else if(this._bPageIndicatorArrowPress||this._bSwipe){var a=t<i;var r=this._getPageIndex(this.getActivePage());if(this._isPageDisplayed(r)){o=r}else{if(a){o=r+1}else{o=r-1}if(!this._isPageDisplayed(o)){o=i-1}}}else{o=i-1}this._changeActivePage(o);delete this._iNewActivePageIndex;delete this._bPageIndicatorArrowPress;delete this._bSwipe};c.prototype._setWidthOfPages=function(e){var t=this.$().find(".sapMCrslItem"),i;if(!t.length){return}i=this._calculatePagesWidth(e);t.each(function(e,t){t.style.width=i+"%"})};c.prototype._calculatePagesWidth=function(e){var t=this.$().width(),i=this.getDomRef().querySelector(".sapMCrslFluid .sapMCrslItem"),s=parseFloat(window.getComputedStyle(i).marginRight),o=(t-s*(e-1))/e,a=o/t*100;return a};c.prototype._handleThemeLoad=function(){var e=this.getActivePage();if(e){var i=this._getPageIndex(e);if(i>0){this._moveToPage(i,i+1,false)}}t.detachThemeChanged(this._handleThemeLoad,this)};c.prototype._moveToPage=function(e,t,i){if(!i){this._oMobifyCarousel.changeAnimation("sapMCrslNoTransition")}this._iNewActivePageIndex=e;this._oMobifyCarousel.move(t)};c.prototype._changeActivePage=function(e){var t=this.getActivePage();if(this._sOldActivePageId){t=this._sOldActivePageId;delete this._sOldActivePageId}var i=this.getPages()[e].getId();this.setAssociation("activePage",i,true);if(!s.system.desktop){jQuery(document.activeElement).trigger("blur")}if(this._oMobifyCarousel&&this._oMobifyCarousel.getShouldFireEvent()){u.debug("sap.m.Carousel: firing pageChanged event: old page: "+t+", new page: "+i);this.firePageChanged({oldActivePageId:t,newActivePageId:i,activePages:this._aAllActivePagesIndexes})}this._adjustHUDVisibility();this._updateItemsAttributes();this._updatePageIndicator();if(this.getDomRef().contains(document.activeElement)&&!this.getFocusDomRef().contains(document.activeElement)||this._bPageIndicatorArrowPress){this.getFocusDomRef().focus({preventScroll:true})}};c.prototype._updateItemsAttributes=function(){this.$().find(c._ITEM_SELECTOR).each(function(e,t){var i=t===this.getFocusDomRef();t.setAttribute("aria-selected",i);t.setAttribute("aria-hidden",!this._isPageDisplayed(e));t.setAttribute("tabindex",i?0:-1)}.bind(this))};c.prototype._updatePageIndicator=function(){this.$("slide-number").text(this._getPageIndicatorText(this._oMobifyCarousel._index))};c.prototype._getPageIndicatorText=function(e){return this._oRb.getText("CAROUSEL_PAGE_INDICATOR_TEXT",[e,this.getPages().length-this._getNumberOfItemsToShow()+1])};c.prototype._adjustHUDVisibility=function(){if(s.system.desktop&&!this._loops()&&this.getPages().length>1){var e=this.$("hud");var t=this._aAllActivePagesIndexes[0];var i=this._aAllActivePagesIndexes[this._aAllActivePagesIndexes.length-1];e.removeClass(c._LEFTMOST_CLASS).removeClass(c._RIGHTMOST_CLASS);if(t===0){e.addClass(c._LEFTMOST_CLASS)}if(i===this.getPages().length-1){e.addClass(c._RIGHTMOST_CLASS)}}};c.prototype.setActivePage=function(e){var t=null;if(typeof e=="string"){t=e}else if(e instanceof i){t=e.getId()}if(t){if(t===this.getActivePage()){return this}var s=this._getPageIndex(t);if(!isNaN(s)){if(this._oMobifyCarousel){this._sOldActivePageId=this.getActivePage();this._oMobifyCarousel.setShouldFireEvent(true);if(this._isPageDisplayed(s)){this._changeActivePage(s)}else{this._moveToPage(s,s+1,true)}}}}this.setAssociation("activePage",t,true);return this};c.prototype._getNavigationArrow=function(e){if(!this["_oArrow"+e]){this["_oArrow"+e]=f.getImageControl(this.getId()+"-arrowScroll"+e,this["_oArrow"+e],this,{src:"sap-icon://slim-arrow-"+e.toLowerCase(),useIconTooltip:false})}return this["_oArrow"+e]};c.prototype._getEmptyPage=function(){if(!this.getAggregation("_emptyPage")){var e=new r({illustrationType:n.NoData});this.setAggregation("_emptyPage",e)}return this.getAggregation("_emptyPage")};c.prototype.previous=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.setShouldFireEvent(true);this._oMobifyCarousel.prev()}else{u.warning("Unable to execute sap.m.Carousel.previous: carousel must be rendered first.")}return this};c.prototype.next=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.setShouldFireEvent(true);this._oMobifyCarousel.next()}else{u.warning("Unable to execute sap.m.Carousel.next: carousel must be rendered first.")}return this};c.prototype._getPageIndex=function(e){var t,i;for(t=0;t<this.getPages().length;t++){if(this.getPages()[t].getId()==e){i=t;break}}return i};c.prototype.onswipe=function(){this._bSwipe=true};c.prototype.ontouchstart=function(e){if(!this.getPages().length){return}if(this._isPageIndicatorArrow(e.target)){e.preventDefault();this._bPageIndicatorArrowPress=true;return}if(this._oMobifyCarousel){if(e.target.draggable){e.target.draggable=false}this._oMobifyCarousel.touchstart(e)}};c.prototype.ontouchmove=function(e){if(this._oMobifyCarousel&&!this._isPageIndicatorArrow(e.target)){this._oMobifyCarousel.touchmove(e)}};c.prototype.ontouchend=function(e){if(this._oMobifyCarousel){if(this._oMobifyCarousel.hasActiveTransition()){this._oMobifyCarousel.onTransitionComplete()}if(!this._isPageIndicatorArrow(e.target)){this._oMobifyCarousel.touchend(e)}}};c.prototype.onsaptabprevious=function(e){this._bDirection=false;if(this._isSlide(e.target)||e.target===this.getDomRef("noData")){this._forwardTab(false)}};c.prototype.onsaptabnext=function(e){this._bDirection=true;var t=this._getActivePageTabbables();if(!t.length||e.target===t.get(-1)){this._forwardTab(true)}};c.prototype._forwardTab=function(e){this.getDomRef(e?"after":"before").focus()};c.prototype._getActivePageTabbables=function(){return this.$(this.getActivePage()+"-slide").find(":sapTabbable")};c.prototype._focusPrevious=function(e){var t=this.getFocusDomRef();if(!t){return}var i=jQuery(t);var s=this._getActivePageTabbables();i.add(s).eq(-1).trigger("focus")};c.prototype.onfocusin=function(e){if(e.target===this.getDomRef("before")&&!this.getDomRef().contains(e.relatedTarget)){this.getFocusDomRef().focus();return}if(e.target===this.getDomRef("after")&&!this.getDomRef().contains(e.relatedTarget)){this._focusPrevious(e);return}if(this._isSlide(e.target)){this.addStyleClass("sapMCrslShowArrows")}this._handlePageElemFocus(e.target);this.saveLastFocusReference(e);this._bDirection=undefined};c.prototype.onfocusout=function(e){if(this._isSlide(e.target)){this.removeStyleClass("sapMCrslShowArrows")}};c.prototype._handlePageElemFocus=function(e){var t;if(this._isSlide(e)){t=jQuery(e).find(".sapMCrsPage").control(0)}else{t=this._getClosestPage(e)}if(t){var i=t.getId();if(i!==this.getActivePage()){this._oMobifyCarousel.setShouldFireEvent(true);this._changeActivePage(this._getPageIndex(i))}}};c.prototype.onkeydown=function(e){if(e.keyCode==h.F7){this._handleF7Key(e);return}if(!this._isSlide(e.target)){return}switch(e.keyCode){case 189:case h.NUMPAD_MINUS:this._fnSkipToIndex(e,-1,false);break;case h.PLUS:case h.NUMPAD_PLUS:this._fnSkipToIndex(e,1,false);break}};c.prototype.onsapright=function(e){this._fnSkipToIndex(e,1,false)};c.prototype.onsapup=function(e){this._fnSkipToIndex(e,1,false)};c.prototype.onsapleft=function(e){this._fnSkipToIndex(e,-1,false)};c.prototype.onsapdown=function(e){this._fnSkipToIndex(e,-1,false)};c.prototype.onsaphome=function(e){this._fnSkipToIndex(e,-this._getPageIndex(this.getActivePage()),true)};c.prototype.onsapend=function(e){this._fnSkipToIndex(e,this.getPages().length-this._getPageIndex(this.getActivePage())-1,true)};c.prototype.onsaprightmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,c._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};c.prototype.onsapupmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,c._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};c.prototype.onsappageup=function(e){this._fnSkipToIndex(e,c._MODIFIERNUMBERFORKEYBOARDHANDLING,true)};c.prototype.onsapleftmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-c._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};c.prototype.onsapdownmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-c._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};c.prototype.onsappagedown=function(e){this._fnSkipToIndex(e,-c._MODIFIERNUMBERFORKEYBOARDHANDLING,true)};c.prototype.saveLastFocusReference=function(e){var t=this._getClosestPage(e.target),i;if(this._bDirection===undefined){return}if(this._lastFocusablePageElement===undefined){this._lastFocusablePageElement={}}if(t){i=t.getId();this._lastFocusablePageElement[i]=e.target}};c.prototype._getActivePageLastFocusedElement=function(){if(this._lastFocusablePageElement){return this._lastFocusablePageElement[this.getActivePage()]}};c.prototype._updateActivePages=function(e){var t=this._getPageIndex(e),i=this._getNumberOfItemsToShow(),s=t+i,o=this.getPages();if(s>o.length){s=o.length-i}this._aAllActivePages=[];this._aAllActivePagesIndexes=[];for(var a=t;a<s;a++){this._aAllActivePages.push(o[a].getId());this._aAllActivePagesIndexes.push(a)}};c.prototype._fnSkipToIndex=function(e,t,i){if(!this._isSlide(e.target)){return}e.preventDefault();if(this._oMobifyCarousel.hasActiveTransition()){this._oMobifyCarousel.onTransitionComplete()}this._oMobifyCarousel.setShouldFireEvent(true);var s=this._makeInRange(this._getPageIndex(this.getActivePage())+t,i);if(this._isPageDisplayed(s)){this._changeActivePage(s)}else if(t>0){this._moveToPage(s,s+1-this._getNumberOfItemsToShow()+1,true)}else{this._moveToPage(s,s+1,true)}};c.prototype._isPageDisplayed=function(e){return this._aAllActivePagesIndexes.includes(e)};c.prototype._handleF7Key=function(e){var t=this._getActivePageLastFocusedElement();if(this._isSlide(e.target)&&t){t.focus()}else{this.getFocusDomRef().focus()}};c.prototype._isSlide=function(e){return e.id.endsWith("slide")&&e.parentElement===this.getDomRef().querySelector(c._INNER_SELECTOR)};c.prototype._isPageIndicatorArrow=function(e){return e.classList.contains("sapMCrslArrow")};c.prototype._loops=function(){return this.getLoop()&&this._getNumberOfItemsToShow()===1};c.prototype._makeInRange=function(e,t){var i=this.getPages().length;var s=e;var o=this._loops();if(e>=i){if(o&&!t){s=0}else{s=i-1}}else if(e<0){if(o&&!t){s=i-1}else{s=0}}return s};c.prototype._getClosestPage=function(e){return jQuery(e).closest(".sapMCrsPage").control(0)};c.prototype.setShowBusyIndicator=function(){u.warning("sap.m.Carousel: Deprecated function 'setShowBusyIndicator' called. Does nothing.");return this};c.prototype.getShowBusyIndicator=function(){u.warning("sap.m.Carousel: Deprecated function 'getShowBusyIndicator' called. Does nothing.");return false};c.prototype.setBusyIndicatorSize=function(e){if(!(e in l)){e=l.Medium}return i.prototype.setBusyIndicatorSize.call(this,e)};return c});
//# sourceMappingURL=Carousel.js.map