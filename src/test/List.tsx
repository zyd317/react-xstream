import React, {Component} from 'react';
import { subscribeStreamToProps, autoBind } from '../index';
import ListModel from './ListModel';
const initState = {
    userId: 12345
};
interface State {
    userId: number;
}
const initProps = {
    resetStream: ()=>{},
    pullStream: ()=>{},
    loading: true,
    hasError: false,
    list: []
};
interface Props {
    resetStream: Function;
    pullStream: Function;
    loading: boolean;
    hasError: boolean;
    list: string[];
}
/**
 * 通过props注入到组件中
 * 订阅Model的装饰器，消费Model产生的数据并以props传入组件。本质上就是一个HOC
 */
@subscribeStreamToProps(ListModel, (state: any) => ({
    hasError: state.errorInfo !== null,
    loading: state.pending,
    list: state.list,
    // 拉流
    pullStream: state.pullStream,
    // 流状态重置
    resetStream: state.resetStream
}))
export default class List extends Component<Props, State> {
    static state: State = initState;
    public constructor (props: Props) {
        super(props);
    }

    public componentDidMount () {
        this.props.pullStream({userId: this.state.userId});
    }

    public render () {
        const { loading, hasError, list } = this.props;
        if (hasError) {
            return (<div>请求出错了</div>);
        }
        if (loading) {
            return (<div>数据加载中...</div>);
        }
        return (
            <div>
                <ul>
                    {list.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <button onClick={this.reset}>清空数据</button>
            </div>
        );
    }

    @autoBind
    public reset () {
        this.props.resetStream();
    }
}