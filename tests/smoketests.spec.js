import test from "../Actions/Hooks.js";
import { expect } from '@playwright/test';
import ActionsHelper from "../Actions/ActionHelper.js";
import { ActionTypes, AssertionType } from "../Utils/actions.js";
import { inventoryPageLocators } from "../pageObjects/InventoryObjects.js";

test.describe("Smoke Tests", { tag: ['@smoke'] }, () => {

  test("Login lands on products page", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(AssertionType.DISPLAYED, inventoryPageLocators.pageHeading);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, inventoryPageLocators.pageHeading, "Products");
  });

  test("Products page shows inventory items", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(AssertionType.TABLEDATAEXISTS, inventoryPageLocators.inventoryItems);
  });

  test("Logout redirects to login page", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.burgerMenu);
    await page.waitForSelector(inventoryPageLocators.logoutLink, { state: 'visible', timeout: 5000 });
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.logoutLink);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/, { timeout: 10000 });
  });

});
