//import test method from playwright library
import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
})

test("Locator syntax rules", async ({ page }) => {
    page.locator('input'); //by tag name
    page.locator('#inputEmail1'); //by ID
    page.locator('.shape-rectangle'); //by Class
    page.locator('[placeholder="Email"]');  //by attribute
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');   //by class value
    page.locator('input[placeholder="Email"][nbinput]') //combination - bez razmaka se pišu
    page.locator('//*[@id="inputEmail1"]'); //by Xpath - not recommended
    page.locator(':text("Using")') //by partial text match
    page.locator(':text-is("Using the Grid")') //by exact text match

})


test("User-facing locators", async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().click(); //67 roles - vidi PW dokumentaciju 
    await page.getByRole('button', { name: "Sign in" }).first().click();
    await page.getByLabel('Email').first().click();
    await page.getByPlaceholder('Jane Doe').click();
    await page.getByText('Using the Grid').click();
    await page.getByTitle('IoT Dashboard').click();
    //await page.getByTestId('').click(); //kad nam dev obezbedi sopstvene lokatore ili mi napravimo
    // to su data-something lokatori, dobri za pouzdanost koda, ne bas za user-facing
})

test("Child element", async ({ page }) => {
    //await page.locator('nb-card nb-radio').filter({ hasText: "Option 1" }).click();
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()

    await page.locator('nb-card').locator("nb-radio").locator(":text-is('Option 2')").click()

    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click();   //not recommended, index starts from 0
});


test("Parent element", async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click();
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click();
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click();
    //filter is a independent method
    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" }).getByRole('textbox', { name: "Email" }).click();
    //not recommended
    await page.locator(':text-is("Using the Grid")').locator("..").getByRole('textbox', { name: "Email" }).click();
});

test("Reusing selectors", async ({ page }) => {
    //zajednicki deo je izvucen u konstantu
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })

    //a jos naprednije
    const emailField = basicForm.getByRole('textbox', { name: "Email" })
    const passField = basicForm.getByRole('textbox', { name: "Password" })

    //tadaaaam
    await emailField.fill('test@test@com');
    await passField.fill('welcome123');
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    //Asertacija
    await expect(emailField).toHaveValue('test@test@com');

});


test("Extracting values", async ({ page }) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent(); //sa ovim uzimamo text iz elementa
    expect(buttonText).toEqual('Submit');

    //all text values

    const allRadioButnsLabels = await page.locator('nb-radio').allTextContents()
    //ovaj metod sav text stavlja u array
    expect(allRadioButnsLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', { name: "Email" })
    await emailField.fill("test@test.com")
    const emailValue = await emailField.inputValue(); //sa ovim izvlacimo value iz inputa
    expect(emailValue).toEqual("test@test.com")

    //attribute value
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
});

test("Assertions", async ({ page }) => {
    const basicFormBtn = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')

    //general assertions, nemaju timeout
    const value = 5;
    expect(value).toEqual(5)

    const btnText = await basicFormBtn.textContent()
    expect(btnText).toEqual('Submit')

    //locator assertions, imaju timeout (5secs)
    await expect(basicFormBtn).toHaveText('Submit')

    //soft assertions - kad test treba da se nastavi iako je asertacija pala
    //znaci button ce biti kliknut iako je asertacija pala
    //not good practice
    await expect.soft(basicFormBtn).toHaveText('Submit')
    await basicFormBtn.click()

});