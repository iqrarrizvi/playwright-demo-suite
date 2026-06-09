import { ActionTypes, AssertionType } from '../Utils/actions.js';
import WebActions from '../Utils/WebActions.js';

/**
 * Central dispatcher — maps ActionTypes/AssertionType constants to the
 * corresponding WebActions method. Tests call this instead of touching
 * WebActions directly, keeping test code uniform.
 *
 * Usage: await actionHelper.actionMethod(ActionTypes.CLICK, selector)
 *        await actionHelper.actionMethod(AssertionType.DISPLAYED, selector)
 */
export default class ActionsHelper {
  #web;

  constructor(page) {
    this.#web = new WebActions(page);
  }

  async actionMethod(type, locator, data, ...frames) {
    switch (type) {

      // ── Interactions ───────────────────────────────────────────────────
      case ActionTypes.NAVIGATETOURL:
        return this.#web.navigateToURL(data);

      case ActionTypes.CLICK:
        return this.#web.clickElement(locator, frames);

      case ActionTypes.CLICKVIAJS:
        return this.#web.clickElementJS(locator, frames);

      case ActionTypes.DOUBLECLICK:
        return this.#web.doubleClickElement(locator, frames);

      case ActionTypes.SETTEXT:
        return this.#web.enterElementText(locator, data, frames);

      case ActionTypes.PRESS:
        return this.#web.keyPress(locator, data, frames);

      case ActionTypes.CHECK:
        return this.#web.checkElement(locator, frames);

      case ActionTypes.UNCHECK:
        return this.#web.unCheckElement(locator, frames);

      case ActionTypes.HOVER:
        return this.#web.hoverOver(locator, frames);

      case ActionTypes.HOVER_FORCE:
        return this.#web.hoverOverForced(locator, frames);

      case ActionTypes.SETDROPDOWN:
        return this.#web.selectOptionFromDropdown(locator, data, frames);

      case ActionTypes.SETDROPDOWNVIAVALUE:
        return this.#web.selectOptionFromDropdownViaValue(locator, data, frames);

      case ActionTypes.UPLOADFILE:
        return this.#web.uploadFile(locator, data, frames);

      case ActionTypes.SETATTRIBUTE:
        return this.#web.setAttribute(locator, frames.shift(), data, frames);

      case ActionTypes.GETTEXT:
        return this.#web.getTextContents(locator, frames);

      case ActionTypes.RETURNELEMENT:
        return this.#web.getElement(locator, frames);

      // ── Assertions ─────────────────────────────────────────────────────
      case AssertionType.EQUALCHECK:
        return this.#web.verifyElementText(locator, data, frames);

      case AssertionType.CONTAINTEXT:
        return this.#web.verifyElementContainsText(locator, data, frames);

      case AssertionType.DISPLAYED:
        return this.#web.verifyElementIsDisplayed(locator, frames);

      case AssertionType.NOTDISPLAYED:
        return this.#web.verifyElementIsNotDisplayed(locator, frames);

      case AssertionType.ENABLED:
        return this.#web.verifyElementIsEnabled(locator, frames);

      case AssertionType.DISABLED:
        return this.#web.verifyElementIsDisabled(locator, frames);

      case AssertionType.ISHIDDEN:
        return this.#web.verifyElementIsHidden(locator, frames);

      case AssertionType.NOTEXIST:
        return this.#web.verifyElementNotExist(locator, frames);

      case AssertionType.TABLEDATAEXISTS:
        return this.#web.verifyTableDataExists(locator, frames);

      case AssertionType.PROPERTYCHECK:
        return this.#web.verifyElementAttribute(locator, frames.shift(), data, frames);

      case AssertionType.ATTRIBUTENOTEXIST:
        return this.#web.verifyElementAttributeNotExist(locator, data, frames);

      case AssertionType.VERIFYHAVECLASS:
        return this.#web.verifyHaveClass(locator, data, frames);

      case AssertionType.VERIFYHAVECLASSPATTERN:
        return this.#web.verifyHaveClassPattern(locator, data, frames);

      case AssertionType.VERIFYELEMENTCHECKED:
        return this.#web.verifyElementIsChecked(locator, frames);

      case AssertionType.VERIFYELEMENTNOTCHECKED:
        return this.#web.verifyElementNotChecked(locator, frames);

      case AssertionType.POPULATED:
        return this.#web.verifyElementPopulated(locator, frames);

      case AssertionType.INBETWEEN:
        return this.#web.verifyDateInBetween(locator, data?.from, data?.to, frames);

      default:
        throw new Error(`Unknown action type: "${type}"`);
    }
  }
}
