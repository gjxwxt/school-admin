<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
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
			<el-form-item label="用户名" prop="username">
				<el-input v-model="drawerProps.rowData.username" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号（用于登录）" prop="phone_number">
				<el-input v-model="drawerProps.rowData.phone_number" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" v-if="drawerProps.title === '新增'">
				<el-input v-model="drawerProps.rowData.password" show-password clearable></el-input>
			</el-form-item>
			<el-form-item label="角色" prop="role">
				<el-select v-model="drawerProps.rowData.role" placeholder="所属角色">
					<el-option
						v-for="item in [
							{ label: '管理员', value: 'admin' },
							{ label: '运营管理员', value: 'operator' },
							{ label: '校区管理员', value: 'campus_admin' },
							{ label: '校区运营', value: 'campus_operator' }
						]"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="账号状态" prop="status">
				<el-select v-model="drawerProps.rowData.status">
					<el-option
						v-for="item in [
							{ label: '正常', value: 1 },
							{ label: '禁用', value: 0 }
						]"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
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
import md5 from "js-md5";

const rules = reactive({
	phone_number: [{ required: true, message: "请上传手机号" }]
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
		if (
			drawerProps.value.rowData.role === "campus_admin" ||
			(drawerProps.value.rowData.role === "campus_operator" && !drawerProps.value.rowData.campus)
		) {
			ElMessage.warning({ message: `请选择所属校区！` });
			return;
		}
		try {
			let data = drawerProps.value.rowData;
			let params = {
				username: data.username,
				phone_number: data.phone_number,
				password: md5(data.password),
				role: data.role,
				status: data.status,
				campus: data.campus
			};
			if (drawerProps.value.title === "编辑") {
				params.password = undefined;
				params.id = data.id;
			}
			await drawerProps.value.api!(params);
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
