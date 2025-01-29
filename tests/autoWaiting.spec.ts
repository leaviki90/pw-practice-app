import { test, expect } from "@playwright/test"


test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText("Button Triggering AJAX Request").click()
})

test("auto waiting", async ({page})=> {
  const successBtn = page.locator('.bg-success');
  //await successBtn.click();

  //const text = await successBtn.allTextContents();
  //allTextContents() se izvrsava bez da element bude vidljiv  - moze izazvati fleakiness
  //await successBtn.waitFor({state: 'attached'})
  //const text = await successBtn.allTextContents();
  
  //expect(text).toContain('Data loaded with AJAX get request.');

  //ToHaveText() ima timeout 5secs
 await expect(successBtn).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});

})


test('alternative waits', async ({page})=> {
    const successBtn = page.locator('.bg-success');
    //____wait for element
    //await page.waitForSelector('.bg-success');

    //___wait for particular response
    //Inspect - Network - API call - its status
    //Header API call-a needed for waitForResponse() - klikne se na api call
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')


    //___wait for network calls to be completed ('Not recommended - but sometimes useful')
    await page.waitForLoadState('networkidle'); //
    const text = await successBtn.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.');
})