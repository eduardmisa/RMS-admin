import Request from '@/api/classes/Request'
import Response from '@/api/classes/Response'

export class AuthService extends Request {
    constructor (axios, baseUrl) {
        super(axios, baseUrl)
    }

    async Login ({username,
                  password,
                  client_id,
                  client_secret,
                  scope}) {

        const form = {
            username,
            password,
            client_id,
            client_secret,
            scope
        }
        
        return await this.post_request({
            slug: 'login/',
            form,
        })
    }

    async CurrentUser (token) {
        if (!token) {
            return await this.get_request({
                slug: 'current-user/',
            })
        }
        else {
            let furl = this.urlHelper({url: this.baseUrl, slug: 'current-user/'})
        
            let response = null
            await this.axios.get(furl, { headers: { Authorization: `Bearer ${token}`}})
              .then(function({data}) {
                if ('username' in data)
                    response = new Response(true, data, null)
                else
                    response = new Response(false, null, 'Invalid current user data')    
              })
              .catch(function(error) {
                response = new Response(false, null, error && error.response ? error.response.data: 'Unknown Error')
              })
            return response
        }
    }

    async CurrentUserScope (token) {
        if (!token) {
            return await this.get_request({
                slug: 'current-user/scope/',
            })
        }
        else {
            let furl = this.urlHelper({url: this.baseUrl, slug: 'current-user/scope/'})
        
            let response = null
            await this.axios.get(furl, { headers: { Authorization: `Bearer ${token}`}})
              .then(function({data}) {
                if ('token' in data && 'service_routes' in data )
                    response = new Response(true, data, null)
                else
                    response = new Response(false, null, 'Invalid current user scope data')    
              })
              .catch(function(error) {
                response = new Response(false, null, error && error.response ? error.response.data: 'Unknown Error')
              })
            return response
        }
    }
}