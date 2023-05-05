<template>
	<div class="card" style="height: 100%">
		<div style="padding: 5vh 2vw">
			<el-button size="large" :icon="Plus" color="#409eff" plain @click="openDrawer('新增')">新增校区</el-button>
		</div>
		<el-table
			:data="tableData"
			style="width: 100%"
			refs="schedule"
			border
			:header-cell-style="{ background: '#F5F7FA', color: '#000' }"
		>
			<el-table-column prop="campus" label="校区名" width="150" align="center" />
			<el-table-column prop="address" label="地址" align="center" />
			<el-table-column fixed="right" label="操作" width="200" align="center">
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
		<CampusDrawer ref="drawerRef" @submit="getCampus()" />
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";
import { addCampus, deleteCampus, editCampus, searchCampus } from "@/api/modules/schedule";
import CampusDrawer from "./campusDrawer.vue";
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

const getCampus = () => {
	searchCampus({ role: globalStore.userInfo.roles }).then(res => {
		tableData.value = res.data;
	});
};

// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteCampus, { id: [params.id] }, `删除当前校区`);
	getCampus();
};
// 侧边栏
const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		api: title === "新增" ? addCampus : title === "编辑" ? editCampus : ""
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
