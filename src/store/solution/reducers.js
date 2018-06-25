export function SolutionReducer(state={}, action){
    switch (action.type){
        case 'ADD_SOLUTION':
        	return action.payload
        	break;
    }
    return state
}

