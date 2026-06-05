import { test, expect } from "@playwright/test"; /*this line is from AI*/

test.afterAll(async ({ request }) => {
    await request.post(
      "http://localhost:3000/account/remove-account", /*URL from AI*/
        {
            data: {
                username: "e2e-test-account"
            }
        }
    );
});

test("User can create new account", async ({ page }) => {
    
    await page.goto("http://localhost:5173/"); /*this line from AI*/
  
    await page.getByPlaceholder("Username").fill("e2e-test-account");

    await page.getByPlaceholder("Password").fill("Jackson");
    
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Account created! Try logging in.")).toBeVisible();
    

});

test("User can login", async ({ page }) => {
    
    await page.goto("http://localhost:5173/"); /*this line from AI*/
    
    await page.getByPlaceholder("Username").fill("e2e-test-account");
    
    await page.getByPlaceholder("Password").fill("Jackson");
   
    await page.getByRole("button", { name: "Login", exact: true }).click();
    
    await expect(page.getByText("Logout")).toBeVisible();
});