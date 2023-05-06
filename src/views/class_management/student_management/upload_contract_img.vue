<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" title="上传合同">
		<el-form label-width="100px" label-suffix=" :" :model="fromModel" ref="ruleFormRef">
			<el-form-item label="合同照片" prop="avatar">
				<UploadImg v-model:imageUrl="fromModel.contract_img" width="135px" height="135px" :file-size="3">
					<template #empty>
						<el-icon><Avatar /></el-icon>
						<span>请上传合同照片</span>
					</template>
					<template #tip> 图片大小不能超过 3M </template>
				</UploadImg>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitForm">确 定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, watch } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { ElNotification } from "element-plus";
import { uploadContract } from "@/api/modules/student";

const fromModel = ref({
	contract_img: ""
});

interface DrawerProps {
	title: string;
	isView: boolean;
	student_id: number;
}

// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
};

const ruleFormRef = ref();
const submitForm = (): void => {
	ruleFormRef.value.validate((valid: boolean) => {
		if (valid) {
			// 上传合同,将图片地址和学生id传给后台
			uploadContract({ student_id: drawerProps.value.student_id, img_url: fromModel.value.contract_img }).then(res => {
				if (res.success) {
					ElNotification({
						title: "提示",
						message: "上传成功",
						type: "success"
					});
					drawerVisible.value = false;
					fromModel.value.contract_img = "";
				} else {
					ElNotification({
						title: "提示",
						message: "上传失败",
						type: "error"
					});
				}
			});
		} else {
			ElNotification({
				title: "提示",
				message: "请完善信息",
				type: "warning"
			});
			return false;
		}
	});
};
watch(
	() => drawerVisible.value,
	val => {
		if (!val) {
			fromModel.value.contract_img = "";
		}
	}
);
defineExpose({
	acceptParams
});
</script>
