import Request from '@/api/classes/Request'
import Response from '@/api/classes/Response'

export class ServiceService extends Request {
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
    async View (appId) {
        return this.get_request({
            slug: `${appId}/`,
        })
    }
    async Create (form) {
        return this.post_request({
            form
        })
    }
    async Update (appId, form) {
        return this.put_request({
            slug: `${appId}/`,
            form
        })
    }
    async Delete (appId) {
        return this.delete_request({
            slug: `${appId}/`,
        })
    }

    async Overview (appId) {
        return this.get_request({
            slug: `${appId}/easy-view/`,
        })
    }
    async CreateOverview (form) {
        return this.post_request({
            slug: "easy-create/",
            form
        })
    }
}
