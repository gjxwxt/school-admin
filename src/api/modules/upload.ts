import { Upload } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// * 图片上传
export const uploadImg = (params: FormData) => {
	return http.post<Upload.ResFileUrl>(PORT1 + `upload`, params, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};

// * 视频上传
export const uploadVideo = (params: FormData) => {
	return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params);
};

// * 文件上传,二进制格式
export const uploadExcel = params => {
	return http.post(PORT1 + `/file/upload/excel`, params, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};
