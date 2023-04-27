<template>
	<div class="card" style="height: 100%">
		<div style="padding: 5vh 2vw">
			<el-select
				v-model="campus"
				@change="campusChange"
				class="m-2"
				placeholder="所属校区"
				size="large"
				style="margin-right: 15px"
			>
				<el-option v-for="item in campusOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-select
				v-model="teacher_category"
				@change="teacherChange"
				class="m-2"
				placeholder="教师类别"
				size="large"
				style="margin-right: 15px"
			>
				<el-option
					v-for="item in [
						{ label: '中教', value: 1 },
						{ label: '外教', value: 2 }
					]"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
			<el-button size="large" :icon="Delete" color="#409eff" plain @click="clear()">清空类别</el-button>
			<el-button size="large" :icon="Plus" color="#409eff" plain @click="openDrawer('新增')">TeacherAdd</el-button>
		</div>
		<el-table
			border
			:header-cell-style="{ background: '#F5F7FA', color: '#000' }"
			:data="tableData"
			style="width: 100%"
			refs="schedule"
		>
			<el-table-column prop="teacher_name" label="teacher_name" width="150" align="center" />
			<el-table-column prop="teacher_gender" label="teacher_gender" align="center" />
			<el-table-column prop="teacher_category" label="teacher_category" align="center" />
			<el-table-column prop="teacher_contact" label="teacher_contact" align="center" />
			<el-table-column prop="teacher_address" label="teacher_address" align="center" />
			<el-table-column prop="campus" label="campus" align="center" />
			<el-table-column prop="others" label="others" align="center" />
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template #default="scope">
					<el-button
						link
						type="primary"
						v-if="BUTTONS.edit"
						:icon="EditPen"
						size="small"
						@click="openDrawer('编辑', { ...scope.row })"
						>Edit</el-button
					>
					<el-button type="primary" link :icon="Delete" v-if="BUTTONS.delete" @click="deleteAccount(scope.row)">remove</el-button>
				</template>
			</el-table-column>
		</el-table>
		<TeacherDrawer ref="drawerRef" @submit="searchList()" />
	</div>
</template>
<script setup lang="ts">
/*详细信息teacher_id，姓名teacher_name， 性别teacher_gender，教师类别（分为中教和外教）teacher_category，
联系方式teacher_contact，住址teacher_address，校区campus，备注others*/
import { onMounted, ref } from "vue";
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";
import { addTeacher, deleteTeacher, editTeacher, searchCampus, searchTeacher } from "@/api/modules/schedule";
import TeacherDrawer from "./teacherDrawer.vue";
import { GlobalStore } from "@/stores";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
const { BUTTONS } = useAuthButtons();

const globalStore = GlobalStore();
let tableData = ref([]);

// 搜索校区信息
onMounted(() => {
	getCampus();
});

// 选择器,选择
let campus = ref("");
let campusOptions = ref([]);
const campusChange = () => {
	searchList();
};
const getCampus = () => {
	searchCampus({ role: globalStore.userInfo.roles[0] }).then(res => {
		res.data.forEach(item => {
			campusOptions.value.push({ value: item.campus, label: item.campus });
		});
		campus.value = campusOptions.value[0].value;
		searchList();
	});
};
// 教师类别
let teacher_category = ref(null);
const teacherChange = () => {
	searchList();
};
// 清空类别
const clear = () => {
	if (teacher_category.value) {
		teacher_category.value = undefined;
		searchList();
	}
};
// 搜索教师信息
const searchList = () => {
	searchTeacher({ campus: campus.value, type: teacher_category.value }).then(res => {
		tableData.value = res.data;
	});
};
// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteTeacher, { id: [params.id] }, `删除当前教师`);
	getCampus();
};
// 侧边栏
const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { campus: campus.value, ...rowData, campusOptions: campusOptions.value },
		isView: title === "查看",
		api: title === "新增" ? addTeacher : title === "编辑" ? editTeacher : ""
	};
	drawerRef.value.acceptParams(params);
};
</script>

<style lang="scss">
.bottom_box {
	margin-top: 50px;
	ul {
		display: flex;
		flex-direction: row;
		list-style: none;
		li {
			margin-right: 10px;
		}
	}
}
</style>
