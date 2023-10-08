import { Observable, timer } from "rxjs";

export class AppUtil {
  static isObjectEmpty(variable: object): boolean {
    let empty = true;
    if (variable) {
      if (Array.isArray(variable)) {
        variable.forEach(item => {
          if (item != null) {
            empty = false;
            return;
          }
        });
      } else {
        for (let key in variable) {
          if (variable.hasOwnProperty(key)) {
            empty = false;
            break;
          }
        }
      }
    }
    return empty;
  }

  static isEmpty(variable: string | number | bigint | boolean | object | undefined): boolean {
    let empty = true;
    switch (typeof variable) {
      case 'undefined':
        break;
      case 'string':
      case 'number':
      case 'bigint':
      case 'boolean':
        empty = variable == null || variable.toString().trim() == '';
        break;
      case 'function':
        empty = variable == null;
        break;
      case 'object':
        empty = AppUtil.isObjectEmpty(variable);
        break;
    }
    return empty;
  }

  static runObservableOnlyOneTime(observable: Observable<any>): void {
    const sub1 = observable.subscribe(() => {
      if (sub1) {
        sub1.unsubscribe();
      } else {
        const sub2 = timer(0).subscribe(() => {
          sub1.unsubscribe();
          sub2.unsubscribe();
        });
      }
    });
  }

  static isAPositiveNumber(str: string): boolean {
    return !isNaN(+str) && (+str > 0);
  }

}


