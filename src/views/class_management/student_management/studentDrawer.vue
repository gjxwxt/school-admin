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
			<el-form-item label="所属班级" prop="class_name">
				<el-select v-model="drawerProps.rowData.class_name" @change="classSure">
					<el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="姓名" prop="student_name">
				<el-input v-model="drawerProps.rowData.student_name" clearable></el-input>
			</el-form-item>
			<el-form-item label="年龄">
				<el-input v-model="drawerProps.rowData.student_age" clearable></el-input>
			</el-form-item>
			<el-form-item label="联系方式">
				<el-input v-model="drawerProps.rowData.student_contact" clearable></el-input>
			</el-form-item>
			<el-form-item label="课时" prop="class_hour">
				<el-input v-model="drawerProps.rowData.class_hour" clearable></el-input>
			</el-form-item>
			<el-form-item label="来源">
				<el-input v-model="drawerProps.rowData.student_source" clearable></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="drawerProps.rowData.remarks" clearable></el-input>
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
import { searchClassMangage } from "@/api/modules/schedule";

const rules = reactive({
	class_name: [{ required: true, message: "请填写班级" }],
	student_name: [{ required: true, message: "请填写姓名" }],
	class_hour: [{ required: true, message: "请填写课时" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: any;
	api?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}
// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false,
	title: ""
});

let classOptions = ref([]);
const classSure = e => {
	let res = classOptions.value.find(item => {
		return item.label === e;
	});
	drawerProps.value.rowData.class_id = res.id;
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
	searchClassMangage({ campus: params.rowData.campus }).then(res => {
		classOptions.value = [];
		res.data.forEach(item => {
			classOptions.value.push({
				value: item.class_name,
				label: item.class_name,
				id: item.class_id
			});
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
