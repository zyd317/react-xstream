import React, {PureComponent, ReactElement} from 'react';
import StreamProducerBase, { IModelConstructor } from '../producer/StreamProducerBase';

type IMapStreamToProps = (state: AnyObject) => AnyObject;
type subscribeStreamToPropsHoc = (component: any) => any;

const subscribeStreamToProps = (model: StreamProducerBase, mapStreamToProps: IMapStreamToProps): subscribeStreamToPropsHoc => (PipeComponent: any) => {
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

        public bindListener = () => {
            if (this.hasBindListener) {
                return;
            }
            model.bindListenerWithNewStream(this.updateState);
            this.hasBindListener = true;
        };

        public updateState = (state = {}) => {
            if (!this.hasBindListener) {
                return;
            }
            this.setState(state);
        };

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