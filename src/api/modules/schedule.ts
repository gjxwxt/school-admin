import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 课程管理模块
 */
// * 获取课程列表
export const getSchedule = params => {
	return http.post(PORT1 + `/schedule/search`, params);
};
// * 获取某一天课程
export const getOneDaySchedule = params => {
	return http.post(PORT1 + `/schedule/searchOneDay`, params);
};
// * 新增课程
export const addSchedule = params => {
	return http.post(PORT1 + `/schedule/addNews`, params);
};

// * 批量导入上周课程
export const useLastSchedule = params => {
	return http.post(PORT1 + `/schedule/batch`, params);
};

// * 编辑课程
export const editSchedule = (params: { id: string }) => {
	return http.post(PORT1 + `/schedule/edit`, params);
};

// * 删除课程
export const deleteSchedule = (params: { id: string[] }) => {
	return http.post(PORT1 + `/schedule/delete`, params);
};

// * 打印当前周课表
export const getOneWeekSchedule = params => {
	return http.post(PORT1 + `/schedule/export`, params);
};

// 下载课程表模板
export const getExcelTemplate = params => {
	return http.post(PORT1 + `/schedule/getExcelTemplate`, params, {
		responseType: "blob",
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};

// 获取校区
export const searchCampus = params => {
	return http.post(PORT1 + `/campus/search`, params);
};

export const addCampus = params => {
	return http.post(PORT1 + `/campus/addCampus`, params);
};

export const editCampus = params => {
	return http.post(PORT1 + `/campus/edit`, params);
};

export const deleteCampus = (params: { id: string[] }) => {
	return http.post(PORT1 + `/campus/delete`, params);
};

// 获取教室
export const searchClassRoom = params => {
	return http.post(PORT1 + `/classroom/search`, params);
};

export const addClassRoom = params => {
	return http.post(PORT1 + `/classroom/add`, params);
};

export const editClassRoom = params => {
	return http.post(PORT1 + `/classroom/edit`, params);
};

export const deleteClassRoom = (params: { id: string[] }) => {
	return http.post(PORT1 + `/classroom/delete`, params);
};

// 获取教师
export const searchTeacher = params => {
	return http.post(PORT1 + `/teacher/search`, params);
};

export const searchTeacherByCategory = params => {
	return http.post(PORT1 + `/teacher/searchTeacherByCategory`, params);
};

export const addTeacher = params => {
	return http.post(PORT1 + `/teacher/add`, params);
};

export const editTeacher = params => {
	return http.post(PORT1 + `/teacher/edit`, params);
};

export const deleteTeacher = (params: { id: string[] }) => {
	return http.post(PORT1 + `/teacher/delete`, params);
};
// 获取班级info
export const searchClassMangage = params => {
	return http.post(PORT1 + `/classManage/search`, params);
};

export const searchClassName = params => {
	return http.post(PORT1 + `/classManage/searchName`, params);
};

export const addClassMangage = params => {
	return http.post(PORT1 + `/classManage/add`, params);
};

export const editClassMangage = params => {
	return http.post(PORT1 + `/classManage/edit`, params);
};

export const deleteClassMangage = (params: { id: string[] }) => {
	return http.post(PORT1 + `/classManage/delete`, params);
};
// 试听课接口
export const addAuditiontable = params => {
	return http.post(PORT1 + `/auditiontable/add`, params);
};
export const searchAuditiontable = params => {
	return http.post(PORT1 + `/auditiontable/search`, params);
};
export const editAuditiontable = params => {
	return http.post(PORT1 + `/auditiontable/edit`, params);
};
export const deleteAuditiontable = (params: { id: string[] }) => {
	return http.post(PORT1 + `/auditiontable/delete`, params);
};
// 计算试听课各种率
export const countRatio = params => {
	return http.post(PORT1 + `/auditiontable/countRatio`, params);
};
