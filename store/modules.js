export const state = () => ({
    items: []
  })
  
  export const getters = {
    
  }
  
  export const mutations = {
    populateModules(state, {modules}) {
      state.items = []
      modules.forEach(element => {
        state.items.push(element)
      });
    },
  }
  
//   export const actions = {
//     toggleSnackbar(state, message) {
//       state.commit('toggleConfirmManual', {
//         title: 'Resource Management System',
//         message: message,
//         possitiveActionText: 'Ok',
//       })
//     },
//     toggleLoader(state, message) {
//       state.commit('toggleLoader', message)
//     },
//     toggleConfirmManual (state, obj) {
//       state.commit('toggleConfirmManual', obj)
//     }
//   }
  