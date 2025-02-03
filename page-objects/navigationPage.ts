import { Page } from '@playwright/test'

// Define a class named NavigationPage.
// By convention, class names start with an uppercase letter.
export class NavigationPage {

    // Declare a readonly property 'page' of type Page.
    // 'readonly' means it can only be assigned once (in the constructor).
    readonly page: Page

    // The constructor is called automatically when creating a new instance of the class.
    // It takes 'page' as a parameter, which represents the browser page in Playwright.
    constructor(page: Page) {
        this.page = page  // Assign the passed 'page' to the class property 'this.page'.
    }

    // This is an asynchronous function that navigates to the Form Layouts page.
    // 'async' means the function can perform asynchronous operations like waiting for elements to load.
    async formLayoutsPage() {
        // Click on the "Forms" menu item. It finds the element based on the visible text "Forms".
        await this.selectGroupMenuItem('Forms')

        // Click on the "Form Layouts" submenu item that appears after clicking "Forms".
        await this.page.getByText("Form Layouts").click()
    }

    async datepickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click();
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click();
    }

    async toastrPage() {
        await this.selectGroupMenuItem("Modal & Overlays")
        await this.page.getByText("Toastr").click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem("Modal & Overlays")
        await this.page.getByText('Tooltip').click();
    }


    private async selectGroupMenuItem(groupItemTitle: string) { //private because it will be used only here
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false') {
            await groupMenuItem.click()
        }
    }

}
