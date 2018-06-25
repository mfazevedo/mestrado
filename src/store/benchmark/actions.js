export function loadRequestsFromBenchmark(requests=null) {
  return {
    type: 'LOAD_REQUESTS',
    payload: requests,
  }
}

export function loadDefinitionsFromBenchmark(header=null) {
	return {
	  type: 'LOAD_DATA',
	  payload: header,
	}
  }