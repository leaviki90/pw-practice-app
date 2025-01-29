import { test, expect } from "@playwright/test"


test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
})


test.describe("Form Layoouts page", () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })

    test("input fields", async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'})
        .getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();  //clear and fill cannot be chained
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) //simulate key stroke on kb
       

        //generic assetions
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertions
        expect(inputValue).toEqual('test2@test.com');
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test("radio buttons", async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })

        //Option 1 label

        //await usingTheGridForm.getByLabel('Option 1').check({force: true}) //for radio buttons

        await usingTheGridForm.getByRole('radio', { name: 'option 1' }).check({ force: true });


        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'option 1' }).isChecked();
        //vraca true ili false

        expect(radioStatus).toBeTruthy();

        await expect(usingTheGridForm.getByRole('radio', { name: 'option 1' })).toBeChecked()


        //Option 2 label
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        expect(await usingTheGridForm.getByRole('radio', { name: 'option 1' }).isChecked()).toBeFalsy();
        expect(await usingTheGridForm.getByRole('radio', { name: 'option 2' }).isChecked()).toBeTruthy();

    })

})


test("checkboxes", async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
    //difference between check and click - ako je chekirano i idemo na check - nista se ne desava
    //a ako idemo na click, ono ce klikne bez obzira dal je ili nije checkirano
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });

    const allBoxes = page.getByRole('checkbox')

    //method all() pretvara u array

    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }
})