export type AppointmentCreate = {
	start: string;
	end: string;
	confirmed?: boolean;
	canceled?: boolean;
	user_id: string;
	client_id: string;
	service_id: string;
};



export type AppointmentPublic = {
	start: string;
	end: string;
	confirmed?: boolean;
	canceled?: boolean;
	id: string;
	user_id: string;
	client_id: string;
	service_id: string;
};



export type AppointmentUpdate = {
	canceled?: boolean | null;
	confirmed?: boolean | null;
	start?: string | null;
	end?: string | null;
};



export type ApptJoinSvcClient = {
	start: string;
	end: string;
	confirmed?: boolean;
	canceled?: boolean;
	id: string;
	user_id: string;
	client_id: string;
	service_id: string;
	client?: ClientPublic | null;
	service?: ServicePublic | null;
};



export type ApptsJoinSvcsClients = {
	data: Array<ApptJoinSvcClient>;
};



export type Availabilities = {
	data: Array<Availability>;
};



export type Availability = {
	date: string;
	windows: Array<Record<string, string>>;
};



export type Body_login_login_access_token = {
	grant_type?: string | null;
	username: string;
	password: string;
	scope?: string;
	client_id?: string | null;
	client_secret?: string | null;
};



export type ClientAppointmentRequest = {
	user_id: string;
	client_id?: string | null;
	service_id: string;
	start: string;
	end: string;
	email: string;
	first_name: string;
	last_name: string;
	pronouns: string;
	birthday: string;
	preferred_contact: string;
	phone_number: string;
};



export type ClientAppointmentResponse = {
	id: string;
	user_id: string;
	service_id: string;
	start: string;
	end: string;
	confirmed: boolean;
};



export type ClientCreate = {
	email: string;
	first_name: string;
	last_name: string;
	pronouns: string;
	birthday: string;
	preferred_contact: string;
	phone_number: string;
};



export type ClientPublic = {
	email: string;
	first_name: string;
	last_name: string;
	pronouns: string;
	birthday: string;
	preferred_contact: string;
	phone_number: string;
	id: string;
};



export type ClientUpdate = {
	email?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	pronouns?: string | null;
	birthday?: string | null;
	preferred_contact?: string | null;
	phone_number?: string | null;
};



export type ClientsPublic = {
	data: Array<ClientPublic>;
};



export type HTTPValidationError = {
	detail?: Array<ValidationError>;
};



export type Message = {
	message: string;
};



export type NewPassword = {
	token: string;
	new_password: string;
};



export type ServiceCreate = {
	name: string;
	active: boolean;
	duration: number;
	max_per_day: number;
	start: string;
	end: string;
	workinghours: Array<WorkingHours>;
};



export type ServicePublic = {
	name: string;
	active: boolean;
	duration: number;
	max_per_day: number;
	start: string;
	end: string;
	id: string;
	user_id: string;
	workinghours: Array<WorkingHours>;
};



export type ServiceUpdate = {
	name?: string | null;
	active?: boolean | null;
	duration?: number | null;
	max_per_day?: number | null;
	start?: string | null;
	end?: string | null;
};



export type ServicesPublic = {
	data: Array<ServicePublic>;
};



export type Token = {
	access_token: string;
	token_type?: string;
};



export type UpdatePassword = {
	current_password: string;
	new_password: string;
};



export type UserBooking = {
	id: string;
	shop_name: string;
	username: string;
};



export type UserCreate = {
	email: string;
	username?: string | null;
	full_name?: string | null;
	shop_name?: string | null;
	is_active?: boolean | null;
	is_superuser?: boolean | null;
	password: string;
};



export type UserPublic = {
	email: string;
	username?: string | null;
	full_name?: string | null;
	shop_name?: string | null;
	is_active?: boolean | null;
	is_superuser?: boolean | null;
	id: string;
};



export type UserRegister = {
	email: string;
	password: string;
	full_name?: string | null;
	shop_name: string;
};



export type UserUpdate = {
	email?: string | null;
	username?: string | null;
	full_name?: string | null;
	shop_name?: string | null;
	is_active?: boolean | null;
	is_superuser?: boolean | null;
	password?: string | null;
};



export type UsersPublic = {
	data: Array<UserPublic>;
};



export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};



export type WorkingHours = {
	id?: string | null;
	weekday: number;
	open: string;
	close: string;
	service_id: string | null;
};

