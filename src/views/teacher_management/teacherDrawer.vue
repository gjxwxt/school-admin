<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}教师`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="name" prop="teacher_name">
				<el-input v-model="drawerProps.rowData.teacher_name" placeholder="Please fill in teacher_name." clearable></el-input>
			</el-form-item>
			<el-form-item label="gender" prop="teacher_gender">
				<el-select v-model="drawerProps.rowData.teacher_gender" clearable placeholder="请选择">
					<el-option v-for="item in [{ value: '男' }, { value: '女' }]" :key="item.value" :label="item.value" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="category" prop="teacher_category">
				<el-select v-model="drawerProps.rowData.teacher_category" clearable placeholder="请选择">
					<el-option
						v-for="item in [{ value: '中教' }, { value: '外教' }]"
						:key="item.value"
						:label="item.value"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="contact way" prop="teacher_contact">
				<el-input
					v-model="drawerProps.rowData.teacher_contact"
					placeholder="Please fill in teacher_contact."
					clearable
				></el-input>
			</el-form-item>
			<el-form-item label="address" prop="teacher_address">
				<el-input
					v-model="drawerProps.rowData.teacher_address"
					placeholder="Please fill in teacher_address."
					clearable
				></el-input>
			</el-form-item>
			<el-form-item label="campus" prop="campus">
				<el-select v-model="drawerProps.rowData.campus" placeholder="所属校区">
					<el-option
						v-for="item in drawerProps.rowData.campusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="others" prop="others">
				<el-input v-model="drawerProps.rowData.others" placeholder="Please fill in address" clearable></el-input>
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

const rules = reactive({
	campus: [{ required: true, message: "请上传校区名称" }],
	address: [{ required: true, message: "请上传校区地址" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	week: number;
	assemblyTime: Date[];
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

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
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
