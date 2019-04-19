import React from 'react';
import {render} from 'react-dom';
import List from './List';
const initProps = {
    resetStream: ()=>{},
    pullStream: ()=>{},
    loading: true,
    hasError: false,
    list: ['asfdgfdgsd', 'fvgdsgdfsb']
};
render(<List {...initProps}/>, document.getElementById('app'));