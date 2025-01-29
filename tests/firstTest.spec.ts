// Import test methods from Playwright library
import { test, expect } from "@playwright/test"

// Runs before each test, navigates to the page and clicks through some menu options
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');  // Navigate to the base URL
    await page.getByText("Forms").click();  // Click on the 'Forms' menu option
    await page.getByText("Form Layouts").click();  // Click on the 'Form Layouts' submenu option
})

test("Locator syntax rules", async ({ page }) => {
    // Locating elements by different methods
    page.locator('input');  // By tag name
    page.locator('#inputEmail1');  // By ID
    page.locator('.shape-rectangle');  // By class
    page.locator('[placeholder="Email"]');  // By attribute
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');  // By class value
    page.locator('input[placeholder="Email"][nbinput]');  // Combination of attributes (no spaces)
    page.locator('//*[@id="inputEmail1"]');  // By XPath (not recommended)
    page.locator(':text("Using")');  // By partial text match
    page.locator(':text-is("Using the Grid")');  // By exact text match
})

test("User-facing locators", async ({ page }) => {
    // Locating elements using user-facing roles and labels
    await page.getByRole('textbox', { name: "Email" }).first().click();  // Find the first textbox with the label 'Email'
    await page.getByRole('button', { name: "Sign in" }).first().click();  // Click on the 'Sign in' button
    await page.getByLabel('Email').first().click();  // Find the first element with the label 'Email'
    await page.getByPlaceholder('Jane Doe').click();  // Click on an input field with placeholder 'Jane Doe'
    await page.getByText('Using the Grid').click();  // Click on the text 'Using the Grid'
    await page.getByTitle('IoT Dashboard').click();  // Click on an element with the title 'IoT Dashboard'
    // await page.getByTestId('').click(); // When dev provides custom locators (data-something attributes)
})

test("Child element", async ({ page }) => {
    // Locating a child element within a parent
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();  // Click on 'Option 1' inside 'nb-card' element

    await page.locator('nb-card').locator("nb-radio").locator(":text-is('Option 2')").click();  // Alternative method to click 'Option 2'

    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click();  // Click 'Sign in' button inside 'nb-card'

    await page.locator('nb-card').nth(3).getByRole('button').click();  // Click button inside the fourth 'nb-card' (not recommended, index starts from 0)
});

test("Parent element", async ({ page }) => {
    // Locating elements based on their parent content
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click();
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click();
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click();
    // filter() is an independent method that can be combined with other locators
    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" }).getByRole('textbox', { name: "Email" }).click();
    // Not recommended to use complex filter chains like this
    await page.locator(':text-is("Using the Grid")').locator("..").getByRole('textbox', { name: "Email" }).click();
});

test("Reusing selectors", async ({ page }) => {
    // Extract common part of the locator into a constant
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });

    // Further break down locators into smaller parts for reuse
    const emailField = basicForm.getByRole('textbox', { name: "Email" });
    const passField = basicForm.getByRole('textbox', { name: "Password" });

    // Interact with the elements using the extracted locators
    await emailField.fill('test@test.com');
    await passField.fill('welcome123');
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    // Assertion to check if the email field contains the expected value
    await expect(emailField).toHaveValue('test@test.com');
});

test("Extracting values", async ({ page }) => {
    // Extracting the text value of a button
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const buttonText = await basicForm.locator('button').textContent();  // Get text from the button
    expect(buttonText).toEqual('Submit');  // Verify the button text

    // Extracting text from all radio buttons
    const allRadioBtnsLabels = await page.locator('nb-radio').allTextContents();  // Get all text contents from radio buttons
    expect(allRadioBtnsLabels).toContain('Option 1');  // Check if 'Option 1' is among the labels

    // Extracting the value from an input field
    const emailField = basicForm.getByRole('textbox', { name: "Email" });
    await emailField.fill("test@test.com");
    const emailValue = await emailField.inputValue();  // Get value from input field
    expect(emailValue).toEqual("test@test.com");

    // Extracting an attribute value
    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');  // Verify the placeholder value
});

test("Assertions", async ({ page }) => {
    const basicFormBtn = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button');

    // General assertions (without timeout)
    const value = 5;
    expect(value).toEqual(5);  // Verify the value is equal to 5

    const btnText = await basicFormBtn.textContent();  // Get the button text
    expect(btnText).toEqual('Submit');  // Verify the button text

    // Locator assertions (with timeout of 5 seconds)
    await expect(basicFormBtn).toHaveText('Submit');  // Check if the button text is 'Submit'

    // Soft assertions (test continues even if assertion fails)
    // Not a good practice, but can be useful in some cases
    await expect.soft(basicFormBtn).toHaveText('Submit');
    await basicFormBtn.click();  // Proceed with clicking the button even if the assertion failed
});
