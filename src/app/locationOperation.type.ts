export enum LocationOperationEnum {
    ADD = 'add',
    REMOVE = 'remove',
    TAKE_FROM_STORAGE = 'take from storage'
}

export class LocationOperation {
    type: LocationOperationEnum;
    zipcode: string;

    static shouldAdd(locationOperation: LocationOperation): boolean {
        return locationOperation.type == LocationOperationEnum.ADD;
    }

    static shouldRemove(locationOperation: LocationOperation): boolean {
        return locationOperation.type == LocationOperationEnum.REMOVE;
    }

    static isTakenFromStorage(locationOperation: LocationOperation): boolean {
        return locationOperation.type == LocationOperationEnum.TAKE_FROM_STORAGE;
    }

    static add(zipcode: string): LocationOperation {
        return {
            type: LocationOperationEnum.ADD,
            zipcode
        }
    }

    static remove(zipcode: string): LocationOperation {
        return {
            type: LocationOperationEnum.REMOVE,
            zipcode
        }
    }

    static takeFromStorage(zipcode: string): LocationOperation {
        return {
            type: LocationOperationEnum.TAKE_FROM_STORAGE,
            zipcode
        }
    }
}