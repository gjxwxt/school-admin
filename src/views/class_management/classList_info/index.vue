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
			<el-input v-model="className" size="large" placeholder="输入班级名" style="width: 180px; margin-right: 12px"></el-input>
			<el-button size="large" :icon="Search" color="#409eff" plain @click="searchClassByName">Search</el-button>
			<el-button size="large" :icon="Plus" color="#409eff" plain @click="openDrawer('新增')">ClassAdd</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%" refs="schedule">
			<el-table-column prop="class_name" label="class_name" width="150" align="center" />
			<el-table-column prop="teacher1_name" label="中教" align="center" />
			<el-table-column prop="teacher1_contact" label="中教联系方式" align="center" />
			<el-table-column prop="teacher2_name" label="外教" align="center" />
			<el-table-column prop="teacher2_contact" label="外教联系方式" align="center" />
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
		<ClassListDrawer ref="drawerRef" @submit="searchList()" />
	</div>
</template>
<script setup lang="ts">
/*详细信息teacher_id，姓名teacher_name， 性别teacher_gender，教师类别（分为中教和外教）teacher_category，
联系方式teacher_contact，住址teacher_address，校区campus，备注others*/
import { onMounted, ref } from "vue";
import { Delete, EditPen, Plus, Search } from "@element-plus/icons-vue";
import { addClassMangage, deleteClassMangage, editClassMangage, searchCampus, searchClassMangage } from "@/api/modules/schedule";
import ClassListDrawer from "./classListDrawer.vue";
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
const searchList = () => {
	searchClassMangage({ campus: campus.value, class_name: className.value }).then(res => {
		tableData.value = res.data;
	});
};
// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteClassMangage, { class_id: [params.class_id] }, `删除当前班级`);
	getCampus();
};
// 侧边栏
const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { campus: campus.value, ...rowData, campusOptions: campusOptions.value },
		isView: title === "查看",
		api: title === "新增" ? addClassMangage : title === "编辑" ? editClassMangage : ""
	};
	drawerRef.value.acceptParams(params);
};

// 如果搜索框中搜索具体班级
let className = ref("");
const searchClassByName = () => {
	searchClassMangage({ campus: campus.value, class_name: className.value }).then(res => {
		tableData.value = res.data;
	});
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
