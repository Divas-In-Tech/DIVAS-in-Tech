import { test, expect } from '@playwright/test';

test.describe('Calendar', () => {
    test("Add event button is hidden when not logged in", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Calendar" }).click();
    });

    test("Able to see and click add event button when signed in", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Login" }).click();

        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();

        await page.getByLabel("Email").fill("test@example.com");
        await page.getByLabel("Password").fill("password123");
        await page.getByRole("button", { name: "Login" }).click();

        await page.getByRole("button", { name: "Calendar" }).click();

        await page.getByRole("button", { name: "Calendar" }).click();
        await page.getByRole("button", { name: "Add Event" }).click();
    });


    test("Able add event", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Login" }).click();

        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();

        await page.getByLabel("Email").fill("test@example.com");
        await page.getByLabel("Password").fill("password123");
        await page.getByRole("button", { name: "Login" }).click();

        await page.getByRole("button", { name: "Calendar" }).click();

        await page.getByRole("button", { name: "Calendar" }).click();
        await page.getByRole("button", { name: "Add Event" }).click();

        await page.getByPlaceholder("Enter event title").fill("testing");
        await page.getByPlaceholder("e.g., 9:00 AM - 2:00 PM").fill("1 AM - 3 AM");
        await page.getByPlaceholder("Enter event description").fill("testing event desc");

        await page.selectOption("#type", "meeting");
        await expect(page.locator("#type")).toHaveValue("meeting");

        await page.getByRole("button", { name: "Add Event" }).click();
    });
});