import { checkForWin } from '@/game/board'
import { clone, isEmpty, keysWhereValue } from '@/utils'
import Robot from '@/game/robot'

const state = {
  freeze: false,
  moves: 0,
  // Store the player who has played, X or O
  cells: {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: ''
  },
  winner: {}
}

const initialState = clone(state)

const getters = {
  boardIsEmpty ({ cells }) {
    return keysWhereValue('', cells).length === 9
  }
}

const mutations = {
  STRIKE (state, {cellIndex, player}) {
    state.cells[cellIndex] = player
  },

  INCREMENT_MOVEMENTS (state) {
    state.moves++
  },

  SET_WINNER (state, winner) {
    state.winner = winner
  },

  RESET_STATE (state) {
    Object.assign(state, clone(initialState))
  },

  FREEZE (state, freeze) {
    state.freeze = freeze
  }
}

const actions = {
  async strikeCell ({ state, commit, dispatch }, {cellIndex, player}) {
    commit('STRIKE', {cellIndex, player})
    commit('INCREMENT_MOVEMENTS')

    await dispatch('checkGameWinner')
  },

  async checkGameWinner ({ state, commit }) {
    const {win, winner, condition} = checkForWin(state.cells)

    if (win) {
      commit('SET_WINNER', {
        player: winner,
        condition
      })
    }
  },

  checkStatus ({state}) {
    if (!isEmpty(state.winner)) {
      return 'win'
    }

    if (state.moves === 9) {
      return 'draw'
    }

    return 'turn'
  },

  async robotMove ({state, commit, rootState, dispatch}) {
    const board = clone(state.cells)
    const player = rootState.robotPlayer

    const cellIndex = await Robot.move({
      me: player,
      board
    })

    await dispatch('strikeCell', {
      cellIndex,
      player
    })

    return cellIndex
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
