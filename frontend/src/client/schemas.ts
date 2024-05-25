export const $AppointmentCreate = {
	properties: {
		start: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		end: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		confirmed: {
	type: 'boolean',
	default: false,
},
		canceled: {
	type: 'boolean',
	default: false,
},
		user_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		client_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		service_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $AppointmentPublic = {
	properties: {
		start: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		end: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		confirmed: {
	type: 'boolean',
	default: false,
},
		canceled: {
	type: 'boolean',
	default: false,
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		user_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		client_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		service_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $AppointmentUpdate = {
	properties: {
		canceled: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		confirmed: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		start: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
		end: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ApptJoinSvcClient = {
	properties: {
		start: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		end: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		confirmed: {
	type: 'boolean',
	default: false,
},
		canceled: {
	type: 'boolean',
	default: false,
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		user_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		client_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		service_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		client: {
	type: 'any-of',
	contains: [{
	type: 'ClientPublic',
}, {
	type: 'null',
}],
},
		service: {
	type: 'any-of',
	contains: [{
	type: 'ServicePublic',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ApptsJoinSvcsClients = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ApptJoinSvcClient',
	},
	isRequired: true,
},
	},
} as const;

export const $Body_login_login_access_token = {
	properties: {
		grant_type: {
	type: 'any-of',
	contains: [{
	type: 'string',
	pattern: 'password',
}, {
	type: 'null',
}],
},
		username: {
	type: 'string',
	isRequired: true,
},
		password: {
	type: 'string',
	isRequired: true,
},
		scope: {
	type: 'string',
	default: '',
},
		client_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		client_secret: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ClientAppointmentRequest = {
	properties: {
		user_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		client_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'uuid',
}, {
	type: 'null',
}],
},
		service_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		start: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		end: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		email: {
	type: 'string',
	isRequired: true,
},
		first_name: {
	type: 'string',
	isRequired: true,
},
		last_name: {
	type: 'string',
	isRequired: true,
},
		pronouns: {
	type: 'string',
	isRequired: true,
},
		birthday: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		preferred_contact: {
	type: 'string',
	isRequired: true,
},
		phone_number: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ClientCreate = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
},
		first_name: {
	type: 'string',
	isRequired: true,
},
		last_name: {
	type: 'string',
	isRequired: true,
},
		pronouns: {
	type: 'string',
	isRequired: true,
},
		birthday: {
	type: 'string',
	isRequired: true,
	format: 'date',
},
		preferred_contact: {
	type: 'string',
	isRequired: true,
},
		phone_number: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ClientPublic = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
},
		first_name: {
	type: 'string',
	isRequired: true,
},
		last_name: {
	type: 'string',
	isRequired: true,
},
		pronouns: {
	type: 'string',
	isRequired: true,
},
		birthday: {
	type: 'string',
	isRequired: true,
	format: 'date',
},
		preferred_contact: {
	type: 'string',
	isRequired: true,
},
		phone_number: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $ClientUpdate = {
	properties: {
		email: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		first_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		last_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		pronouns: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		birthday: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
		preferred_contact: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		phone_number: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ClientsPublic = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ClientPublic',
	},
	isRequired: true,
},
	},
} as const;

export const $HTTPValidationError = {
	properties: {
		detail: {
	type: 'array',
	contains: {
		type: 'ValidationError',
	},
},
	},
} as const;

export const $Message = {
	properties: {
		message: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $NewPassword = {
	properties: {
		token: {
	type: 'string',
	isRequired: true,
},
		new_password: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ServiceCreate = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		active: {
	type: 'boolean',
	isRequired: true,
},
		duration: {
	type: 'number',
	isRequired: true,
},
		max_per_day: {
	type: 'number',
	isRequired: true,
},
		start: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		end: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		workinghours: {
	type: 'array',
	contains: {
		type: 'WorkingHours',
	},
	isRequired: true,
},
	},
} as const;

export const $ServicePublic = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		active: {
	type: 'boolean',
	isRequired: true,
},
		duration: {
	type: 'number',
	isRequired: true,
},
		max_per_day: {
	type: 'number',
	isRequired: true,
},
		start: {
	type: 'string',
	isRequired: true,
	format: 'date',
},
		end: {
	type: 'string',
	isRequired: true,
	format: 'date',
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		user_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		workinghours: {
	type: 'array',
	contains: {
		type: 'WorkingHours',
	},
	isRequired: true,
},
	},
} as const;

export const $ServiceUpdate = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		active: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		duration: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		max_per_day: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		start: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date',
}, {
	type: 'null',
}],
},
		end: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ServicesPublic = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ServicePublic',
	},
	isRequired: true,
},
	},
} as const;

export const $Token = {
	properties: {
		access_token: {
	type: 'string',
	isRequired: true,
},
		token_type: {
	type: 'string',
	default: 'bearer',
},
	},
} as const;

export const $UpdatePassword = {
	properties: {
		current_password: {
	type: 'string',
	isRequired: true,
},
		new_password: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $UserBooking = {
	properties: {
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		shop_name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $UserCreate = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
},
		username: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		shop_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		is_superuser: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		password: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $UserPublic = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
},
		username: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		shop_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		is_superuser: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $UserRegister = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
},
		password: {
	type: 'string',
	isRequired: true,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		shop_name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $UserUpdate = {
	properties: {
		email: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		username: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		shop_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		is_superuser: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		password: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $UsersPublic = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'UserPublic',
	},
	isRequired: true,
},
	},
} as const;

export const $ValidationError = {
	properties: {
		loc: {
	type: 'array',
	contains: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'number',
}],
},
	isRequired: true,
},
		msg: {
	type: 'string',
	isRequired: true,
},
		type: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $WorkingHours = {
	properties: {
		id: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'uuid',
}, {
	type: 'null',
}],
},
		weekday: {
	type: 'number',
	isRequired: true,
},
		open: {
	type: 'string',
	isRequired: true,
	format: 'time',
},
		close: {
	type: 'string',
	isRequired: true,
	format: 'time',
},
		service_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'uuid',
}, {
	type: 'null',
}],
	isRequired: true,
},
	},
} as const;