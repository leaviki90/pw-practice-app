import {test} from '../test-options'
import {faker} from '@faker-js/faker'


test('parametrized methods', async ({ pageManager}) => {
    const randomFullName = faker.person.fullName()  //can be customized
    //name always Jonh, lastname always different on example
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` //any num till 1000

   // await pm.navigateTo().formLayoutsPage()
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 2")
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)

})

