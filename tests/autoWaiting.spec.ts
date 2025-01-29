import { test, expect } from "@playwright/test"

// This hook runs before each test, navigates to the page, and clicks the button triggering the AJAX request
test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax')  // Navigate to the page
    await page.getByText("Button Triggering AJAX Request").click()  // Click the button that triggers the AJAX request
})

test("auto waiting", async ({ page }) => {
  const successBtn = page.locator('.bg-success');

  // Wait for the text content of the element to load
  // allTextContents() executes without requiring the element to be visible - this can cause flakiness in tests
  // To ensure stability, prefer using waitFor() or expect with a timeout
  
  // Wait for the element to be attached to the DOM before interacting with it
  // await successBtn.waitFor({state: 'attached'});

  // Expect the success button to contain the text 'Data loaded with AJAX get request.'
  // ToHaveText() has a default timeout of 5 seconds but here we specify 20 seconds
  await expect(successBtn).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
})

test('alternative waits', async ({ page }) => {
    const successBtn = page.locator('.bg-success');

    // Wait for element to be visible in the DOM
    // await page.waitForSelector('.bg-success');

    // Wait for a particular network response
    // Inspect the network tab in dev tools to identify the API call and its status
    // Once identified, you can use waitForResponse() to wait for that specific API response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

    // Wait for network idle state (Not recommended for most cases but can be useful in specific situations)
    await page.waitForLoadState('networkidle');  // Wait for all network activity to stop

    // Retrieve the text contents of the success button
    const text = await successBtn.allTextContents();

    // Verify the success button contains the expected text
    expect(text).toContain('Data loaded with AJAX get request.');
})
