import dayjs from 'dayjs';
import { customType } from 'drizzle-orm/pg-core';

export const datetime = customType<{ data: dayjs.Dayjs; driverData: string }>({
  dataType: () => 'timestamp with time zone',
  fromDriver: (value) => {
    return dayjs.utc(value);
  },
  toDriver: (value) => {
    return value.toISOString();
  },
});

export const cjson = customType<{ data: string; driverData: string | object }>({
  dataType: () => 'json',
  fromDriver: (value) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {}
    }
    return value;
  },
  toDriver: (value) => {
    return value;
  },
});
