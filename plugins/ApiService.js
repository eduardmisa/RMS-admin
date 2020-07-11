import {AuthService} from '@/api/AuthService'

import {ApplicationService} from '@/api/ApplicationService'
import {FrontendRouteService} from '@/api/FrontendRouteService'
import {BackendRouteService} from '@/api/BackendRouteService'
import {PermissionService} from '@/api/PermissionService'
import {ModuleService} from '@/api/ModuleService'
import {GroupService} from '@/api/GroupService'
import {UserService} from '@/api/UserService'
import {ClientService} from '@/api/ClientService'


export default (context, inject) => {
    inject('api', {
        AuthService: new AuthService(context.$axios, '/api/v1/auth/'),

        ApplicationService: new ApplicationService(context.$axios, '/api/v1/management/services/'),
        FrontendRouteService: new FrontendRouteService(context.$axios, '/api/v1/management/routes-front/'),
        BackendRouteService: new BackendRouteService(context.$axios, '/api/v1/management/routes-back/'),
        PermissionService: new PermissionService(context.$axios, '/api/v1/management/permissions/'),
        ModuleService: new ModuleService(context.$axios, '/api/v1/management/modules/'),
        GroupService: new GroupService(context.$axios, '/api/v1/management/groups/'),
        UserService: new UserService(context.$axios, '/api/v1/management/users/'),
        ClientService: new ClientService(context.$axios, '/api/v1/management/clients/'),
    })
}
