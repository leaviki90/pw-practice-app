import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase{
   
    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        // Open calendar
        const calendarInputField = this.page.getByPlaceholder("Form Picker");
        await calendarInputField.click();
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert);
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        // Open calendar
        const calendarInputField = this.page.getByPlaceholder("Range Picker");
        await calendarInputField.click();
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert);

    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date(); // Create JS date object
        date.setDate(date.getDate() + numberOfDaysFromToday); // Set date to current date + 7 days
        const expectedDate = date.getDate().toString();
        const expectedMonthShort = date.toLocaleString("en-GB", { month: "short" });
        const expectedMonthLong = date.toLocaleString("en-GB", { month: "long" });
        const expectedYear = date.getFullYear();
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

        // Get current month and year from the calendar
        let calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;

        // Loop until the displayed month matches the expected month
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator("nb-calendar-pageable-navigation [data-name=\"chevron-right\"]").click();
            calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
        }

        // Select the expected date
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click();
        return dateToAssert
    }
}
