import { test, expect } from '@playwright/test';
import ActionsHelper from "../Actions/ActionHelper.js";
import { ActionTypes, AssertionType } from "../Utils/actions.js";
import { loginPageLocators } from "../pageObjects/LoginObjects.js";
import { AppConfig } from "../config.js";

test.describe("Login Regression", { tag: ['@regression'] }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(AppConfig.BaseURL);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(loginPageLocators.usernameInput, { state: 'visible', timeout: 15000 });
  });

  test("Valid credentials redirect to products page", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.usernameInput, AppConfig.UserName);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.passwordInput, AppConfig.Password);
    await actionHelper.actionMethod(ActionTypes.CLICK, loginPageLocators.signInButton);
    await expect(page).toHaveURL(/inventory/, { timeout: 15000 });
  });

  test("Invalid password shows error message", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.usernameInput, "standard_user");
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.passwordInput, "wrong_password");
    await actionHelper.actionMethod(ActionTypes.CLICK, loginPageLocators.signInButton);
    await actionHelper.actionMethod(AssertionType.DISPLAYED, loginPageLocators.errorMessage);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, loginPageLocators.errorMessage, "Username and password do not match");
  });

  test("Locked out user sees access denied message", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.usernameInput, "locked_out_user");
    await actionHelper.actionMethod(ActionTypes.SETTEXT, loginPageLocators.passwordInput, AppConfig.Password);
    await actionHelper.actionMethod(ActionTypes.CLICK, loginPageLocators.signInButton);
    await actionHelper.actionMethod(AssertionType.DISPLAYED, loginPageLocators.errorMessage);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, loginPageLocators.errorMessage, "Sorry, this user has been locked out");
  });

  test("Empty credentials show username required error", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, loginPageLocators.signInButton);
    await actionHelper.actionMethod(AssertionType.DISPLAYED, loginPageLocators.errorMessage);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, loginPageLocators.errorMessage, "Username is required");
  });

});
