import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { CACHE_DURATION_KEY, CachedDataStructure } from "./cache.type";
import { AppUtil } from "../utils/app-util";
import { ConditionsAndZip } from "../conditions-and-zip.type";


export function CacheData({ cacheDuration }) {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        let savedCacheDuration: string = localStorage.getItem(CACHE_DURATION_KEY);
        if (AppUtil.isAPositiveNumber(savedCacheDuration)) {
            cacheDuration = +savedCacheDuration;
        }
        descriptor.value = function (...args: any[]) {
            const cacheKey = `${propertyKey.toString()}:${JSON.stringify(args)}`;
            const cachedData = CacheUtil.getFromCache(cacheKey);
            if (!AppUtil.isEmpty(cachedData) && !CachedDataStructure.isExpired(cachedData, cacheDuration)) {
                const realData = CachedDataStructure.extractRealData(cachedData);
                console.log('decorator return real data ', realData)
                return of(realData);
            }
            return originalMethod.apply(this, args)
                .pipe(tap((response: ConditionsAndZip[]) => {
                    const cachedData = CachedDataStructure.buildCachedData(response)
                    console.log('decorate try to save CachedDataStructure', cachedData)
                    CacheUtil.saveToCache(cacheKey, cachedData);
                }));
        };
    };
}

class CacheUtil {
    static saveToCache(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getFromCache(key: string): any {
        let value = null;
        const stringData = localStorage.getItem(key);
        if (stringData != 'undefined') {
            value = JSON.parse(stringData);
        }
        return value;
    }
}