import xs, { flattenSequentially } from 'xstream';
import { StreamProducerBase } from '../index';
function getUserList (userId: any) {
    return fetch(`sxmksfjnges?userId=${userId}`).then((res)=>{
        return {
            pending: res,
            errorInfo: null
        };
    });
}
export default class ListModel extends StreamProducerBase {
    // model初始状态，subscribeStreamToProps订阅model时会自动使用initialState初始化状态
    static initialState = {
        pending: false,
        errorInfo: null,
        list: []
    };

    /**
     * subscribe(stream$: Stream, hydrateState: Function): UnsubscribeHandle
     * 组件调用props.pullStream会执行subscribe中流的一系列操作，产生数据。通过hydrateState与初始状态融合分发到子组件
     * @param stream$
     * @param hydrateState
     */
    public subscribe (stream$: any, hydrateState: any) {
        return stream$
            .map(({ userId }) => xs
                .fromPromise(getUserList(userId))
                .startWith({pending: true, errorInfo: null})
            )
            .compose(flattenSequentially)
            .map((response: { list: any; }) => ({list: response.list, errorInfo: null, pending: false}))
            .compose(flattenSequentially)
            .replaceError((err: any) => xs.of({errorInfo: err, pending: false}))
            .subscribe({
                next: (state: any) => hydrateState(state),
                error: (err: any) => hydrateState({errorInfo: err, pending: false})
            });
    }
}