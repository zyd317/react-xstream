import React from 'react';
import {render} from 'react-dom';
import List from './List';
const initProps = {
    resetStream: ()=>{},
    pullStream: ()=>{},
    loading: true,
    hasError: false,
    list: ['list1', 'list2']
};
render(<List {...initProps}/>, document.getElementById('app'));