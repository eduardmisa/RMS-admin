import {AuthService} from '@/api/AuthService'

import {ApplicationService} from '@/api/ApplicationService'
import {ModuleService} from '@/api/ModuleService'
import {EndpointService} from '@/api/EndpointService'

export default (context, inject) => {
    inject('api', {
        AuthService: new AuthService(context.$axios, '/api/v1/auth/'),


        ApplicationService: new ApplicationService(context.$axios, '/api/v1/management/applications/'),
        ModuleService: new ModuleService(context.$axios, '/api/v1/management/modules/'),
        EndpointService: new EndpointService(context.$axios, '/api/v1/management/endpoints/'),

    })
}
