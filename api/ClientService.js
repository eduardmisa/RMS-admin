import Request from '@/api/classes/Request'
import Response from '@/api/classes/Response'

export class ClientService extends Request {
    constructor (axios, baseUrl) {
        super(axios, baseUrl)
    }

    async OverAllAccess (clientId) {
        return this.get_request({
            slug: `${clientId}/overall-access/`,
            params: [{key: 'page-size', value: 1000}]
        })
    }
}
