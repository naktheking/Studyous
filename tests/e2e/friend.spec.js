import { test, expect } from "@playwright/test"; /*this line is from AI*/

test.afterAll(async ({ request }) => {
    await request.post(
      "http://localhost:3000/account/remove-account", /*URL from AI*/
        {
            data: {
                username: "e2e-test-friendsend"
            }
        }
    );
    await request.post(
      "http://localhost:3000/account/remove-account", /*URL from AI*/
        {
            data: {
                username: "e2e-test-friendacc"
            }
        }
    );
    await request.post(
      "http://localhost:3000/account/remove-account", /*URL from AI*/
        {
            data: {
                username: "e2e-test-friendrej"
            }
        }
    );
});

test("Creating friend request accepter account", async ({ page }) => { 

   await page.goto("http://localhost:5173/"); /*this line from AI*/

    //Create accepter account
    await page.getByPlaceholder("Username").fill("e2e-test-friendacc");

    await page.getByPlaceholder("Password").fill("Jackson");
    
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Account created! Try logging in.")).toBeVisible();
});

test("Creating friend request rejecter account", async ({ page }) => { 

    await page.goto("http://localhost:5173/"); /*this line from AI*/

    //Create rejecter account
    await page.getByPlaceholder("Username").fill("e2e-test-friendrej");

    await page.getByPlaceholder("Password").fill("Jackson");
    
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Account created! Try logging in.")).toBeVisible();
});

test("User can send a friend request", async ({ page }) => {
    
    await page.goto("http://localhost:5173/"); /*this line from AI*/
  
    //Create sender account
    await page.getByPlaceholder("Username").fill("e2e-test-friendsend");

    await page.getByPlaceholder("Password").fill("Jackson");
    
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Account created! Try logging in.")).toBeVisible();
    
    //Login sender account
    await page.getByPlaceholder("Username").fill("e2e-test-friendsend");
    
    await page.getByPlaceholder("Password").fill("Jackson");
   
    await page.getByRole("button", { name: "Login", exact: true }).click();
    
    await expect(page.getByText("Logout")).toBeVisible();

    //Send friend request to accepter
    await page.getByRole("button", { name: "Toggle friends panel", exact: true }).click();

    await page.getByPlaceholder("username").fill("e2e-test-friendacc");

    await page.getByRole("button", { name: "Send", exact: true }).click();

    await expect(page.getByText("Friend request sent")).toBeVisible();

    //Send friend request to rejecter
    await page.getByPlaceholder("username").fill("e2e-test-friendrej");

    await page.getByRole("button", { name: "Send", exact: true }).click();

    await expect(page.getByText("Friend request sent")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();

});

test("Friend Request Accepter: Log in and accept friend request", async ({ page }) => { 

    await page.goto("http://localhost:5173/"); /*this line from AI*/

    //Login to accepter account
    await page.getByPlaceholder("Username").fill("e2e-test-friendacc");

    await page.getByPlaceholder("Password").fill("Jackson");
    
    await page.getByRole("button", { name: "Login", exact: true }).click();
    
    await expect(page.getByText("Logout")).toBeVisible();

    //Accept incoming friend request
    await page.getByRole("button", { name: "Toggle friends panel", exact: true }).click(); 

    await page.getByRole("button", { name: "✓", exact: true }).click(); 

    await expect(page.getByText("No incoming requests")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
});

test("Friend Request Rejecter: Log in and reject friend request", async ({ page }) => { 

    await page.goto("http://localhost:5173/"); /*this line from AI*/

    //Login to rejecter account
    await page.getByPlaceholder("Username").fill("e2e-test-friendrej");

    await page.getByPlaceholder("Password").fill("Jackson");
    
    await page.getByRole("button", { name: "Login", exact: true }).click();
    
    await expect(page.getByText("Logout")).toBeVisible();

    //Reject incoming friend request
    await page.getByRole("button", { name: "Toggle friends panel", exact: true }).click();

    await page.getByRole("button", { name: "✕", exact: true }).click(); 

    await expect(page.getByText("No incoming requests")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
});