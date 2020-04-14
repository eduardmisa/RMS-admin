export default (context, inject) => {
    inject('toast', ({show, message, color}) => context.store.commit('toast/toggleToast', {show, message, color}))
}
