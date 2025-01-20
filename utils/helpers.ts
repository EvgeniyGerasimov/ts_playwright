import { Page } from '@playwright/test';

import { add, format, sub } from 'date-fns';

export async function selectServiceLocation(page: Page, locationText?: string): Promise<void> {
  const locationSelector = page.locator("//div[@id='location']");

  await locationSelector.click();

  if (locationText) {
    // If text is provided, locate the option with the matching text and select it
    const option = locationSelector.locator('//div[@role="option"]').getByText(locationText);
    await option.click();
  } else {
    // If no text is provided, select the first option
    const firstOption = locationSelector.locator('//div[@role="option"]').first();
    await firstOption.click();
  }
}

export async function getCookiesString(response: any): Promise<string> {
  const rawCookies = response.headers['set-cookie'];
  // Split the raw cookies into individual cookie strings
  const cookiesArray = rawCookies.split('\n');
  // Extract and format each cookie's name=value pair
  return cookiesArray
    .map((cookie: string) => {
      const [nameValuePair] = cookie.split(';'); // Get the first part before ";"
      return nameValuePair.trim(); // Trim and return the name=value pair
    })
    .join('; '); // Join all name=value pairs into a single string
}

export function getDateHelper(amount?: number, timePeriod?: 'day' | 'week' | 'months' | 'years' | 'minutes') {
  const currentUtc = new Date();
  // If amount and timePeriod are provided, add or subtract to/from current UTC time
  // for  subtraction use negative values for amount

  let updatedDate = currentUtc;
  if (amount && timePeriod) {
    updatedDate = add(currentUtc, {
      [timePeriod]: amount,
    });
  }
  return format(updatedDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function getBirthDate(amount?: number, timePeriod?: 'day' | 'months' | 'years') {
  const currentUtc = new Date();
  //subtract amount and timePeriod from current UTC time
  let updatedDate = currentUtc;
  if (amount && timePeriod) {
    updatedDate = sub(currentUtc, {
      [timePeriod]: amount,
    });
  }
  return format(updatedDate, 'yyyy-MM-dd');
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function birthDateToUnzr(date: string): string {
  const formattedDate = date.replace(/-/g, '');
  const randomNumber = Math.floor(10000 + Math.random() * 90000);

  return `${formattedDate}-${randomNumber}`;
}

export function getEntriesByValues<T>(
  sourceObject: Record<string, T>,
  validValues: Set<T>
): [string, T][] {
  return Object.entries(sourceObject).filter(([, value]) => validValues.has(value));
}