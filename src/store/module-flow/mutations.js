export const setStartLink = (state, link) => {
  state.startLink = link
}

export const setEndLink = (state, link) => {
  state.endLink = link
}

export const setDrag = (state, status) => {
  state.drag = status
}

export const addNode = (state, node) => {
  state.nodes.push(node)
}
