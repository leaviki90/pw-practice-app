import { test, expect } from '@playwright/test'

import { PageManager } from '../page-objects/pageManager'

import {faker} from '@faker-js/faker'


test.beforeEach(async ({ page }) => {
    await page.goto('/') // Open the application at the specified URL
})


test("navigate to form page @smoke", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @regression', async ({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()  //can be customized
    //name always Jonh, lastname always different on example
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` //any num till 1000

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 2")
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    // await pm.navigateTo().datepickerPage()
    // await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
    // await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)
})

