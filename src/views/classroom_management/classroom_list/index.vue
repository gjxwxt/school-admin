<template>
	<div class="card" style="height: 100%">
		<div style="display: flex; flex-direction: row; padding: 5vh 2vw">
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
			<el-input v-model="classroom" size="large" placeholder="输入教室名" style="width: 180px; margin-right: 12px"></el-input>
			<el-button size="large" :icon="Search" color="#409eff" plain @click="searchClassRoomByName">搜索</el-button>
			<el-button size="large" :icon="Plus" color="#409eff" plain @click="openDrawer('新增')">添加新教室</el-button>
		</div>
		<el-table
			:data="tableData"
			style="width: 100%; max-height: 400px; margin-bottom: 20px; overflow-x: hidden; overflow-y: auto"
			refs="schedule"
			border
			:header-cell-style="{ background: '#F5F7FA', color: '#000' }"
		>
			<el-table-column prop="classroom" label="教室名" align="center" />
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
		<CampusDrawer ref="drawerRef" @submit="searchList()" />
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Delete, EditPen, Plus, Search } from "@element-plus/icons-vue";
import { addClassRoom, deleteClassRoom, editClassRoom, searchClassRoom, searchCampus } from "@/api/modules/schedule";
import CampusDrawer from "./ClassRoomDrawer.vue";
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
// 获取教室列表
const searchList = () => {
	searchClassRoom({ campus: campus.value }).then(res => {
		tableData.value = res.data;
	});
};

// 主动搜索某个教室
let classroom = ref("");
const searchClassRoomByName = () => {
	searchClassRoom({ campus: campus.value, classroom: classroom.value }).then(res => {
		tableData.value = res.data;
	});
};

// 选择器,选择
let campus = ref("");
let campusOptions = ref([]);
const campusChange = () => {
	searchList();
};
// 处理校区
const getCampus = () => {
	// 首先拿到当前账号的role，当作参数发送过去
	searchCampus({ role: globalStore.userInfo.roles[0] }).then(res => {
		res.data.forEach(item => {
			campusOptions.value.push({ value: item.campus, label: item.campus });
		});
		// 设置默认选项
		campus.value = campusOptions.value[0].value;
		searchList();
	});
};

// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteClassRoom, { id: [params.id] }, `删除当前教室`);
	searchList();
};
// 侧边栏
const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { campus: campus.value, ...rowData, campusOptions: campusOptions.value },
		isView: title === "查看",
		api: title === "新增" ? addClassRoom : title === "编辑" ? editClassRoom : ""
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
