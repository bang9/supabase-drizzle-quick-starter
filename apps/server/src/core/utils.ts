import { chain } from 'radash';

export const isNullish = (it?: unknown): it is null | undefined => it === undefined || it === null;
export const clamp = (min: number, max: number) => (value: number) => Math.min(Math.max(value, min), max);
export const safePercent = chain(clamp(0, 100), (x) => x.toFixed(2), parseFloat);
