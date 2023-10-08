import { InjectionToken } from "@angular/core";
import { ConditionsAndZip } from "../conditions-and-zip.type";

export const CACHE_DURATION_TOKEN = new InjectionToken<number>('CacheDurationToken');

export const DEFAULT_CACHE_DURATION = 2 * 60 * 60; //2h

export const CACHE_DURATION_KEY = "cacheDuration";

export class CachedDataStructure {
    cachedTime: number;
    realdata: ConditionsAndZip[];

    static buildCachedData(realData: ConditionsAndZip[]): CachedDataStructure {
        return {
            cachedTime: new Date().getTime() / 1000,
            realdata: realData
        }
    }

    static extractRealData(cachedData: CachedDataStructure): ConditionsAndZip[] {
        return cachedData.realdata;
    }

    static isExpired(cachedData: CachedDataStructure, cacheDuration: number) {
        const expired = (new Date().getTime() / 1000 - cachedData.cachedTime) > cacheDuration;
        console.log(`isExpired(${new Date().getTime() / 1000}-${cachedData.cachedTime}>${cacheDuration})=>${expired}`);
        return expired;
    }
}
