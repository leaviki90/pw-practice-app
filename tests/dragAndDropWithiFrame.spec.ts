import { test, expect } from "@playwright/test";

// Test case for drag & drop functionality
test("drag & drop", async ({ page }) => {
    // Navigate to the demo page
    await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

    // Locate the iframe that contains the draggable elements
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

    // Perform drag and drop using the built-in method
    await frame.locator("li", { hasText: "High Tatras 2" }).dragTo(frame.locator("#trash"));

    // More precise drag and drop using mouse actions
    await frame.locator("li", { hasText: "High Tatras 4" }).hover(); // Hover over the element
    await page.mouse.down(); // Click and hold the element
    await frame.locator("#trash").hover(); // Move the element to the target location
    await page.mouse.up(); // Release the mouse button

    // Assertions to verify that the elements were successfully moved to the trash
    await expect(frame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"]);
});
