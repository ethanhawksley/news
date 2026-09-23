import { getCollection } from 'astro:content';

import type { CollectionEntry } from 'astro:content';

export interface MonthArchive {
  yearMonth: string;
  label: string;
  days: CollectionEntry<'days'>[];
}

export async function getMonthlyArchives(): Promise<MonthArchive[]> {
  const days = await getCollection('days');
  const grouped: Record<string, CollectionEntry<'days'>[]> = {};

  for (const day of days) {
    const yearMonth = day.data.date.slice(0, 7);
    if (!grouped[yearMonth]) {
      grouped[yearMonth] = [day];
    } else {
      grouped[yearMonth].push(day);
    }
  }

  const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return sortedMonths.map((yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    const label = date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const sortedDays = grouped[yearMonth].sort((a, b) =>
      b.data.date.localeCompare(a.data.date),
    );

    return {
      yearMonth,
      label,
      days: sortedDays,
    };
  });
}
