import guidHelper from '@/helpers/guidHelper'

export default (context, inject) => {
    inject('helpers', {
        guid: guidHelper
    })
}
