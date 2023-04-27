<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}课程`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="Class Time" prop="time">
				<el-time-picker
					is-range
					v-model="drawerProps.rowData.time"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					placeholder="选择时间范围"
				>
				</el-time-picker>
			</el-form-item>
			<el-form-item label="Class No." prop="classes">
				<el-select v-model="drawerProps.rowData.classes" placeholder="Please fill in Class No." @change="classSure">
					<el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="中教" prop="teacher1">
				<el-select v-model="drawerProps.rowData.teacher1" placeholder="选择中教">
					<el-option v-for="item in teacher1Options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="外教" prop="teacher2">
				<el-select v-model="drawerProps.rowData.teacher2" placeholder="选择外教">
					<el-option v-for="item in teacher2Options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="Content" prop="content">
				<el-input v-model="drawerProps.rowData.content" placeholder="Please fill in Content" clearable></el-input>
			</el-form-item>
			<el-form-item label="Classroom" prop="classroom">
				<el-select v-model="drawerProps.rowData.classroom" placeholder="Please fill in Classroom">
					<el-option v-for="item in classroomOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="更新点读包" prop="updatePRPackage">
				<el-input v-model="drawerProps.rowData.updatePRPackage" placeholder="Please fill in " clearable></el-input>
			</el-form-item>
			<el-form-item label="remark">
				<el-input v-model="drawerProps.rowData.remarks" placeholder="Please fill in remark" clearable></el-input>
			</el-form-item>
			<el-form-item label="试听班额">
				<el-input v-model="drawerProps.rowData.auditions_num" placeholder="Please fill in auditions_num" clearable></el-input>
			</el-form-item>
			<el-form-item label="试听年龄段">
				<el-input v-model="drawerProps.rowData.age_range" placeholder="Please fill in age~age" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { searchClassName, searchClassRoom, searchTeacherByCategory } from "@/api/modules/schedule";

const rules = reactive({
	classes: [{ required: true, message: "请填写班级" }],
	classroom: [{ required: true, message: "请填写教室" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	week?: number;
	assemblyTime?: Date[];
	rowData?: any;
	api?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}
// 日期选择器
// let time = ref([new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]);
// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false,
	title: ""
});

let classOptions = ref([]);
// 获取老师列表
let teacher1Options = ref([]);
let teacher2Options = ref([]);
let classroomOptions = ref([]);
const classSure = e => {
	let res = classOptions.value.find(item => {
		return item.label === e;
	});
	drawerProps.value.rowData.teacher1 = res.teacher1;
	drawerProps.value.rowData.teacher2 = res.teacher2;
	drawerProps.value.rowData.class_id = res.class_id;
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	let time = new Date(2023, 4, 10, 8, 0);
	params.rowData.time = params.rowData.time ? params.rowData.time : [time, time];
	drawerProps.value = params;
	drawerVisible.value = true;
	searchClassName({ campus: params.rowData.campus }).then(res => {
		classOptions.value = [];
		res.data.forEach(item => {
			classOptions.value.push({
				value: item.class_name,
				label: item.class_name,
				teacher1: item.teacher1_name,
				teacher2: item.teacher2_name,
				class_id: item.class_id
			});
		});
	});
	searchTeacherByCategory({ teacher_category: "中教", campus: params.rowData.campus }).then(res => {
		teacher1Options.value = [];
		res.data.forEach(item => {
			teacher1Options.value.push({ value: item.teacher_name, label: item.teacher_name });
		});
	});
	searchTeacherByCategory({ teacher_category: "外教", campus: params.rowData.campus }).then(res => {
		teacher2Options.value = [];
		res.data.forEach(item => {
			teacher2Options.value.push({ value: item.teacher_name, label: item.teacher_name });
		});
	});
	searchClassRoom({ campus: params.rowData.campus }).then(res => {
		classroomOptions.value = [];
		res.data.forEach(item => {
			classroomOptions.value.push({ value: item.classroom, label: item.classroom });
		});
	});
};
const emit = defineEmits(["submit"]); //注册
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			let startTime = drawerProps.value.rowData.assemblyTime[0];
			let time1 = drawerProps.value.rowData.time[0];
			let time2 = drawerProps.value.rowData.time[1];
			let plus = drawerProps.value.rowData.weeks === 0 ? 6 : drawerProps.value.rowData.weeks - 1;
			// 拿到周一0点的时间戳，直接根据周几和具体时间，增加时间戳即可
			drawerProps.value.rowData.startTime = startTime + plus * 86400000 + time1.getHours() * 3600000 + time1.getMinutes() * 60000;
			drawerProps.value.rowData.endTime = startTime + plus * 86400000 + time2.getHours() * 3600000 + time2.getMinutes() * 60000;
			await drawerProps.value.api!(drawerProps.value.rowData);
			ElMessage.success({ message: `success！` });
			emit("submit");
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

defineExpose({
	acceptParams
});
</script>
