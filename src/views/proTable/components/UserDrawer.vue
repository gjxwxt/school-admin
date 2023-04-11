<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}学员`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="学员姓名" prop="username">
				<el-input v-model="drawerProps.rowData.username" placeholder="请填写学员姓名" clearable></el-input>
			</el-form-item>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="drawerProps.rowData.age" placeholder="请填写学员年龄" clearable></el-input>
			</el-form-item>
			<el-form-item label="校区" prop="campus">
				<el-input v-model="drawerProps.rowData.campus" placeholder="请填写身份证号" clearable></el-input>
			</el-form-item>
			<el-form-item label="班级" prop="className">
				<el-select v-model="drawerProps.rowData.className" placeholder="请选择班级" clearable>
					<el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="课时" prop="classHour">
				<el-input v-model="drawerProps.rowData.classHour" placeholder="请填写课时" clearable></el-input>
			</el-form-item>
			<el-form-item label="居住地址" prop="address">
				<el-input v-model="drawerProps.rowData.address" placeholder="请填写居住地址" clearable></el-input>
			</el-form-item>
			<el-form-item label="来源" prop="source">
				<el-input v-model="drawerProps.rowData.address" placeholder="请填写学生来源" clearable></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="phoneNumber">
				<el-input v-model="drawerProps.rowData.address" placeholder="请填写联系电话" clearable></el-input>
			</el-form-item>
			<el-form-item label="备用联系方式" prop="phoneNumber2">
				<el-input v-model="drawerProps.rowData.address" placeholder="请填写备用联系方式" clearable></el-input>
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
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
	avatar: [{ required: true, message: "请上传用户头像" }],
	photo: [{ required: true, message: "请上传用户照片" }],
	username: [{ required: true, message: "请填写用户姓名" }],
	gender: [{ required: true, message: "请选择性别" }],
	idCard: [{ required: true, message: "请填写身份证号" }],
	email: [{ required: true, message: "请填写邮箱" }],
	address: [{ required: true, message: "请填写居住地址" }]
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

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerProps.value.api!(drawerProps.value.rowData);
			ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
			drawerProps.value.getTableList!();
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
