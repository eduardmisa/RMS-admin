import Request from '@/api/classes/Request'
import Response from '@/api/classes/Response'

export class ClientService extends Request {
    constructor (axios, baseUrl) {
        super(axios, baseUrl)
    }

    async CountAll () {
        return this.get_request({
            slug: `count-all/`,
        })
    }
    async List ({page, pageSize, filterField, filterValue}) {
        return this.get_request({
            params: [
                {key: 'page', value: page},
                {key: 'page-size', value: pageSize},
                {key: filterField, value: filterValue},
            ]
        })
    }
    async View (clientId) {
        return this.get_request({
            slug: `${clientId}/`,
        })
    }
    async Create (form) {
        return this.post_request({
            form
        })
    }
    async Update (clientId, form) {
        return this.put_request({
            slug: `${clientId}/`,
            form
        })
    }
    async Delete (clientId) {
        return this.delete_request({
            slug: `${clientId}/`,
        })
    }
}
