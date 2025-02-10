import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    // Navigate to the base URL before each test
    await page.goto('/')
})

test.describe.only("Form Layouts page", () => {
    test.describe.configure({retries: 2})
    test.beforeEach(async ({ page }) => {
        // Navigate to the "Forms" section and select "Form Layouts" page
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })

    test("input fields", async ({ page }, testInfo) => {

        if(testInfo.retry){
            //do something
        }
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
        expect(inputValue).toEqual('test2@test.com1');

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


test('lists and dropdowns', async ({ page }) => {
    // Locate and click on the dropdown menu
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    // Locate the list and list items (if necessary)
    page.getByRole('list'); // For UL elements
    page.getByRole('listitem'); // For LI elements

    // Locate the dropdown options
    const optionList = page.locator('nb-option-list nb-option');

    // Verify that the dropdown contains the expected themes
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    
    // Select the "Cosmic" theme
    await optionList.filter({ hasText: "Cosmic" }).click();

    // Verify the header background color changes accordingly
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    // Define expected background colors for each theme
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    // Iterate through each theme and validate background color
    await dropDownMenu.click();
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        
        // Click the dropdown again unless it's the last option
        if (color !== "Corporate") {
            await dropDownMenu.click();
        }
    }
});


test('tooltips', async ({ page }) => {
    // Navigate to the Tooltip section
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    // Locate the card containing tooltips
    const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
    
    // Hover over the "Top" button to trigger the tooltip
    await toolTipCard.getByRole('button', { name: "Top" }).hover();

    // Verify the tooltip appears and contains the correct text
    page.getByRole('tooltip'); // Works if the tooltip role is properly set in the browser
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
});


test('dialog boxes', async ({ page }) => {
    // Navigate to the Smart Table section
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // Handle the confirmation dialog that appears on delete
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept(); // Confirm deletion
    });

    // Click the delete button for the row containing "mdo@gmail.com"
    await page.getByRole('table')
        .locator('tr', { hasText: "mdo@gmail.com" })
        .locator('.nb-trash')
        .click();
    
    // Verify that the row is no longer present in the table
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});

test('web tables', async ({ page }) => {
    // Navigate to the Smart Table section
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // Locate the row containing a specific email and edit the age field
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" });
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('35');
    await page.locator('.nb-checkmark').click();

    // Locate a row based on a specific column value and edit the email field
    await page.locator('.ng2-smart-pagination-nav li').getByText("2").click();
    const targetRowById = page.getByRole('row', { name: "11" }).filter({
        has: page.locator('td').nth(1).getByText('11')
    });
    await targetRowById.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');

    // Test the table filter functionality
    const ages = ["20", "30", "40", "200"]; // Test data
    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        
        // Wait for table data to update
        await page.waitForTimeout(500);
        
        // Get all rows from the filtered results
        const ageRows = page.locator('tbody tr');
        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent(); // Get last cell value
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found');
            } else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});


test('date picker', async ({ page }) => {
    // Navigate to the Datepicker section
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    // Open the calendar
    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    // Select a specific date
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', { exact: true }).click();
    await expect(calendarInputField).toHaveValue('Jan 1, 2025');
});

// Test case for date picker functionality 2
test("date picker 2", async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();

    // Open calendar
    const calendarInputField = page.getByPlaceholder("Form Picker");
    await calendarInputField.click();

    let date = new Date(); // Create JS date object
    date.setDate(date.getDate() + 7); // Set date to current date + 7 days
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("en-GB", { month: "short" });
    const expectedMonthLong = date.toLocaleString("en-GB", { month: "long" });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    // Get current month and year from the calendar
    let calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;

    // Loop until the displayed month matches the expected month
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator("nb-calendar-pageable-navigation [data-name=\"chevron-right\"]").click();
        calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
    }

    // Select the expected date
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click();
    await expect(calendarInputField).toHaveValue(dateToAssert);
});

// Test case for sliders functionality
test("sliders", async ({ page }) => {
    // Update attribute cx, cy
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    await tempGauge.evaluate(node => {
        node.setAttribute("cx", "232.630");
        node.setAttribute("cy", "232.630");
    });
    await tempGauge.click();
});

// Test case for slider movement using mouse
test("sliders 2", async ({ page }) => {
    // Scroll into view
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();

    // Get center coordinates of the box
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y); // Move mouse to center, starting position
    await page.mouse.down(); // Click and hold
    await page.mouse.move(x + 100, y); // Move to the right
    await page.mouse.move(x + 100, y + 100); // Move downward
    await page.mouse.up(); // Release mouse button

    // Assert that the value has changed
    await expect(tempBox).toContainText("30");
});


test('Drag & drop temperature gauge', async ({ page }) => {
    // Locate the temperature gauge circle element
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');

    // Update the position attributes (cx, cy) to simulate a drag start position
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.630');
        node.setAttribute('cy', '232.630');
    });

    // Click on the gauge after updating its position
    await tempGauge.click();
});
