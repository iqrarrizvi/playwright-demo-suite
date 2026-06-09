export const cartPageLocators = {
    pageHeading: ".title",
    cartItems: ".cart_item",
    cartItemName: ".inventory-item-name",
    cartItemPrice: ".inventory-item-price",
    checkoutButton: "[data-test='checkout']",
    continueShoppingButton: "[data-test='continue-shopping']",
    removeButton: (slug) => `[data-test='remove-${slug}']`,
};
