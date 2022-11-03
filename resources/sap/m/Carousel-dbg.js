/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Carousel.
sap.ui.define([
	"./library",
	"sap/ui/core/Core",
	"sap/ui/core/Control",
	"sap/ui/Device",
	"sap/ui/core/ResizeHandler",
	"sap/ui/core/library",
	"sap/m/IllustratedMessage",
	"sap/m/IllustratedMessageType",
	"./CarouselRenderer",
	"sap/ui/events/KeyCodes",
	"sap/base/Log",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/mobify-carousel",
	"sap/ui/core/IconPool",
	"./CarouselLayout",
	"sap/ui/dom/jquery/Selectors" // provides jQuery custom selector ":sapTabbable"
], function (
	library,
	Core,
	Control,
	Device,
	ResizeHandler,
	coreLibrary,
	IllustratedMessage,
	IllustratedMessageType,
	CarouselRenderer,
	KeyCodes,
	Log,
	jQuery
	/*, mobifycarousel, IconPool (indirect dependency, kept for compatibility with tests, to be fixed in ImageHelper) */
) {
	"use strict";

	//shortcut for sap.ui.core.BusyIndicatorSize
	var BusyIndicatorSize = coreLibrary.BusyIndicatorSize;

	// shortcut for sap.m.ImageHelper
	var ImageHelper = library.ImageHelper;

	// shortcut for sap.m.CarouselArrowsPlacement
	var CarouselArrowsPlacement = library.CarouselArrowsPlacement;

	// shortcut for sap.m.PlacementType
	var PlacementType = library.PlacementType;

	/**
	 * Constructor for a new Carousel.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The carousel allows the user to browse through a set of items by swiping right or left.
	 * <h3>Overview</h3>
	 * The control is mostly used for showing a gallery of images, but can hold any sap.m control.
	 * <h3>Structure</h3>
	 * The carousel consists of a the following elements:
	 * <ul>
	 * <li>Content area - displays the different items.</li>
	 * <li>Navigation - arrows to the left and right for switching between items.</li>
	 * <li>(optional) Paging - indicator at the bottom to show the current position in the set.</li>
	 * </ul>
	 * The paging indicator can be configured as follows:
	 * <ul>
	 * <li><code>showPageIndicator</code> - determines if the indicator is displayed.</li>
	 * <li>If the pages are less than 9, the page indicator is represented with bullets.</li>
	 * <li>If the pages are 9 or more, the page indicator is numeric.</li>
	 * <li><code>pageIndicatorPlacement</code> - determines where the indicator is located. Default (<code>sap.m.PlacementType.Bottom</code>) - below the content.</li>
	 *</ul>
	 * Additionally, you can also change the location of the navigation arrows.
	 * By setting <code>arrowsPlacement</code> to <code>sap.m.CarouselArrowsPlacement.PageIndicator</code>, the arrows will be located at the bottom by the paging indicator.
	 * Note: When the content is of type <code>sap.m.Image</code> add "Image" text at the end of the <code>"alt"</code> description in order to provide accessibility info for the UI element.
	 * <h3>Usage</h3>
	 * <h4> When to use</h4>
	 * <ul>
	 * <li>The items you want to display are very different from each other.</li>
	 * <li>You want to display the items one after the other.</li>
	 * </ul>
	 * <h4> When not to use</h4>
	 * <ul>
	 * <li>The items you want to display need to be visible at the same time.</li>
	 * <li>The items you want to display are uniform and very similar</li>
	 * </ul>
	 * <h3>Responsive Behavior</h3>
	 * <ul>
	 * <li>On touch devices, navigation is performed with swipe gestures (swipe right or swipe left).</li>
	 * <li>On desktop, navigation is done with the navigation arrows.</li>
	 * <li>The paging indicator (when activated) is visible on each form factor.</li>
	 * </ul>
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.108.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Carousel
	 * @see {@link fiori:https://experience.sap.com/fiori-design-web/carousel/ Carousel}
	 */
	var Carousel = Control.extend("sap.m.Carousel", /** @lends sap.m.Carousel.prototype */ {
		metadata : {

			library : "sap.m",
			designtime: "sap/m/designtime/Carousel.designtime",
			properties : {

				/**
				 * The height of the carousel. Note that when a percentage value is used, the height of the surrounding container must be defined.
				 */
				height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

				/**
				 * The width of the carousel. Note that when a percentage value is used, the height of the surrounding container must be defined.
				 */
				width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

				/**
				 * Defines whether the carousel should loop, i.e show the first page after the last page is reached and vice versa.
				 */
				loop : {type : "boolean", group : "Misc", defaultValue : false},

				/**
				 * Show or hide carousel's page indicator.
				 */
				showPageIndicator : {type : "boolean", group : "Appearance", defaultValue : true},

				/**
				 * Defines where the carousel's page indicator is displayed. Possible values are sap.m.PlacementType.Top, sap.m.PlacementType.Bottom. Other values are ignored and the default value will be applied. The default value is sap.m.PlacementType.Bottom.
				 */
				pageIndicatorPlacement : {type : "sap.m.PlacementType", group : "Appearance", defaultValue : PlacementType.Bottom},

				/**
				 * Show or hide busy indicator in the carousel when loading pages after swipe.
				 * @deprecated Since version 1.18.7.
				 * Since 1.18.7 pages are no longer loaded or unloaded. Therefore busy indicator is not necessary any longer.
				 */
				showBusyIndicator : {type : "boolean", group : "Appearance", defaultValue : true, deprecated: true},

				/**
				 * Defines where the carousel's arrows are placed. Default is <code>sap.m.CarouselArrowsPlacement.Content</code> used to
				 * place the arrows on the sides of the carousel. Alternatively <code>sap.m.CarouselArrowsPlacement.PageIndicator</code> can
				 * be used to place the arrows on the sides of the page indicator.
				 */
				arrowsPlacement : {type : "sap.m.CarouselArrowsPlacement", group : "Appearance", defaultValue : CarouselArrowsPlacement.Content}
			},
			defaultAggregation : "pages",
			aggregations : {

				/**
				 * The content which the carousel displays.
				 */
				pages : {type : "sap.ui.core.Control", multiple : true, singularName : "page"},

				/**
				 * Defines how many pages are displayed in the visible area of the <code>Carousel</code> control.
				 *
				 * <b>Note:</b> When this property is used, the <code>loop</code> property is ignored.
				 * @since 1.62
				 */
				customLayout: { type: "sap.m.CarouselLayout", multiple: false },

				/**
				 * Message page, that is shown when no pages are loaded or provided
				 */
				_emptyPage: { type: "sap.m.IllustratedMessage", multiple: false, visibility: "hidden" }
			},
			associations : {

				/**
				 * Provides getter and setter for the currently displayed page. For the setter, argument may be the control itself, which must be member of the carousel's page list, or the control's id.
				 * The getter will return the control id
				 */
				activePage : {type : "sap.ui.core.Control", multiple : false}
			},
			events : {

				/**
				 * Carousel requires a new page to be loaded. This event may be used to fill the content of that page
				 * @deprecated Since version 1.18.7.
				 * Since 1.18.7 pages are no longer loaded or unloaded
				 */
				loadPage : {deprecated: true,
					parameters : {

						/**
						 * Id of the page which will be loaded
						 */
						pageId : {type : "string"}
					}
				},

				/**
				 * Carousel does not display a page any longer and unloads it. This event may be used to clean up the content of that page.
				 * @deprecated Since version 1.18.7.
				 * Since 1.18.7 pages are no longer loaded or unloaded
				 */
				unloadPage : {deprecated: true,
					parameters : {

						/**
						 * Id of the page which will be unloaded
						 */
						pageId : {type : "string"}
					}
				},

				/**
				 * This event is fired after a carousel swipe has been completed.
				 * It is triggered both by physical swipe events and through API carousel manipulations such as calling
				 * 'next', 'previous' or 'setActivePage' functions.
				 */
				pageChanged : {
					parameters : {

						/**
						 * ID of the page which was active before the page change.
						 */
						oldActivePageId : {type : "string"},

						/**
						 * ID of the page which will be active after the page change.
						 */
						newActivePageId : {type : "string"},

						/**
						 * Indexes of all active pages after the page change.
						 * @since 1.62
						 */
						activePages : {type : "array"}
					}
				},

				/**
				 * This event is fired before a carousel swipe has been completed.
				 * It is triggered both by physical swipe events and through API carousel manipulations such as calling
				 * 'next', 'previous' or 'setActivePage' functions.
				 */
				beforePageChanged : {
					parameters : {

						/**
						 * Indexes of all active pages after the page change.
						 * @since 1.63
						 */
						activePages : {type : "array"}
					}
				}
			}
		},

		renderer: CarouselRenderer
	});

	//Constants convenient class selections
	Carousel._INNER_SELECTOR = ".sapMCrslInner";
	Carousel._PAGE_INDICATOR_SELECTOR = ".sapMCrslBulleted";
	Carousel._PAGE_INDICATOR_ARROWS_SELECTOR = ".sapMCrslIndicatorArrow";
	Carousel._CONTROLS = ".sapMCrslControls";
	Carousel._ITEM_SELECTOR = ".sapMCrslItem";
	Carousel._LEFTMOST_CLASS = "sapMCrslLeftmost";
	Carousel._RIGHTMOST_CLASS = "sapMCrslRightmost";
	Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING = 10; // The number 10 is by keyboard specification
	Carousel._BULLETS_TO_NUMBERS_THRESHOLD = 9; //The number 9 is by visual specification. Less than 9 pages - bullets for page indicator. 9 or more pages - numeric page indicator.

	/**
	 * Initialize member variables which are needed later on.
	 *
	 * @private
	 */
	Carousel.prototype.init = function() {
		//Initialize '_fnAdjustAfterResize' to be used by window
		//'resize' event
		this._fnAdjustAfterResize = function() {
			var $carouselInner = this.$().find(Carousel._INNER_SELECTOR);
			this._oMobifyCarousel.resize($carouselInner);

			if (this.getPages().length > 1) {
				this._setWidthOfPages(this._getNumberOfItemsToShow());
			}
		}.bind(this);

		this._aAllActivePages = [];
		this._aAllActivePagesIndexes = [];

		this._onBeforePageChangedRef = this._onBeforePageChanged.bind(this);
		this._onAfterPageChangedRef = this._onAfterPageChanged.bind(this);

		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling

		this._oRb = Core.getLibraryResourceBundle("sap.m");
	};

	/**
	 * Called when the control is destroyed.
	 *
	 * @private
	 */
	Carousel.prototype.exit = function() {
		if (this._oMobifyCarousel) {
			this._oMobifyCarousel.destroy();
			delete this._oMobifyCarousel;
		}

		if (this._oArrowLeft) {
			this._oArrowLeft.destroy();
			delete this._oArrowLeft;
		}
		if (this._oArrowRight) {
			this._oArrowRight.destroy();
			delete this._oArrowRight;
		}

		if (this._sResizeListenerId) {
			ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}
		this.$().off('afterSlide');

		this._fnAdjustAfterResize = null;
		this._$InnerDiv = null;
		this._aAllActivePages = null;
		this._aAllActivePagesIndexes = null;
	};

	Carousel.prototype.onBeforeRendering = function() {
		if (!this.getActivePage() && this.getPages().length > 0) {
			//if no active page is specified, set first page.
			this.setAssociation("activePage", this.getPages()[0].getId(), true);
		}

		var sActivePage = this.getActivePage();

		if (sActivePage) {
			this._updateActivePages(sActivePage);
		}

		if (this._sResizeListenerId) {
			ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}

		// remove event delegates before rendering
		this.$().off('beforeSlide', this._onBeforePageChangedRef);
		this.$().off('afterSlide', this._onAfterPageChangedRef);

		return this;
	};

	/**
	 * Returns the number of items displayed in <code>Carousel</code>, depending on the <code>CarouselLayout</code> aggregation settings and pages count.
	 *
	 * @private
	 */
	Carousel.prototype._getNumberOfItemsToShow = function () {
		var iPagesCount = this.getPages().length,
			oCarouselLayout = this.getCustomLayout(),
			iNumberOfItemsToShow = 1;

		// If someone sets visiblePagesCount <= 0 to the CarouselLayout aggregation, the default value of 1 is returned instead.
		if (oCarouselLayout && oCarouselLayout.isA("sap.m.CarouselLayout")) {
			iNumberOfItemsToShow = Math.max(oCarouselLayout.getVisiblePagesCount(), 1);
		}

		// Carousel cannot show more items than its total pages count
		if (iNumberOfItemsToShow > 1 && iPagesCount < iNumberOfItemsToShow) {
			return iPagesCount;
		}

		return iNumberOfItemsToShow;
	};

	/**
	 * When this method is called for the first time, a swipe-view instance is created which is renders
	 * itself into its dedicated spot within the DOM tree. This instance is used throughout the
	 * Carousel instance's lifecycle.
	 *
	 * @private
	 */
	Carousel.prototype.onAfterRendering = function() {
		if (this._oMobifyCarousel) {
			// Clean up existing mobify carousel listeners
			this._oMobifyCarousel.unbind();

			setTimeout(function () {
				if (this._oMobifyCarousel) {
					this._oMobifyCarousel.onTransitionComplete();
				}
			}.bind(this), 0);
		}

		//Create and initialize new carousel
		//Undefined is passed as an action, as we do not want to pass any action to be executed
		//and want to bypass the check whether the typeof of the action is "object" (as null returns true).
		var iNumberOfItemsToShow = this._getNumberOfItemsToShow();
		this.$().carousel(undefined, { numberOfItemsToShow: iNumberOfItemsToShow });
		this._oMobifyCarousel = this.getDomRef()._carousel;
		this._oMobifyCarousel.setLoop(this.getLoop());
		this._oMobifyCarousel.setRTL(Core.getConfiguration().getRTL());

		if (iNumberOfItemsToShow > 1) {
			this._setWidthOfPages(iNumberOfItemsToShow);
		}

		//Go to active page: this may be necessary after adding or
		//removing pages
		var sActivePage = this.getActivePage();
		if (sActivePage) {
			var iIndex = this._getPageIndex(sActivePage);
			if (isNaN(iIndex) || iIndex == 0) {
				if (this.getPages().length > 0) {
					//First page is always shown as default
					//Do not fire page changed event, though
					this.setAssociation("activePage", this.getPages()[0].getId(), true);
					this._adjustHUDVisibility();
				}
			} else {
				if (Core.isThemeApplied()) {
					this._moveToPage(iIndex, iIndex + 1, false);
				} else {
					Core.attachThemeChanged(this._handleThemeLoad, this);
				}

				// BCP: 1580078315
				if (this.getParent() && this.getParent().isA("sap.zen.commons.layout.PositionContainer")) {
					if (this._isCarouselUsedWithCommonsLayout === undefined) {
						setTimeout(this["invalidate"].bind(this), 0);
						this._isCarouselUsedWithCommonsLayout = true;
					}
				}
			}
		}

		this.$().on('beforeSlide', this._onBeforePageChangedRef);

		//attach delegate for firing 'PageChanged' events to mobify carousel's
		//'afterSlide'
		this.$().on('afterSlide', this._onAfterPageChangedRef);

		this._$InnerDiv = this.$().find(Carousel._INNER_SELECTOR)[0];

		this._sResizeListenerId = ResizeHandler.register(this._$InnerDiv, this._fnAdjustAfterResize);

		// Fixes displaying correct page after carousel become visible in an IconTabBar
		// BCP: 1680019792
		var oParent = this.getParent();
		while (oParent) {
			if (oParent.isA("sap.m.IconTabBar")) {
				var that = this;

				/*eslint-disable no-loop-func */
				oParent.attachExpand(function (oEvt) {
					var bExpand = oEvt.getParameter('expand');
					if (bExpand && iIndex > 0) {
						that._moveToPage(iIndex, iIndex + 1, false);
					}
				});
				break;
			}

			oParent = oParent.getParent();
		}
	};

	Carousel.prototype.getFocusDomRef = function () {
		return this.getDomRef(this.getActivePage() + "-slide") || this.getDomRef("noData");
	};

	/**
	 * Calls logic for updating active pages and fires 'beforePageChanged' event with the new active pages.
	 *
	 * @param {object} oEvent event object
	 * @param {int} iPreviousSlide mobify carousel index of the previous active slide (1-based)
	 * @param {int} iNextSlide mobify carousel index of the next active slide (1-based)
	 * @private
	 */
	Carousel.prototype._onBeforePageChanged = function (oEvent, iPreviousSlide, iNextSlide) {
		//the event might bubble up from another carousel inside of this one.
		//in this case we ignore the event
		if (oEvent.target !== this.getDomRef()) {
			return;
		}

		var sNewActivePageId = this.getPages()[iNextSlide - 1].getId();
		this._updateActivePages(sNewActivePageId);

		this.fireBeforePageChanged({
			activePages: this._aAllActivePagesIndexes
		});
	};

	/**
	 * @param {object} oEvent event object
	 * @param {int} iPreviousSlide mobify carousel index of the previous active slide (1-based)
	 * @param {int} iNextSlide mobify carousel index of the next active slide (1-based)
	 * @private
	 */
	Carousel.prototype._onAfterPageChanged = function (oEvent, iPreviousSlide, iNextSlide) {
		var bHasPages = this.getPages().length > 0;

		//the event might bubble up from another carousel inside of this one.
		//in this case we ignore the event
		if (oEvent.target !== this.getDomRef()) {
			return;
		}

		if (!bHasPages) {
			return;
		}

		var iNewActivePageIndex;

		if (this._iNewActivePageIndex !== undefined) {
			iNewActivePageIndex = this._iNewActivePageIndex;
		} else if (this._bPageIndicatorArrowPress || this._bSwipe) {
			var bForward = iPreviousSlide < iNextSlide;
			var iOldActivePageIndex = this._getPageIndex(this.getActivePage());

			if (this._isPageDisplayed(iOldActivePageIndex)) {
				iNewActivePageIndex = iOldActivePageIndex;
			} else {
				if (bForward) {
					iNewActivePageIndex = iOldActivePageIndex + 1;
				} else {
					iNewActivePageIndex = iOldActivePageIndex - 1;
				}

				// loop happened
				if (!this._isPageDisplayed(iNewActivePageIndex)) {
					iNewActivePageIndex = iNextSlide - 1;
				}
			}
		} else {
			iNewActivePageIndex = iNextSlide - 1;
		}

		this._changeActivePage(iNewActivePageIndex);

		delete this._iNewActivePageIndex;
		delete this._bPageIndicatorArrowPress;
		delete this._bSwipe;
	};

	/**
	 * Sets the width of the visible pages, rendered in the <code>Carousel</code> control.
	 *
	 * @param {int} iNumberOfItemsToShow number of items to be shown from 'pages' aggregation.
	 * @private
	 */
	Carousel.prototype._setWidthOfPages = function (iNumberOfItemsToShow) {
		var $items = this.$().find(".sapMCrslItem"),
			iItemWidth;

		if (!$items.length) {
			// pages are not yet rendered, calculation will be done in the next onAfterRendering
			return;
		}

		iItemWidth = this._calculatePagesWidth(iNumberOfItemsToShow);

		$items.each(function (iIndex, oPage) {
			oPage.style.width = iItemWidth  + "%";
		});
	};

	/**
	 * Calculates the correct width of the visible pages, rendered in the <code>Carousel</code> control.
	 *
	 * @param {int} iNumberOfItemsToShow number of items to be shown from 'pages' aggregation.
	 * @returns {float} width of each page in percentage
	 * @private
	 */
	Carousel.prototype._calculatePagesWidth = function (iNumberOfItemsToShow) {
		var iWidth = this.$().width(),
			oSlide = this.getDomRef().querySelector(".sapMCrslFluid .sapMCrslItem"),
			iMargin = parseFloat(window.getComputedStyle(oSlide).marginRight),
			iItemWidth = (iWidth - (iMargin * (iNumberOfItemsToShow - 1))) / iNumberOfItemsToShow,
			iItemWidthPercent = (iItemWidth / iWidth) * 100;

		return iItemWidthPercent;
	};

	/**
	 * Fired when the theme is loaded
	 *
	 * @private
	 */
	Carousel.prototype._handleThemeLoad = function() {

		var sActivePage = this.getActivePage();

		if (sActivePage) {
			var iIndex = this._getPageIndex(sActivePage);
			if (iIndex > 0) {
				this._moveToPage(iIndex, iIndex + 1, false);
			}
		}

		Core.detachThemeChanged(this._handleThemeLoad, this);
	};

	/**
	 * Moves mobify carousel to specific page and changes the active page after the move has been completed.
	 * Each mobify carousel page can hold multiple carousel pages.
	 *
	 * @param {int} iIndex index of the new active page in 'pages' aggregation.
	 * @param {int} iMobifyIndex index of mobify carousel page  to display (1-based).
	 * @param {boolean} bTransition Whether to perform smooth move, using transition, or to (almost) immediately change page
	 * @private
	 */
	Carousel.prototype._moveToPage = function(iIndex, iMobifyIndex, bTransition) {
		if (!bTransition) {
			this._oMobifyCarousel.changeAnimation("sapMCrslNoTransition");
		}

		this._iNewActivePageIndex = iIndex;
		this._oMobifyCarousel.move(iMobifyIndex);
	};

	/**
	 * Private method which adjusts the Hud visibility and fires a page change
	 * event when the active page changes
	 *
	 * @param {int} iNewPageIndex index of new page in 'pages' aggregation.
	 * @private
	 */
	Carousel.prototype._changeActivePage = function(iNewPageIndex) {
		var sOldActivePageId = this.getActivePage();

		if (this._sOldActivePageId) {
			sOldActivePageId = this._sOldActivePageId;
			delete this._sOldActivePageId;
		}

		var sNewActivePageId = this.getPages()[iNewPageIndex].getId();

		this.setAssociation("activePage", sNewActivePageId, true);

		// close the soft keyboard
		if (!Device.system.desktop) {
			jQuery(document.activeElement).trigger("blur");
		}

		if (this._oMobifyCarousel && this._oMobifyCarousel.getShouldFireEvent()) {
			Log.debug("sap.m.Carousel: firing pageChanged event: old page: " + sOldActivePageId + ", new page: " + sNewActivePageId);
			this.firePageChanged({
				oldActivePageId: sOldActivePageId,
				newActivePageId: sNewActivePageId,
				activePages: this._aAllActivePagesIndexes
			});
		}

		this._adjustHUDVisibility();
		this._updateItemsAttributes();
		this._updatePageIndicator();

		// focus the new page if the focus was in the carousel and is not on some of the page children
		if (this.getDomRef().contains(document.activeElement) && !this.getFocusDomRef().contains(document.activeElement) || this._bPageIndicatorArrowPress) {
			this.getFocusDomRef().focus({ preventScroll: true });
		}
	};

	Carousel.prototype._updateItemsAttributes = function () {
		this.$().find(Carousel._ITEM_SELECTOR).each(function (iIndex, oPage) {
			var bIsActivePage = oPage === this.getFocusDomRef();

			oPage.setAttribute("aria-selected", bIsActivePage);
			oPage.setAttribute("aria-hidden", !this._isPageDisplayed(iIndex));
			oPage.setAttribute("tabindex", bIsActivePage ? 0 : -1);
		}.bind(this));
	};

	Carousel.prototype._updatePageIndicator = function () {
		// change the number in the page indicator
		this.$("slide-number").text(this._getPageIndicatorText(this._oMobifyCarousel._index));
	};

	/**
	 * Returns page indicator text.
	 *
	 * @param {int} iNewPageIndex mobify carousel index of the active slide (1-based)
	 * @returns {string} page indicator text
	 * @private
	 */
	Carousel.prototype._getPageIndicatorText = function (iNewPageIndex) {
		return this._oRb.getText("CAROUSEL_PAGE_INDICATOR_TEXT", [iNewPageIndex, this.getPages().length  - this._getNumberOfItemsToShow() + 1]);
	};

	/**
	 * Sets HUD control's visibility after page has changed
	 *
	 * @private
	 */
	Carousel.prototype._adjustHUDVisibility = function() {
		if (Device.system.desktop && !this._loops() && this.getPages().length > 1) {
			//update HUD arrow visibility for left- and rightmost pages
			var $HUDContainer = this.$('hud');
			var iFirstDisplayedPageIndex = this._aAllActivePagesIndexes[0];
			var iLastDisplayedPageIndex = this._aAllActivePagesIndexes[this._aAllActivePagesIndexes.length - 1];

			//clear marker classes first
			$HUDContainer.removeClass(Carousel._LEFTMOST_CLASS).removeClass(Carousel._RIGHTMOST_CLASS);

			if (iFirstDisplayedPageIndex === 0) {
				$HUDContainer.addClass(Carousel._LEFTMOST_CLASS);
			}

			if (iLastDisplayedPageIndex === this.getPages().length - 1) {
				$HUDContainer.addClass(Carousel._RIGHTMOST_CLASS);
			}
		}
	};

	Carousel.prototype.setActivePage = function (vPage) {
		var sPageId = null;
		if (typeof (vPage) == 'string') {
			sPageId = vPage;
		} else if (vPage instanceof Control) {
			sPageId = vPage.getId();
		}

		if (sPageId) {
			if (sPageId === this.getActivePage()) {
				//page has not changed, nothing to do, return
				return this;
			}
			var iPageNr = this._getPageIndex(sPageId);

			if (!isNaN(iPageNr)) {
				if (this._oMobifyCarousel) {
					this._sOldActivePageId = this.getActivePage();
					this._oMobifyCarousel.setShouldFireEvent(true);

					if (this._isPageDisplayed(iPageNr)) {
						this._changeActivePage(iPageNr);
					} else {
						this._moveToPage(iPageNr, iPageNr + 1, true);
					}
				}
				// if oMobifyCarousel is not present yet, move takes place
				// 'onAfterRendering', when oMobifyCarousel is created
			}
		}

		this.setAssociation("activePage", sPageId, true);

		return this;
	};

	/**
	 * Returns the icon of the requested direction (left/right).
	 * @private
	 * @param {string} sDirection Left or Right
	 * @returns {sap.ui.core.Control} icon of the requested arrow
	 */
	Carousel.prototype._getNavigationArrow = function (sDirection) {
		if (!this["_oArrow" + sDirection]) {
			this["_oArrow" + sDirection] = ImageHelper.getImageControl(
				this.getId() + "-arrowScroll" + sDirection,
				this["_oArrow" + sDirection],
				this,
				{ src: "sap-icon://slim-arrow-" + sDirection.toLowerCase(), useIconTooltip: false }
			);
		}

		return this["_oArrow" + sDirection];
	};

	/**
	 * Private method that creates message page when no pages are loaded or provided
	 *
	 * @private
	 */
	Carousel.prototype._getEmptyPage = function () {
		if (!this.getAggregation("_emptyPage")) {
			var emptyPage = new IllustratedMessage({
				illustrationType: IllustratedMessageType.NoData
			});

			this.setAggregation("_emptyPage", emptyPage);
		}

		return this.getAggregation("_emptyPage");
	};

	/**
	 * Call this method to display the previous page (corresponds to a swipe left).
	 *
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Carousel.prototype.previous = function () {
		if (this._oMobifyCarousel) {
			this._oMobifyCarousel.setShouldFireEvent(true);
			this._oMobifyCarousel.prev();
		} else {
			Log.warning("Unable to execute sap.m.Carousel.previous: carousel must be rendered first.");
		}
		return this;
	};

	/**
	 * Call this method to display the next page (corresponds to a swipe right).
	 *
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Carousel.prototype.next = function () {
		if (this._oMobifyCarousel) {
			this._oMobifyCarousel.setShouldFireEvent(true);
			this._oMobifyCarousel.next();
		} else {
			Log.warning("Unable to execute sap.m.Carousel.next: carousel must be rendered first.");
		}
		return this;
	};

	/**
	 * Determines the position of a given page in the carousel's page list
	 *
	 * @return the position of a given page in the carousel's page list or 'undefined' if it does not exist in the list.
	 * @private
	 */
	Carousel.prototype._getPageIndex = function(sPageId) {
		var i, result;

		for (i = 0; i < this.getPages().length; i++) {
			if (this.getPages()[i].getId() == sPageId) {
				result = i;
				break;
			}
		}
		return result;
	};

	Carousel.prototype.onswipe = function() {
		this._bSwipe = true;
	};

	/**
	 * Delegates 'touchstart' event to mobify carousel
	 *
	 * @param oEvent
	 */
	Carousel.prototype.ontouchstart = function(oEvent) {
		if (!this.getPages().length) {
			return;
		}

		if (this._isPageIndicatorArrow(oEvent.target)) {
			// prevent upcoming focusin event on the arrow and focusout on the active page
			oEvent.preventDefault();
			this._bPageIndicatorArrowPress = true;
			return;
		}

		if (this._oMobifyCarousel) {
			if (oEvent.target.draggable) {
				// Some elements like images are draggable by default.
				// When swiped they begin dragging as ghost images (eg. dragstart event).
				// This dragging behavior is not desired when inside a Carousel, so we disable it.
				// Note that preventDefault() prevents next events to happen (in particular focusin), so disable the dragging via property
				oEvent.target.draggable = false;
			}

			this._oMobifyCarousel.touchstart(oEvent);
		}
	};

	/**
	 * Delegates 'touchmove' event to mobify carousel
	 *
	 * @param oEvent
	 */
	Carousel.prototype.ontouchmove = function(oEvent) {
		if (this._oMobifyCarousel && !this._isPageIndicatorArrow(oEvent.target)) {
			this._oMobifyCarousel.touchmove(oEvent);
		}
	};

	/**
	 * Delegates 'touchend' event to mobify carousel
	 *
	 * @param oEvent
	 */
	Carousel.prototype.ontouchend = function(oEvent) {
		if (this._oMobifyCarousel) {
			if (this._oMobifyCarousel.hasActiveTransition()) {
				this._oMobifyCarousel.onTransitionComplete();
			}

			if (!this._isPageIndicatorArrow(oEvent.target)) {
				this._oMobifyCarousel.touchend(oEvent);
			}
		}
	};

	//================================================================================
	// Keyboard handling
	//================================================================================

	/**
	 * Handler for 'tab previous' key event.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 *
	 */
	Carousel.prototype.onsaptabprevious = function(oEvent) {
		this._bDirection = false;

		if (this._isSlide(oEvent.target) || oEvent.target === this.getDomRef("noData")) {
			this._forwardTab(false);
		}
	};

	/**
	 * Handler for 'tab next' key event.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 *
	 */
	Carousel.prototype.onsaptabnext = function(oEvent) {
		this._bDirection = true;

		var $activePageTabbables = this._getActivePageTabbables();

		if (!$activePageTabbables.length || oEvent.target === $activePageTabbables.get(-1)) {
			this._forwardTab(true);
		}
	};

	Carousel.prototype._forwardTab = function (bForward) {
		this.getDomRef(bForward ? "after" : "before").focus();
	};

	Carousel.prototype._getActivePageTabbables = function () {
		return this.$(this.getActivePage() + "-slide").find(":sapTabbable");
	};

	/**
	 * Focus the last interactive element inside the active page, or the page itself
	 * @param {jQuery.Event} oEvent the event
	 */
	 Carousel.prototype._focusPrevious = function(oEvent) {
		var oActivePageDomRef = this.getFocusDomRef();

		if (!oActivePageDomRef) {
			return;
		}

		var $activePage = jQuery(oActivePageDomRef);
		var $activePageTabbables = this._getActivePageTabbables();

		$activePage.add($activePageTabbables).eq(-1).trigger("focus");
	};

	/**
	 * Handler for focus event
	 *
	 * @param {Object} oEvent - The event object
	 */
	Carousel.prototype.onfocusin = function(oEvent) {
		if (oEvent.target === this.getDomRef("before") && !this.getDomRef().contains(oEvent.relatedTarget)) {
			this.getFocusDomRef().focus();
			return;
		}

		if (oEvent.target === this.getDomRef("after") && !this.getDomRef().contains(oEvent.relatedTarget)) {
			this._focusPrevious(oEvent);
			return;
		}

		if (this._isSlide(oEvent.target)) {
			this.addStyleClass("sapMCrslShowArrows");
		}

		this._handlePageElemFocus(oEvent.target);

		// Save focus reference
		this.saveLastFocusReference(oEvent);
		// Reset the reference for future use
		this._bDirection = undefined;
	};

	Carousel.prototype.onfocusout = function(oEvent) {
		if (this._isSlide(oEvent.target)) {
			this.removeStyleClass("sapMCrslShowArrows");
		}
	};

	/**
	 * When any element is focused with mouse set its containing page as active page
	 * @param {HTMLElement} oFocusedElement The focused element
	 */
	Carousel.prototype._handlePageElemFocus = function(oFocusedElement) {
		var oPage;

		if (this._isSlide(oFocusedElement)) {
			oPage = jQuery(oFocusedElement).find(".sapMCrsPage").control(0);
		} else {
			oPage = this._getClosestPage(oFocusedElement);
		}

		if (oPage) {
			var sPageId = oPage.getId();

			if (sPageId !== this.getActivePage()) {
				this._oMobifyCarousel.setShouldFireEvent(true);
				this._changeActivePage(this._getPageIndex(sPageId));
			}
		}
	};

	/**
	 * Handler for key down
	 *
	 * @param {Object} oEvent - key object
	 */
	Carousel.prototype.onkeydown = function(oEvent) {

		if (oEvent.keyCode == KeyCodes.F7) {
			this._handleF7Key(oEvent);
			return;
		}

		if (!this._isSlide(oEvent.target)) {
			return;
		}

		switch (oEvent.keyCode) {

			// Minus keys
			// TODO  KeyCodes.MINUS is not returning 189
			case 189:
			case KeyCodes.NUMPAD_MINUS:
				this._fnSkipToIndex(oEvent, -1, false);
				break;

			// Plus keys
			case KeyCodes.PLUS:
			case KeyCodes.NUMPAD_PLUS:
				this._fnSkipToIndex(oEvent, 1, false);
				break;
		}
	};

	/**
	 * Move focus to the next item. If focus is on the last item, do nothing.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapright = function(oEvent) {
		this._fnSkipToIndex(oEvent, 1, false);
	};

	/**
	 * Move focus to the next item. If focus is on the last item, do nothing.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapup = function(oEvent) {
		this._fnSkipToIndex(oEvent, 1, false);
	};

	/**
	 * Move focus to the previous item. If focus is on the first item, do nothing.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapleft = function(oEvent) {
		this._fnSkipToIndex(oEvent, -1, false);
	};

	/**
	 *
	 * Move focus to the next item. If focus is on the last item, do nothing.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapdown = function(oEvent) {
		this._fnSkipToIndex(oEvent, -1, false);
	};

	/**
	 * Move focus to the first item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsaphome = function(oEvent) {
		this._fnSkipToIndex(oEvent, -this._getPageIndex(this.getActivePage()), true);
	};

	/**
	 * Move focus to the last item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapend = function(oEvent) {
		this._fnSkipToIndex(oEvent, this.getPages().length - this._getPageIndex(this.getActivePage()) - 1, true);
	};

	/**
	 * Move focus 10 items to the right. If there are less than 10 items right, move
	 * focus to last item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsaprightmodifiers = function(oEvent) {
		if (oEvent.ctrlKey) {
			this._fnSkipToIndex(oEvent, Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING, true);
		}
	};

	/**
	 * Move focus 10 items to the right. If there are less than 10 items right, move
	 * focus to last item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapupmodifiers = function(oEvent) {
		if (oEvent.ctrlKey) {
			this._fnSkipToIndex(oEvent, Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING, true);
		}
	};

	/**
	 * Move focus 10 items to the right. If there are less than 10 items right, move
	 * focus to last item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsappageup = function(oEvent) {
		this._fnSkipToIndex(oEvent, Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING, true);
	};

	/**
	 * Move focus 10 items to the left. If there are less than 10 items left, move
	 * focus to first item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapleftmodifiers = function(oEvent) {
		if (oEvent.ctrlKey) {
			this._fnSkipToIndex(oEvent, -Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING, true);
		}
	};

	/**
	 * Move focus 10 items to the left. If there are less than 10 items left, move
	 * focus to first item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsapdownmodifiers = function(oEvent) {
		if (oEvent.ctrlKey) {
			this._fnSkipToIndex(oEvent, -Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING, true);
		}
	};

	/**
	 * Move focus 10 items to the left. If there are less than 10 items left, move
	 * focus to first item.
	 *
	 * @param {Object} oEvent - key event
	 * @private
	 */
	Carousel.prototype.onsappagedown = function(oEvent) {
		this._fnSkipToIndex(oEvent, -Carousel._MODIFIERNUMBERFORKEYBOARDHANDLING, true);
	};

	/**
	 * Save reference of the last focused element for each page
	 *
	 * @param {Object} oEvent - The event object
	 * @private
	 */
	Carousel.prototype.saveLastFocusReference = function(oEvent) {
		var oClosestPage = this._getClosestPage(oEvent.target),
			sFocusedPageId;

		// Don't save focus references triggered from the mouse
		if (this._bDirection === undefined) {
			return;
		}

		if (this._lastFocusablePageElement === undefined) {
			this._lastFocusablePageElement = {};
		}

		if (oClosestPage) {
			sFocusedPageId = oClosestPage.getId();
			this._lastFocusablePageElement[sFocusedPageId] = oEvent.target;
		}
	};

	/**
	 * Returns the last element that has been focused in the last focused active page.
	 * @returns {Element | undefined}  HTML DOM or undefined
	 * @private
	 */
	Carousel.prototype._getActivePageLastFocusedElement = function() {
		if (this._lastFocusablePageElement) {
			return this._lastFocusablePageElement[this.getActivePage()];
		}
	};

	/**
	 * Updates the currently active (visible) pages.
	 * @param {number} sNewActivePageId - The new active page ID
	 * @private
	 */
	Carousel.prototype._updateActivePages = function(sNewActivePageId) {
		var iNewPageIndex = this._getPageIndex(sNewActivePageId),
			iNumberOfItemsToShown = this._getNumberOfItemsToShow(),
			iLastPageIndex = iNewPageIndex + iNumberOfItemsToShown,
			aAllPages = this.getPages();

		// When CarouselLayout is used, the index of the activePage should not exceed allPages count minus the number of visible pages
		if (iLastPageIndex > aAllPages.length) {
			iLastPageIndex = aAllPages.length - iNumberOfItemsToShown;
		}

		this._aAllActivePages = [];
		this._aAllActivePagesIndexes = [];

		for (var i = iNewPageIndex; i < iLastPageIndex; i++) {
			this._aAllActivePages.push(aAllPages[i].getId());
			this._aAllActivePagesIndexes.push(i);
		}
	};

	/**
	 * Change active page via keyboard
	 *
	 * @param {Object} oEvent - The event object
	 * @param {int} iOffset - The index offset from the currently active page.
	 * @param {int} bPreventLoop Whether to prevent potential loop
	 * @private
	 */
	Carousel.prototype._fnSkipToIndex = function(oEvent, iOffset, bPreventLoop) {
		if (!this._isSlide(oEvent.target)) {
			return;
		}

		oEvent.preventDefault();

		if (this._oMobifyCarousel.hasActiveTransition()) {
			this._oMobifyCarousel.onTransitionComplete();
		}

		this._oMobifyCarousel.setShouldFireEvent(true);

		// Calculate the index of the next active page
		var iNewActivePageIndex = this._makeInRange(this._getPageIndex(this.getActivePage()) + iOffset, bPreventLoop);

		if (this._isPageDisplayed(iNewActivePageIndex)) {
			this._changeActivePage(iNewActivePageIndex);
		} else if (iOffset > 0) { // forward
			this._moveToPage(iNewActivePageIndex, iNewActivePageIndex + 1 - this._getNumberOfItemsToShow() + 1, true);
		} else { // backward
			this._moveToPage(iNewActivePageIndex, iNewActivePageIndex + 1, true);
		}
	};

	Carousel.prototype._isPageDisplayed = function (iIndex) {
		return this._aAllActivePagesIndexes.includes(iIndex);
	};

	/**
	 * Handler for F7 key
	 * @param {Object} oEvent - key object
	 * @private
	 */
	Carousel.prototype._handleF7Key = function (oEvent) {
		var oActivePageLastFocusedElement = this._getActivePageLastFocusedElement();

		if (this._isSlide(oEvent.target) && oActivePageLastFocusedElement) {
			oActivePageLastFocusedElement.focus();
		} else {
			this.getFocusDomRef().focus();
		}
	};

	Carousel.prototype._isSlide = function (oElement) {
		return oElement.id.endsWith("slide") && oElement.parentElement === this.getDomRef().querySelector(Carousel._INNER_SELECTOR);
	};

	Carousel.prototype._isPageIndicatorArrow = function (oElement) {
		return oElement.classList.contains("sapMCrslArrow");
	};

	Carousel.prototype._loops = function () {
		return this.getLoop() && this._getNumberOfItemsToShow() === 1;
	};

	/**
	 * @param {int} iIndex Page index
	 * @param {boolean} bPreventLoop Whether to prevent loop if index is out of range
	 * @returns {int} index in range of pages aggregation
	 */
	Carousel.prototype._makeInRange = function (iIndex, bPreventLoop) {
		var iPagesLength = this.getPages().length;
		var iIndexInRange = iIndex;
		var bLoops = this._loops();

		if (iIndex >= iPagesLength) {
			if (bLoops && !bPreventLoop) {
				iIndexInRange = 0;
			} else {
				iIndexInRange = iPagesLength - 1;
			}
		} else if (iIndex < 0) {
			if (bLoops && !bPreventLoop) {
				iIndexInRange = iPagesLength - 1;
			} else {
				iIndexInRange = 0;
			}
		}

		return iIndexInRange;
	};

	/**
	 * Searches for the parent page of the given child element
	 * @param {HTMLElement} oElement The child element
	 * @returns {sap.ui.core.Control} The page
	 */
	Carousel.prototype._getClosestPage = function (oElement) {
		return jQuery(oElement).closest(".sapMCrsPage").control(0);
	};

	//================================================================================
	// DEPRECATED METHODS
	//================================================================================

	/*
	 * API method to set whether the carousel should display the busy indicators.
	 * This property has been deprecated since 1.18.7. Does nothing and returns the carousel reference.
	 *
	 * @deprecated
	 * @public
	 */
	Carousel.prototype.setShowBusyIndicator = function() {
		Log.warning("sap.m.Carousel: Deprecated function 'setShowBusyIndicator' called. Does nothing.");
		return this;
	};

	/*
	 * API method to check whether the carousel should display the busy indicators.
	 * This property has been deprecated since 1.18.7. Always returns false,
	 *
	 * @deprecated
	 * @public
	 */
	Carousel.prototype.getShowBusyIndicator = function() {
		Log.warning("sap.m.Carousel: Deprecated function 'getShowBusyIndicator' called. Does nothing.");
		return false;
	};

	/*
	 * @see sap.ui.core.Control#setBusyIndicatorSize
	 * Original property was depracated so we removed it, but made it failsafe
	 * by mapping a 'wrong' input value to the new enum.
	 *
	 * @public
	 */
	Carousel.prototype.setBusyIndicatorSize = function(sSize) {
		if (!(sSize in BusyIndicatorSize)) {
			sSize = BusyIndicatorSize.Medium;
		}
		return Control.prototype.setBusyIndicatorSize.call(this, sSize);
	};

	return Carousel;
});
