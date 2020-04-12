import Request from '@/api/classes/Request'
import Response from '@/api/classes/Response'

export class EndpointService extends Request {
    constructor (axios, baseUrl) {
        super(axios, baseUrl)
    }

    async List ({page, pageSize, filterField, filterValue}) {
        return this.get_request({
            params: [
                {key: 'page', value: page},
                {key: 'page-size', value: pageSize},
                {key: 'sort-by', value: pageSize},
                {key: filterField, value: filterValue},
            ]
        })
    }
    async View (endpointId) {
        return this.get_request({
            slug: `${endpointId}/`,
        })
    }
    async Create (form) {
        return this.post_request({
            form
        })
    }
    async Update (endpointId, form) {
        return this.put_request({
            slug: `${endpointId}/`,
            form
        })
    }
    async Delete (endpointId) {
        return this.delete_request({
            slug: `${endpointId}/`,
        })
    }
}
