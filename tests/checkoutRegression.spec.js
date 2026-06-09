import test from "../Actions/Hooks.js";
import ActionsHelper from "../Actions/ActionHelper.js";
import { ActionTypes, AssertionType } from "../Utils/actions.js";
import { inventoryPageLocators } from "../pageObjects/InventoryObjects.js";
import { cartPageLocators } from "../pageObjects/CartObjects.js";
import { checkoutPageLocators } from "../pageObjects/CheckoutObjects.js";
import testData from "../Utils/testData.js";

test.describe("Checkout Regression", { tag: ['@regression'] }, () => {

  test("Complete end-to-end checkout flow", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);

    // Add item to cart
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(AssertionType.DISPLAYED, inventoryPageLocators.cartBadge);

    // Go to cart
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.cartLink);
    await page.waitForURL(/cart/, { timeout: 10000 });
    await actionHelper.actionMethod(AssertionType.TABLEDATAEXISTS, cartPageLocators.cartItems);

    // Proceed to checkout
    await actionHelper.actionMethod(ActionTypes.CLICK, cartPageLocators.checkoutButton);
    await page.waitForURL(/checkout-step-one/, { timeout: 10000 });

    // Fill checkout info
    await actionHelper.actionMethod(ActionTypes.SETTEXT, checkoutPageLocators.firstNameInput, testData.checkout.firstName);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, checkoutPageLocators.lastNameInput, testData.checkout.lastName);
    await actionHelper.actionMethod(ActionTypes.SETTEXT, checkoutPageLocators.postalCodeInput, testData.checkout.postalCode);
    await actionHelper.actionMethod(ActionTypes.CLICK, checkoutPageLocators.continueButton);
    await page.waitForURL(/checkout-step-two/, { timeout: 10000 });

    // Confirm order summary is displayed
    await actionHelper.actionMethod(AssertionType.DISPLAYED, checkoutPageLocators.summaryTotal);

    // Finish order
    await actionHelper.actionMethod(ActionTypes.CLICK, checkoutPageLocators.finishButton);
    await page.waitForURL(/checkout-complete/, { timeout: 10000 });

    // Verify completion message
    await actionHelper.actionMethod(AssertionType.DISPLAYED, checkoutPageLocators.completeHeader);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, checkoutPageLocators.completeHeader, "Thank you for your order!");
  });

  test("Checkout form requires First Name", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.cartLink);
    await page.waitForURL(/cart/, { timeout: 10000 });
    await actionHelper.actionMethod(ActionTypes.CLICK, cartPageLocators.checkoutButton);
    await page.waitForURL(/checkout-step-one/, { timeout: 10000 });

    // Submit without filling any fields
    await actionHelper.actionMethod(ActionTypes.CLICK, checkoutPageLocators.continueButton);
    await actionHelper.actionMethod(AssertionType.DISPLAYED, checkoutPageLocators.errorMessage);
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, checkoutPageLocators.errorMessage, "First Name is required");
  });

  test("Cart contents persist when navigating back from checkout", async ({ page }) => {
    const actionHelper = new ActionsHelper(page);
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.addToCartByName("sauce-labs-backpack"));
    await actionHelper.actionMethod(ActionTypes.CLICK, inventoryPageLocators.cartLink);
    await page.waitForURL(/cart/, { timeout: 10000 });

    // Go back to shopping
    await actionHelper.actionMethod(ActionTypes.CLICK, cartPageLocators.continueShoppingButton);
    await page.waitForURL(/inventory/, { timeout: 10000 });

    // Cart badge should still show 1
    await actionHelper.actionMethod(AssertionType.CONTAINTEXT, inventoryPageLocators.cartBadge, "1");
  });

});
