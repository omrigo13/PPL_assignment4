/* 2.1 */

export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}


export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    let store_data = new Map()
    return {
        get(key: K) {
            return store_data.has(key) ? Promise.resolve(store_data.get(key)) : Promise.reject(MISSING_KEY)
        },
        set(key: K, value: V) {
            store_data = store_data.set(key, value)
            return Promise.resolve()
        },
        delete(key: K) {
            return store_data.delete(key) ? Promise.resolve() : Promise.reject(MISSING_KEY)
        },
    }
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> | Promise<void> {
    return Promise.all(keys.map((key) => store.get(key)))
}

/* 2.2 */

export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
    let store = makePromisedStore<T, R>()
    let result:(param: T) => Promise<R> = (param: T) => {
        return store.get(param).then((val: R) => val, () => {
            let func_result: R = f(param);
            store.set(param, func_result)
            return func_result
        })
    }
    return result
}

/* 2.3 */

export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: (param:T)=>boolean): ()=> Generator<T> {
    function* generator() {
        for (let val of genFn()) {
            if(filterFn(val)) yield val
        }
    } 
    return generator;
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (param:T)=>R): ()=> Generator<R> {
    function* generator() {
        for (let val of genFn()){
            yield mapFn(val);
        }
    }
     return generator;
}

/* 2.4 */
// you can use 'any' in this question

// export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...(???)[]]): Promise<any> {
//     ???
// }