// Import Playwright's 'test' and 'expect' functions.
// 'test' is used to define test cases, and 'expect' is used for assertions (checking conditions).
import { test, expect } from '@playwright/test'

// Import the NavigationPage class from the 'page-objects' folder.
// This allows us to use the methods defined in NavigationPage for easier navigation in tests.
import { NavigationPage } from '../page-objects/navigationPage'

// This hook runs before each test case.
// It ensures that the browser always starts from the homepage before running any test.
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/') // Open the application at the specified URL
})

// Define a test case named "navigate to form page".
// The 'async' keyword allows us to perform asynchronous actions like clicks and page loads.
test("navigate to form page", async ({ page }) => {
    // Create an instance of the NavigationPage class, passing the 'page' object to it.
    // This gives access to the navigation methods defined in the class.
    const navigateTo = new NavigationPage(page);

    // Call the formLayoutsPage() method to navigate to the Form Layouts page.
    // This method performs clicks on the "Forms" menu and "Form Layouts" submenu.
    await navigateTo.formLayoutsPage()
    await navigateTo.datepickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()
})
