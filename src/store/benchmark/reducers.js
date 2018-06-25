export function RequestsReducer(state=[], action){
    switch (action.type){
        case 'LOAD_REQUESTS':
        	return action.payload
        	break;
    }
    return state
}

export function DefinitionsReducer(state={}, action){
    switch (action.type){
        case 'LOAD_DATA':
        	return action.payload
        	break;
    }
    return state
}

