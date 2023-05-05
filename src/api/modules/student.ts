import { Student, classHour } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// * 新增学生
export const addStudent = (params: Student.StudentFormList) => {
	return http.post(PORT1 + `/student/add`, params);
};

// * 编辑学生
export const editStudent = (params: Student.StudentFormList) => {
	return http.post(PORT1 + `/student/edit`, params);
};

// * 删除学生
export const deleteStudent = (params: { id: string }) => {
	return http.post(PORT1 + `/student/delete`, params);
};

// * 获取学生列表
export const getStudentList = (params: Student.searchStudentForm) => {
	return http.post(PORT1 + `/student/search`, params);
};

export const getStudentListByClassId = (params: { class_id: number }) => {
	return http.post(PORT1 + `/student/getStudentByClassId`, params);
};

// * 课时操作 /classHour/operate
export const classHourOperate = (params: classHour.classHourOperateForm) => {
	return http.post(PORT1 + `/classHour/operate`, params);
};

// * 课时查询 /classHour/search
export const classHourSearch = (params: classHour.classHourSearchForm) => {
	return http.post(PORT1 + `/classHour/search`, params);
};

// * 上传学生id和图片地址到contract表中
export const uploadContract = (params: { student_id: number; img_url: string }) => {
	return http.post(PORT1 + `/student/uploadContract`, params);
};
// * 根据学生id获取合同图片地址
export const getContract = (params: { student_id: number }) => {
	return http.post(PORT1 + `/student/getContract`, params);
};
