import {
	createStore,
	applyMiddleware,
	compose
} 								from 'redux'
import {combineReducers} 		from 'redux'


import {
	RequestsReducer,
	DefinitionsReducer,
} 								from './benchmark'

import {
	SolutionReducer,
}								from './solution'


const allReducers = combineReducers({
	Requests:       RequestsReducer,
	Definitions:    DefinitionsReducer,
	Solution: 		SolutionReducer,
});


export const Store = createStore(allReducers)

Store.subscribe(()=>{
	console.log('Store change ', Store.getState())
})