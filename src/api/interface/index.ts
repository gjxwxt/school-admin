// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data: T;
}

// * 分页响应参数
export interface ResPage<T> {
	list: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum?: number;
	pageSize?: number;
}

// * 文件上传模块
export namespace Upload {
	export interface ResFileUrl {
		fileUrl: string;
	}
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
	}
	export interface ResLogin {
		access_token: string;
		role: string;
		username: string;
		phone_number: string;
	}
	export interface ResAuthButtons {
		[key: string]: string[];
	}
	export interface ReqRegisterForm {
		username: string;
		phoneNumber: string;
		password: string;
		role: string;
		campus: string;
	}
	export interface ReqSearchUser {
		username?: string;
		campus: string;
	}
}

// * 学生管理模块
export namespace Student {
	export interface StudentFormList {
		student_name: string;
		student_age: number;
		class_id: string;
		class_name: string;
		class_hour: number;
		student_contact: string;
		student_source: string;
		campus: string;
		remarks: string;
	}
	export interface searchStudentForm {
		student_name?: string;
		class_name?: string;
		campus: string;
		page: number;
	}
}
// * 课时管理模块
export namespace classHour {
	// class_id, student_id, student_name, type, operate_num, before_class_hour, remarks, operator
	export interface classHourOperateForm {
		campus: string;
		student_id: number;
		student_name: string;
		class_id: number;
		class_name: string;
		class_hour: number;
		remarks: string;
		type: number;
		operate_num: number;
		before_class_hour: number;
		operator: string;
	}
	export interface classHourSearchForm {
		student_id: string;
		page: number;
	}
}
// * 用户管理模块
export namespace User {
	export interface ReqUserParams extends ReqPage {
		page?: number;
		username: string;
		campus?: string;
		gender?: number;
		idCard?: string;
		email?: string;
		address?: string;
		createTime?: string[];
		status?: number;
	}
	export interface ResUserList {
		id: string;
		username: string;
		gender: string;
		user: {
			detail: {
				age: number;
			};
		};
		idCard: string;
		email: string;
		address: string;
		createTime: string;
		status: number;
		avatar: string;
		children?: ResUserList[];
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
	export interface ResGender {
		genderLabel: string;
		genderValue: number;
	}
	export interface ResDepartment {
		id: string;
		name: string;
		children?: ResDepartment[];
	}
	export interface ResRole {
		id: string;
		name: string;
		children?: ResDepartment[];
	}
}
