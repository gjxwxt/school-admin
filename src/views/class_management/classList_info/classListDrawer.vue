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
			<el-form-item label="class_name" prop="class_name">
				<el-input v-model="drawerProps.rowData.class_name" placeholder="Please fill in class_name." clearable></el-input>
			</el-form-item>
			<el-form-item label="中教">
				<el-select v-model="drawerProps.rowData.teacher1_name" placeholder="选择中教" @change="t1change">
					<el-option v-for="item in teacher1Options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="中教联系方式">
				<el-input
					v-model="drawerProps.rowData.teacher1_contact"
					placeholder="Please fill in chinese_teacher_contact."
					clearable
				></el-input>
			</el-form-item>
			<el-form-item label="外教">
				<el-select v-model="drawerProps.rowData.teacher2_name" placeholder="选择外教" @change="t2change">
					<el-option v-for="item in teacher2Options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="外教联系方式">
				<el-input
					v-model="drawerProps.rowData.teacher2_contact"
					placeholder="Please fill in foreign_teacher_contact."
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
			<el-form-item label="备注" prop="others">
				<el-input v-model="drawerProps.rowData.others" placeholder="Please fill in others" clearable></el-input>
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
import { searchTeacherByCategory } from "@/api/modules/schedule";

const rules = reactive({
	campus: [{ required: true, message: "请上传校区名称" }]
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

// 获取老师列表
let teacher1Options = ref([]);
let teacher2Options = ref([]);

// 老师选择完，自动填上联系方式
const t1change = e => {
	let obj = teacher1Options.value.find(item => {
		return item.label == e;
	});
	drawerProps.value.rowData.teacher1_contact = obj.contact;
};
const t2change = e => {
	let obj = teacher2Options.value.find(item => {
		return item.label == e;
	});
	drawerProps.value.rowData.teacher2_contact = obj.contact;
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
	searchTeacherByCategory({ teacher_category: "中教", campus: params.rowData.campus }).then(res => {
		teacher1Options.value = [];
		res.data.forEach(item => {
			teacher1Options.value.push({ value: item.teacher_name, label: item.teacher_name, contact: item.teacher_contact });
		});
	});
	searchTeacherByCategory({ teacher_category: "外教", campus: params.rowData.campus }).then(res => {
		teacher2Options.value = [];
		res.data.forEach(item => {
			teacher2Options.value.push({ value: item.teacher_name, label: item.teacher_name, contact: item.teacher_contact });
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
