import guidHelper from '@/helpers/guidHelper.js'
import numberHelper from '@/helpers/numberHelper.js'

export default (context, inject) => {

    const helperFactory = {
        guid: guidHelper,
        number: numberHelper
    }

    inject('helpers', helperFactory)
}
