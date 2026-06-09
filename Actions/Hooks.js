import { test } from "@playwright/test";
import Login from "../Helper/Login.js";

test.beforeEach(async ({ page }) => {
  await Login.login(page);
});

export default test;
