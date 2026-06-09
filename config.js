
/**
 * Application Configuration
 *
 * Reads from environment variables with sensible defaults for the public demo app.
 * For local overrides, copy .env.example to .env and set values there.
 */
export const AppConfig = {
  get BaseURL() {
    return process.env.BASE_URL || "https://www.saucedemo.com";
  },

  get UserName() {
    return process.env.TEST_USERNAME || "standard_user";
  },

  get Password() {
    return process.env.TEST_PASSWORD || "secret_sauce";
  },

  get SecondUserName() {
    return process.env.TEST_SECOND_USERNAME || "standard_user";
  },

  get SecondUserPassword() {
    return process.env.TEST_SECOND_PASSWORD || "secret_sauce";
  },
};
