<template>
	<el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
		<el-form label-width="100px" label-suffix=" :" :rules="rules" :model="form" ref="ruleFormRef">
			<el-form-item label="旧密码" prop="oldPassword">
				<el-input v-model="form.oldPassword" show-password clearable></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="form.newPassword" show-password clearable></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPassword">
				<el-input v-model="form.confirmPassword" show-password clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit()">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
const dialogVisible = ref(false);
import { ElMessage } from "element-plus";
import md5 from "js-md5";
import { changeUserPassword } from "@/api/modules/user";

let form = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: ""
});
// rules，判断新密码和确认密码是否一致
const rules = {
	oldPassword: [
		{ required: true, message: "请输入旧密码", trigger: "blur" },
		{ min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
	],
	newPassword: [
		{ required: true, message: "请输入新密码", trigger: "blur" },
		{ min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
	],
	confirmPassword: [
		{ required: true, message: "请再次输入新密码", trigger: "blur" },
		{ min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
	]
};
// handleSubmit
const ruleFormRef = ref();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		if (form.newPassword !== form.confirmPassword) {
			ElMessage.error("新密码和确认密码不一致");
			return;
		}
		try {
			let data = form;
			let params = {
				oldPassword: md5(data.oldPassword),
				newPassword: md5(data.newPassword)
			};
			changeUserPassword(params)
				.then(res => {
					if (res.data.message === "旧密码错误") {
						ElMessage.error("旧密码错误");
						return;
					} else if (res.data.message === "操作成功") {
						ElMessage.success("修改成功");
						dialogVisible.value = false;
					} else {
						ElMessage.error("修改失败");
						return;
					}
				})
				.catch(err => {
					console.log(err);
				});
			// dialogVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};
// openDialog
const openDialog = () => {
	dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
