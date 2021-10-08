export const saveStart = ({ commit }, link) => {
  commit('setStartLink', link)
}

export const saveEnd = ({ commit }, link) => {
  commit('setEndLink', link)
}

export const saveDrag = ({ commit }, status) => {
  commit('setDrag', status)
}

export const addNode = ({ commit }, node) => {
  commit('addNode', node)
}
