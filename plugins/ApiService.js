import {AuthService} from '@/api/AuthService'
import {ClientService} from '@/api/ClientService'

export default (context, inject) => {
    inject('api', {
        AuthService: new AuthService(context.$axios, '/api/v1/auth/'),
        ClientService: new ClientService(context.$axios, '/api/v1/management/clients/')
    })
}
