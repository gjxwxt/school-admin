<template>
	<!-- 扣课时，选中人进行扣，加课时呢，传两个不同接口即可，对于课时的修改需要记录，查课时记录的时候 -->
	<el-dialog v-model="dialogVisible" title="课时操作详情" :destroy-on-close="true" width="850px" draggable>
		<el-table
			:data="studentList"
			style="width: 100%; margin-bottom: 20px"
			border
			:header-cell-style="{ background: '#F5F7FA', color: '#000' }"
			ref="tableSelect"
		>
			<el-table-column prop="student_name" fixed="left" label="名字" width="70" align="center" />
			<el-table-column prop="class_name" label="所属班级" width="100" align="center" />
			<el-table-column prop="type" label="操作类型" header-align="center" align="center" min-width="90">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 1" :color="green" :style="white" size="small">扣课时</el-tag>
					<el-tag v-if="scope.row.type === 2" :color="red" :style="white" size="small">加课时</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="operate_num" label="数量" width="100" align="center" />
			<el-table-column prop="create_time" label="操作时间" width="150" align="center" />
			<el-table-column prop="operator" label="操作人员账号" width="150" align="center" />
			<el-table-column prop="remarks" label="备注" width="150" align="center" />
		</el-table>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="OperateClassHour">
import { ref } from "vue";
import { renderTime } from "@/utils/util";

const tableSelect = ref(null);
// 接收父组件传过来的参数class_id,去查询学生列表
let studentList = ref([]);
interface ClassHourParameterProps {
	params: number; // 父组件传过来的参数
	searchApi: (params: any) => Promise<any>; // 查询数据的api
}

// dialog状态
const dialogVisible = ref(false);
// 父组件传过来的参数
const parameter = ref<Partial<ClassHourParameterProps>>({});

// 接收父组件参数
const acceptParams = (params?: any): void => {
	parameter.value = params;
	dialogVisible.value = true;
	params.searchApi!({ student_id: params.params }).then((res: any) => {
		res.data.forEach((item: any) => {
			item.create_time = renderTime(item.create_time);
		});
		studentList.value = res.data;
	});
};

// 点击确定，首先判断是否有选择学生，然后判断是否有选择扣除数量，然后判断是否有备注
const submit = () => {
	dialogVisible.value = false;
};

defineExpose({
	acceptParams
});
</script>
