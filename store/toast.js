export const state = () => ({
    show: false,
    message: '',
    color: 'primary'
  })
  
  export const getters = {
    
  }
  
  export const mutations = {
    toggleToast(state, {message, color}) {

      state.show = true
      state.message = message
      state.color = color ? color : 'primary'
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
  