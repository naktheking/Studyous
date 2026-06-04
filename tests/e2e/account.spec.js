import { test, expect } from "@playwright/test"; //Include in AI Report?

//CLEANUP: MAYBE????? AI

test.afterAll(async ({ request }) => {
    await request.post(
      "http://localhost:3000/account/remove-account",
        {
            data: {
                username: "e2e-test-account"
            }
        }
    );
});

test("User can create new account", async ({ page }) => {
    
    await page.goto("http://localhost:5173/"); //Include in AI Report?

    await page.getByPlaceholder("Username").fill("e2e-test-account");

    await page.getByPlaceholder("Password").fill("Jackson");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Account created! Try logging in.")).toBeVisible();
});

test("User can login", async ({ page }) => {
    
    await page.goto("http://localhost:5173/"); //Include in AI Report?

    await page.getByPlaceholder("Username").fill("e2e-test-account");

    await page.getByPlaceholder("Password").fill("Jackson");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Logout")).toBeVisible();
});