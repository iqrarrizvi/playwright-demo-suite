import test from "../Actions/Hooks.js";
import { expect } from '@playwright/test';
import ActionsHelper from "../Actions/ActionHelper.js";
import { ActionTypes, AssertionType } from "../Utils/actions.js";
import { inventoryPageLocators } from "../pageObjects/InventoryObjects.js";

test.describe("Inventory Regression", { tag: ['@regression'] }, () => {

  test("Products page displays 6 inventory items", async ({ page }) => {
    const items = page.locator(inventoryPageLocators.inventoryItems);
    await expect(items).toHaveCount(6);
  });

  test("Add item to cart updates cart badge to 1", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(AssertionType.DISPLAYED, inventoryPageLocators.cartBadge);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, inventoryPageLocators.cartBadge, "1");
  });

  test("Adding multiple items increments cart badge", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-bike-light"));
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, inventoryPageLocators.cartBadge, "2");
  });

  test("Remove item from cart clears cart badge", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(AssertionType.DISPLAYED, inventoryPageLocators.cartBadge);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.removeByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(AssertionType.NOTDISPLAYED, inventoryPageLocators.cartBadge);
  });

  test("Sort by Name Z to A shows Test.allTheThings() first", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.SETDROPDOWNVIAVALUE, inventoryPageLocators.sortDropdown, "za");
    const firstName = await page.locator(inventoryPageLocators.itemName).first().textContent();
    expect(firstName).toBe("Test.allTheThings() T-Shirt (Red)");
  });

  test("Sort by Price low to high shows cheapest item first", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.SETDROPDOWNVIAVALUE, inventoryPageLocators.sortDropdown, "lohi");
    const firstPrice = await page.locator(inventoryPageLocators.itemPrice).first().textContent();
    expect(firstPrice).toBe("$7.99");
  });

});
