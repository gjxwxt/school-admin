<template>
	<el-dialog v-model="dialogVisible" title="合同详情" :destroy-on-close="true" width="450px" draggable>
		<div style=" display: flex; flex-direction: row; justify-content: center;width: 100%">
			<el-image style="width: 400px; height: 400px" :src="imgUrl" :preview-src-list="[imgUrl]"> </el-image>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="OperateClassHour">
import { ref } from "vue";
import { getContract } from "@/api/modules/student";

interface ClassHourParameterProps {
	student_id: string;
}

// dialog状态
const dialogVisible = ref(false);
// 父组件传过来的参数
const parameter = ref<Partial<ClassHourParameterProps>>({});
// 图片地址
let imgUrl = ref("");

// 接收父组件参数
const acceptParams = (params?: any): void => {
	parameter.value = params;
	dialogVisible.value = true;
	getContract({ student_id: params.student_id }).then((res: any) => {
		imgUrl.value = res.data.contract_img;
	});
};

// 点击确定，首先判断是否有选择学生，然后判断是否有选择扣除数量，然后判断是否有备注
const submit = () => {
	dialogVisible.value = false;
	imgUrl.value = "";
};

defineExpose({
	acceptParams
});
</script>
