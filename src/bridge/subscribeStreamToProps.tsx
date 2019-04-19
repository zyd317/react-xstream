import {ComponentClass, PureComponent, ReactElement} from 'react';
import autoBind from '../utils/autobind';
import StreamModel, { IModelConstructor } from '../producer/Base';

type IMapStreamToProps = (state: AnyObject) => AnyObject;
type subscribeStreamToPropsHoc = (component: ComponentClass) => ComponentClass;

/**
 * 订阅Model的装饰器，消费Model产生的数据并以props传入组件。本质上就是一个HOC
 * 作为装饰器，调用
 *      @subscribeStreamToProps(listModel, (state: any)=>{loading: state.pending...})
 *      class List extends Component{}
 *   实际上调用是: subscribeStreamToProps(listModel: model, callState: mapStreamToProps)(List: PipeComponent) => ModelWrapperComponent
 *   把List Component包装了一下((listModel: model, callState: mapStreamToProps))，然后使用ModelWrapperComponent输出
 * @param model
 * @param mapStreamToProps
 */
const subscribeStreamToProps = (model: StreamModel, mapStreamToProps: IMapStreamToProps): subscribeStreamToPropsHoc => (PipeComponent: ComponentClass) => {
    class ModelWrapperComponent extends PureComponent {
        private hasBindListener = false;
        public state = {
            ...((model.constructor as IModelConstructor).initialState || {}),
            pullStream: model.pullStream,
            resetStream: model.resetStream
        };

        public componentWillUnmount () {
            model.unsubscribe();
            this.hasBindListener = false;
        }

        public bindListener () {
            if (this.hasBindListener) {
                return;
            }
            model.bindListenerWithNewStream(this.updateState);
            this.hasBindListener = true;
        }

        @autoBind
        public updateState (state = {}) {
            if (!this.hasBindListener) {
                return;
            }
            this.setState(state);
        }

        /**
         * 绑定listener的操作需在render中进行
         * 1.在constructor绑定中可能导致`setState in unmount Component warning`
         * 2.componentDidMount也不太合适，父组件的componentDidMount是
         * 在子组件的componentDidMount之后执行的, 如果子组件在didMount发起拉流的行为，就会导致一些问题
         */
        public render (): ReactElement {
            this.bindListener();
            const injectProps = mapStreamToProps(this.state) || {};
            return <PipeComponent {...this.props} {...injectProps}/>;
        }
    }

    return ModelWrapperComponent;
};

export default subscribeStreamToProps;