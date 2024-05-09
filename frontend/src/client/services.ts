import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

import type { Body_login_login_access_token,Message,NewPassword,Token,UserPublic,UpdatePassword,UserCreate,UserRegister,UsersPublic,UserUpdate,AppointmentCreate,AppointmentPublic,AppointmentUpdate,ApptsJoinSvcsClients,ClientAppointmentRequest,ServiceCreate,ServicePublic,ServicesPublic,ServiceUpdate,ClientCreate,ClientPublic,ClientsPublic,ClientUpdate } from './models';

export type TDataLoginAccessToken = {
                formData: Body_login_login_access_token
                
            }
export type TDataRecoverPassword = {
                email: string
                
            }
export type TDataResetPassword = {
                requestBody: NewPassword
                
            }
export type TDataRecoverPasswordHtmlContent = {
                email: string
                
            }

export class LoginService {

	/**
	 * Login Access Token
	 * OAuth2 compatible token login, get an access token for future requests
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static loginAccessToken(data: TDataLoginAccessToken): CancelablePromise<Token> {
		const {
formData,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/access-token',
			formData: formData,
			mediaType: 'application/x-www-form-urlencoded',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Test Token
	 * Test access token
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static testToken(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/test-token',
		});
	}

	/**
	 * Recover Password
	 * Password Recovery
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static recoverPassword(data: TDataRecoverPassword): CancelablePromise<Message> {
		const {
email,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/password-recovery/{email}',
			path: {
				email
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Reset Password
	 * Reset password
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static resetPassword(data: TDataResetPassword): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/reset-password/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Recover Password Html Content
	 * HTML Content for Password Recovery
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static recoverPasswordHtmlContent(data: TDataRecoverPasswordHtmlContent): CancelablePromise<string> {
		const {
email,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/password-recovery-html-content/{email}',
			path: {
				email
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataGetUsers = {
                limit?: number
skip?: number
                
            }
export type TDataCreateUser = {
                requestBody: UserCreate
                
            }
export type TDataUpdateUserMe = {
                requestBody: UserUpdate
                
            }
export type TDataUpdatePasswordMe = {
                requestBody: UpdatePassword
                
            }
export type TDataRegisterUser = {
                requestBody: UserRegister
                
            }
export type TDataReadUserById = {
                userId: string
                
            }
export type TDataUpdateUser = {
                requestBody: UserUpdate
userId: string
                
            }
export type TDataDeleteUser = {
                userId: string
                
            }

export class UsersService {

	/**
	 * Get Users
	 * @returns UsersPublic Successful Response
	 * @throws ApiError
	 */
	public static getUsers(data: TDataGetUsers = {}): CancelablePromise<UsersPublic> {
		const {
limit = 100,
skip = 0,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create User
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static createUser(data: TDataCreateUser): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read User Me
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserMe(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/me',
		});
	}

	/**
	 * Update User Me
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static updateUserMe(data: TDataUpdateUserMe): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/me',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Password Me
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static updatePasswordMe(data: TDataUpdatePasswordMe): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/me/password',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Register User
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static registerUser(data: TDataRegisterUser): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/signup',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read User By Id
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserById(data: TDataReadUserById): CancelablePromise<UserPublic> {
		const {
userId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update User
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static updateUser(data: TDataUpdateUser): CancelablePromise<UserPublic> {
		const {
requestBody,
userId,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete User
	 * Delete a user.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
		const {
userId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataListAppointments = {
                limit?: number
skip?: number
                
            }
export type TDataCreateAppointment = {
                requestBody: AppointmentCreate
                
            }
export type TDataJoinApptsSvcClientsBetween = {
                end: string
start: string
                
            }
export type TDataGetAppointment = {
                apptId: string
                
            }
export type TDataUpdateAppointment = {
                apptId: string
requestBody: AppointmentUpdate
                
            }
export type TDataDeleteAppointment = {
                apptId: string
                
            }
export type TDataRequestAppointment = {
                requestBody: ClientAppointmentRequest
                
            }

export class AppointmentsService {

	/**
	 * List Appointments
	 * @returns ApptsJoinSvcsClients Successful Response
	 * @throws ApiError
	 */
	public static listAppointments(data: TDataListAppointments = {}): CancelablePromise<ApptsJoinSvcsClients> {
		const {
limit = 100,
skip = 0,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/appointments/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Appointment
	 * @returns AppointmentPublic Successful Response
	 * @throws ApiError
	 */
	public static createAppointment(data: TDataCreateAppointment): CancelablePromise<AppointmentPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/appointments/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Join Appts Svc Clients Between
	 * @returns ApptsJoinSvcsClients Successful Response
	 * @throws ApiError
	 */
	public static joinApptsSvcClientsBetween(data: TDataJoinApptsSvcClientsBetween): CancelablePromise<ApptsJoinSvcsClients> {
		const {
end,
start,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/appointments/schedule/',
			query: {
				start, end
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Appointment
	 * @returns AppointmentPublic Successful Response
	 * @throws ApiError
	 */
	public static getAppointment(data: TDataGetAppointment): CancelablePromise<AppointmentPublic> {
		const {
apptId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/appointments/{appt_id}',
			path: {
				appt_id: apptId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Appointment
	 * @returns AppointmentPublic Successful Response
	 * @throws ApiError
	 */
	public static updateAppointment(data: TDataUpdateAppointment): CancelablePromise<AppointmentPublic> {
		const {
apptId,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/appointments/{appt_id}',
			path: {
				appt_id: apptId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Appointment
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteAppointment(data: TDataDeleteAppointment): CancelablePromise<Message> {
		const {
apptId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/appointments/{appt_id}',
			path: {
				appt_id: apptId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Request Appointment
	 * @returns ClientAppointmentRequest Successful Response
	 * @throws ApiError
	 */
	public static requestAppointment(data: TDataRequestAppointment): CancelablePromise<ClientAppointmentRequest> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/appointments/request',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataListServices = {
                limit?: number
skip?: number
                
            }
export type TDataCreateService = {
                requestBody: ServiceCreate
                
            }
export type TDataGetService = {
                svcId: string
                
            }
export type TDataUpdateService = {
                requestBody: ServiceUpdate
svcId: string
                
            }
export type TDataDeleteService = {
                svcId: string
                
            }
export type TDataGetServiceAvailability = {
                month?: number | null
svcId: string
year?: number | null
                
            }

export class ServicesService {

	/**
	 * List Services
	 * @returns ServicesPublic Successful Response
	 * @throws ApiError
	 */
	public static listServices(data: TDataListServices = {}): CancelablePromise<ServicesPublic> {
		const {
limit = 100,
skip = 0,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/services/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Service
	 * @returns ServicePublic Successful Response
	 * @throws ApiError
	 */
	public static createService(data: TDataCreateService): CancelablePromise<ServicePublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/services/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Service
	 * @returns ServicePublic Successful Response
	 * @throws ApiError
	 */
	public static getService(data: TDataGetService): CancelablePromise<ServicePublic> {
		const {
svcId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/services/{svc_id}',
			path: {
				svc_id: svcId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Service
	 * @returns ServicePublic Successful Response
	 * @throws ApiError
	 */
	public static updateService(data: TDataUpdateService): CancelablePromise<ServicePublic> {
		const {
requestBody,
svcId,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/services/{svc_id}',
			path: {
				svc_id: svcId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Service
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteService(data: TDataDeleteService): CancelablePromise<Message> {
		const {
svcId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/services/{svc_id}',
			path: {
				svc_id: svcId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Service Availability
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getServiceAvailability(data: TDataGetServiceAvailability): CancelablePromise<unknown> {
		const {
month,
svcId,
year,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/services/{svc_id}/availability',
			path: {
				svc_id: svcId
			},
			query: {
				year, month
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataListClients = {
                limit?: number
skip?: number
                
            }
export type TDataCreateClient = {
                requestBody: ClientCreate
                
            }
export type TDataGetClient = {
                clientId: string
                
            }
export type TDataUpdateClient = {
                clientId: string
requestBody: ClientUpdate
                
            }
export type TDataDeleteClient = {
                clientId: string
                
            }

export class ClientsService {

	/**
	 * List Clients
	 * @returns ClientsPublic Successful Response
	 * @throws ApiError
	 */
	public static listClients(data: TDataListClients = {}): CancelablePromise<ClientsPublic> {
		const {
limit = 100,
skip = 0,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/clients/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Client
	 * @returns ClientPublic Successful Response
	 * @throws ApiError
	 */
	public static createClient(data: TDataCreateClient): CancelablePromise<ClientPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/clients/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Client
	 * @returns ClientPublic Successful Response
	 * @throws ApiError
	 */
	public static getClient(data: TDataGetClient): CancelablePromise<ClientPublic> {
		const {
clientId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/clients/{client_id}',
			path: {
				client_id: clientId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Client
	 * @returns ClientPublic Successful Response
	 * @throws ApiError
	 */
	public static updateClient(data: TDataUpdateClient): CancelablePromise<ClientPublic> {
		const {
clientId,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/clients/{client_id}',
			path: {
				client_id: clientId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Client
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteClient(data: TDataDeleteClient): CancelablePromise<Message> {
		const {
clientId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/clients/{client_id}',
			path: {
				client_id: clientId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}