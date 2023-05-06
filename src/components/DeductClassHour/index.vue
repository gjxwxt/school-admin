<template>
	<!-- 扣课时，选中人进行扣，加课时呢，传两个不同接口即可，对于课时的修改需要记录，查课时记录的时候 -->
	<el-dialog v-model="dialogVisible" :title="`批量${parameter.title}`" :destroy-on-close="true" width="580px" draggable>
		<el-table
			:data="studentList"
			style="width: 100%; max-height: 300px; margin-bottom: 20px; overflow-x: hidden; overflow-y: auto"
			border
			ref="tableSelect"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50" :key="1"></el-table-column>
			<el-table-column prop="student_name" fixed="left" label="名字" width="70" align="center" />
			<el-table-column prop="class_name" label="所属班级" width="100" align="center" />
			<el-table-column prop="class_hour" label="剩余课时" width="100" align="center" />
			<el-table-column prop="init_class_hour" label="总课时" width="70" align="center" />
			<el-table-column prop="remarks" label="备注" width="150" align="center" />
		</el-table>
		<!--	输入操作备注	-->
		<el-form ref="form" label-width="80px">
			<el-form-item label="操作备注" prop="remarks">
				<el-input type="textarea" v-model="remarks" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item>
				<el-input v-model="operate_num" placeholder="请输入扣除数量" />
			</el-form-item>
			<el-form-item label="操作类型" v-if="parameter.title !== '扣课时'">
				<el-select v-model="operate_type" placeholder="请选择操作类型">
					<el-option label="扣课时" value="1" />
					<el-option label="加课时" value="2" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="OperateClassHour">
import { ref } from "vue";
// import { useDownload } from "@/hooks/useDownload";
// import { Download } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { GlobalStore } from "@/stores";

const tableSelect = ref(null);
// 接收父组件传过来的参数class_id,去查询学生列表
let studentList = ref([]);
interface ClassHourParameterProps {
	title: string; // 标题，添加还是扣课时
	params: number; // 父组件传过来的参数
	searchApi: (params: any) => Promise<any>; // 查询数据的api
	submitApi: (params: any) => Promise<any>; // 点击确定上传的api
	getTableList?: () => Promise<any>; // 获取表格数据的Api
}

// dialog状态
const dialogVisible = ref(false);
// 父组件传过来的参数
const parameter = ref<Partial<ClassHourParameterProps>>({});

// 操作类型选择 1为扣课时，其他为加课时
let operate_type = ref("1");

// 接收父组件参数
const acceptParams = (params?: any): void => {
	parameter.value = params;
	dialogVisible.value = true;
	params.searchApi!({ ...params.params }).then((res: any) => {
		studentList.value = res.data;
	});
};

// 拿到globalStore中的username
const globalStore = GlobalStore();
let username = globalStore.username;
let selectUser = [];
// 多选框选中的数据
const handleSelectionChange = (val: any): void => {
	selectUser = val;
};

// 选择扣除数量
let operate_num = ref(1);

// 点击确定，首先判断是否有选择学生，然后判断是否有选择扣除数量，然后判断是否有备注
const submit = () => {
	if (selectUser.length === 0) {
		ElNotification({
			title: "温馨提示",
			message: "请选择学生",
			type: "error"
		});
		return;
	}
	if (operate_num.value === null) {
		ElNotification({
			title: "温馨提示",
			message: "请选择扣除数量",
			type: "error"
		});
		return;
	}
	if (remarks.value === "") {
		ElNotification({
			title: "温馨提示",
			message: "请输入备注",
			type: "error"
		});
		return;
	}
	selectUser.forEach((item: any) => {
		item.remarks = remarks.value;
		item.type = parameter.value.title !== "扣课时" ? (operate_type.value == "1" ? 1 : 2) : 1;
		item.operate_num = Number(operate_num.value) || 0;
		item.operator = username;
		item.before_class_hour = Number(item.class_hour);
	});
	// console.log(selectUser);
	// 点击确定，上传数据
	parameter.value.submitApi!({ data: selectUser }).then((res: any) => {
		if (res.success) {
			ElNotification({
				title: "温馨提示",
				message: "操作成功",
				type: "success"
			});
			dialogVisible.value = false;
			selectUser = [];
		} else {
			ElNotification({
				title: "温馨提示",
				message: "操作失败",
				type: "error"
			});
		}
	});
};

// // 上传错误提示
// const excelUploadError = (): void => {
// 	ElNotification({
// 		title: "温馨提示",
// 		message: `批量添加${parameter.value.title}失败，请您重新上传！`,
// 		type: "error"
// 	});
// };
//
// // 上传成功提示
// const excelUploadSuccess = (): void => {
// 	ElNotification({
// 		title: "温馨提示",
// 		message: `批量添加${parameter.value.title}成功！`,
// 		type: "success"
// 	});
// };
let remarks = ref("正常上课");

defineExpose({
	acceptParams
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
