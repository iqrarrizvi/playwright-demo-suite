import ActionsHelper from "../Actions/ActionHelper.js";
import { loginPageLocators } from "../pageObjects/LoginObjects.js";
import { ActionTypes } from "../Utils/actions.js";
import { expect } from "@playwright/test";
import { AppConfig } from "../config.js";

export default new class Login {
  /**
   * Logs in with the given username and password.
   * Defaults to AppConfig credentials if not provided.
   */
  async login(page, username = null, password = null) {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.NAVIGATETOURL, null, AppConfig.BaseURL);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(loginPageLocators.usernameInput, {
      state: 'visible',
      timeout: 30000
    });
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.usernameInput, username || AppConfig.UserName);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.passwordInput, password || AppConfig.Password);
    await actionHelper.actionMethod(ActionTypes.CLICK, loginPageLocators.signInButton);
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/inventory/, { timeout: 15000 });
  }

  /**
   * Logs in with a secondary user account.
   */
  async loginSecondUser(page) {
    await this.login(page, AppConfig.SecondUserName, AppConfig.SecondUserPassword);
  }
}
