import {AuthService} from '@/api/AuthService'

import {ApplicationService} from '@/api/ApplicationService'
import {ModuleService} from '@/api/ModuleService'
import {EndpointService} from '@/api/EndpointService'
import {GroupService} from '@/api/GroupService'
import {UserService} from '@/api/UserService'
import {ClientService} from '@/api/ClientService'




export default (context, inject) => {
    inject('api', {
        AuthService: new AuthService(context.$axios, '/api/v1/auth/'),

        ApplicationService: new ApplicationService(context.$axios, '/api/v1/management/applications/'),
        ModuleService: new ModuleService(context.$axios, '/api/v1/management/modules/'),
        EndpointService: new EndpointService(context.$axios, '/api/v1/management/endpoints/'),
        GroupService: new GroupService(context.$axios, '/api/v1/management/groups/'),
        UserService: new UserService(context.$axios, '/api/v1/management/users/'),
        ClientService: new ClientService(context.$axios, '/api/v1/management/clients/'),
    })
}
