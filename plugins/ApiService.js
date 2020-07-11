import {AuthService} from '@/api/AuthService'

import {ServiceService} from '@/api/ServiceService'
import {ServiceRouteService} from '@/api/ServiceRouteService'
import {PermissionService} from '@/api/PermissionService'
import {ModuleService} from '@/api/ModuleService'
import {GroupService} from '@/api/GroupService'
import {UserService} from '@/api/UserService'
import {ClientService} from '@/api/ClientService'


export default (context, inject) => {
    inject('api', {
        AuthService: new AuthService(context.$axios, '/api/v1/auth/'),

        ServiceService: new ServiceService(context.$axios, '/api/v1/management/services/'),
        ServiceRouteService: new ServiceRouteService(context.$axios, '/api/v1/management/service-routes/'),
        PermissionService: new PermissionService(context.$axios, '/api/v1/management/permissions/'),
        ModuleService: new ModuleService(context.$axios, '/api/v1/management/modules/'),
        GroupService: new GroupService(context.$axios, '/api/v1/management/groups/'),
        UserService: new UserService(context.$axios, '/api/v1/management/users/'),
        ClientService: new ClientService(context.$axios, '/api/v1/management/clients/'),
    })
}
