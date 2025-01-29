import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    // Navigate to the base URL before each test
    await page.goto('http://localhost:4200/')
})

test.describe("Form Layouts page", () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the "Forms" section and select "Form Layouts" page
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })

    test("input fields", async ({ page }) => {
        // Locate the 'Using the Grid' card and find the 'Email' input field
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' })
            .getByRole('textbox', { name: "Email" })
        
        // Fill the email input with a test value
        await usingTheGridEmailInput.fill('test@test.com');
        // Clear the input (note: fill and clear cannot be chained together)
        await usingTheGridEmailInput.clear();
        
        // Simulate typing the email with a delay between keystrokes
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 }) 

        // Assertions to check that the input value is correct
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        // Additional assertions using locators
        expect(inputValue).toEqual('test2@test.com');
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test("radio buttons", async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })

        // Select the first radio button (Option 1)
        await usingTheGridForm.getByRole('radio', { name: 'option 1' }).check({ force: true });

        // Check if Option 1 is selected
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'option 1' }).isChecked();
        expect(radioStatus).toBeTruthy(); // Assert that it is checked

        // Ensure the radio button is actually checked
        await expect(usingTheGridForm.getByRole('radio', { name: 'option 1' })).toBeChecked()

        // Select the second radio button (Option 2)
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        // Assert that Option 1 is no longer checked and Option 2 is now checked
        expect(await usingTheGridForm.getByRole('radio', { name: 'option 1' }).isChecked()).toBeFalsy();
        expect(await usingTheGridForm.getByRole('radio', { name: 'option 2' }).isChecked()).toBeTruthy();
    })

})

test("checkboxes", async ({ page }) => {
    // Navigate to the 'Modal & Overlays' section and select 'Toastr'
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()

    // Uncheck the 'Hide on click' checkbox
    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
    
    // Difference between 'check' and 'click' methods:
    // - 'check' does nothing if already checked, while 'click' will toggle the state regardless of its current state.
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });

    // Locate all checkboxes on the page
    const allBoxes = page.getByRole('checkbox')

    // Iterate through all checkboxes and check them
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        // Assert that each checkbox is checked
        expect(await box.isChecked()).toBeTruthy()
    }
})
