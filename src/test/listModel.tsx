import xs, { flattenSequentially } from 'xstream';
import { ProducerBase } from '../index';
export default class ListModel extends ProducerBase {
    static initialState = {
        pending: false,
        errorInfo: null,
        list: []
    };

    constructor(){
        super();
    }

    subscribe (stream$: any, hydrateState: any) {
        return stream$
            .map(({userId}) => xs
                .fromPromise(getUserList(userId))
                .startWith({pending: true, errorInfo: null})
            ).compose(flattenSequentially)
            .map((response: { list: any; }) => ({list: response.list, errorInfo: null, pending: false}))
            .compose(flattenSequentially)
            .replaceError((err: any) => xs.of({errorInfo: err, pending: false}))
            .subscribe({next: (state: any) => hydrateState(state), error: (err: any) => hydrateState({errorInfo: err, pending: false})})
    }
}

function getUserList (userId: any) {
    return fetch(`sxmksfjnges?userId=${userId}`).then((res)=>{
        return {
            pending: true,
            errorInfo: null
        };
    });
}