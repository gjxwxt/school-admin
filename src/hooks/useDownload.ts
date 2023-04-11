import { ElNotification } from "element-plus";
import { writeFile, utils } from "xlsx";
/**
 * @description 接收数据流生成blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法(必传)
 * @param {String} tempName 导出的文件名(必传)
 * @param {Object} params 导出的参数(默认为空对象)
 * @param {Boolean} isArray 是否是数组格式(默认为false，即二进制格式)
 * @param {Boolean} isNotify 是否有导出消息提示(默认为 true)
 * @param {String} fileType 导出的文件格式(默认为.xlsx)
 * @return void
 * */

export const useDownload = async (
	api: (param: any) => Promise<any>,
	tempName: string,
	isArray: boolean = false,
	params: any = {},
	isNotify: boolean = true,
	fileType: string = ".xlsx"
) => {
	// 将数组形式的data转换成excel
	const createExcel = data => {
		//转化data数组
		const ws = utils.json_to_sheet(data); //先转化为sheet对象
		const wb = utils.book_new(); // 创建一个book，也就是一个execl文件
		utils.book_append_sheet(wb, ws, "sheet1"); //将sheet对象放入该book中，也就是一页，默认的sheet名为Sheet1
		writeFile(wb, `${tempName}.${fileType}`); // 下载出来，文件名为test1.xlsx
	};
	if (isNotify) {
		ElNotification({
			title: "温馨提示",
			message: "如果数据庞大会导致下载缓慢哦，请您耐心等待！",
			type: "info",
			duration: 3000
		});
	}
	try {
		if (isArray) {
			const res = await api(params);
			createExcel(res?.data);
			return;
		} else {
			const res = await api(params);
			const blob = new Blob([res], {
				type: "application/vnd.ms-excel;charset=UTF-8"
			});
			// 兼容 edge 不支持 createObjectURL 方法
			if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
			const blobUrl = window.URL.createObjectURL(blob);
			const exportFile = document.createElement("a");
			exportFile.style.display = "none";
			exportFile.download = `${tempName}${fileType}`;
			exportFile.href = blobUrl;
			document.body.appendChild(exportFile);
			exportFile.click();
			// 去除下载对 url 的影响
			document.body.removeChild(exportFile);
			window.URL.revokeObjectURL(blobUrl);
		}
	} catch (error) {
		console.log(error);
	}
};
