export const getDrag = (state) => state.drag

export const getStartLink = (state) => state.startLink

export const getEndLink = (state) => state.endLink

export const getNodes = (state) => state.nodes

export const getLinks = (state) => state.nodes.filter((e) => e.links).map((e) => e.links).flat()
