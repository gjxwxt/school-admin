<template>
	<div class="card" style=" position: relative;height: 100%">
		<div style="padding: 5vh 2vw">
			<el-select
				v-model="campus"
				class="m-2"
				placeholder="所属校区"
				@change="campusChange"
				size="large"
				style="margin-right: 15px"
			>
				<el-option v-for="item in campusOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-input v-model="username" size="large" placeholder="输入用户名" style="width: 180px; margin-right: 12px"></el-input>
			<el-button size="large" :icon="Search" color="#409eff" plain @click="searchList()">Search</el-button>
			<el-button size="large" :icon="Plus" color="#409eff" plain @click="openDrawer('新增')">add</el-button>
		</div>
		<el-table :data="tableData" border :header-cell-style="{ background: '#F5F7FA', color: '#000' }">
			<el-table-column fixed prop="username" label="姓名" align="center" />
			<el-table-column prop="phone_number" label="手机号" align="center" />
			<el-table-column prop="create_time" label="注册时间" align="center" />
			<el-table-column prop="campus" label="所属校区" align="center" />
			<el-table-column prop="role" label="角色" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.role === 'admin'" style="color: white" color="#eccc68">管理员</el-tag>
					<el-tag v-if="scope.row.role === 'operator'" style="color: white" color="#6c5ce7">运营人员</el-tag>
					<el-tag v-if="scope.row.role === 'campus_operator'" style="color: white" color="#7bed9f">校区运营</el-tag>
					<el-tag v-if="scope.row.role === 'campus_admin'" style="color: white" color="#5352ed">校区管理</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="账号状态" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" disable-transitions>{{
						scope.row.status === 1 ? "正常" : "禁用"
					}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template #default="scope">
					<el-button link type="primary" size="small" @click="openDrawer('编辑', { ...scope.row })"> edit </el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 关键在page-size，一页多少条数据；total：一共多少数据 -->
		<div
			style="
				position: absolute;
				bottom: 50px;
				z-index: 1000;
				display: flex;
				flex-direction: row;
				justify-content: center;
				width: 100%;
			"
		>
			<el-pagination
				background
				layout="prev, pager, next"
				:total="total"
				v-model:currentPage="page"
				:page-size="7"
				@current-change="searchList"
			/>
		</div>
		<UserDrawer ref="drawerRef" @submit="searchList()" />
	</div>
</template>

<script setup lang="ts" name="accountManage">
import { onMounted, ref } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { editUser, getUserList } from "@/api/modules/user";
import { searchCampus } from "@/api/modules/schedule";
import { renderTime } from "@/utils/util";
import { GlobalStore } from "@/stores";
import UserDrawer from "./userDrawer.vue";
import { registerApi } from "@/api/modules/login";

const globalStore = GlobalStore();

onMounted(() => {
	getCampus();
});
// 页数和当前页
let total = ref(0);
let page = ref(1);

const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { campus: campus.value, ...rowData, campusOptions: campusOptions.value },
		isView: title === "查看",
		api: title === "新增" ? registerApi : title === "编辑" ? editUser : ""
	};
	drawerRef.value.acceptParams(params);
};

// 表格数据
let tableData = ref([]);

// 选择器,选择
let campus = ref("");
// 选择器,选择
let campusOptions = ref([]);

// 处理校区
const getCampus = () => {
	// 首先拿到当前账号的role，当作参数发送过去
	campusOptions.value.push({ value: "", label: "全部" });
	searchCampus({ role: globalStore.userInfo.roles[0] }).then(res => {
		res.data.forEach(item => {
			campusOptions.value.push({ value: item.campus, label: item.campus });
		});
		// 设置默认选项
		campus.value = campusOptions.value[0].value;
		searchList();
	});
};
const campusChange = () => {
	page.value = 1;
	searchList();
};

// 搜索按钮
let username = ref("");
const searchList = () => {
	getUserList({
		page: page.value,
		campus: campus.value,
		username: username.value
	}).then(res => {
		if (res.data.length) {
			total.value = res.data[0].total;
			res.data.forEach(item => {
				item.create_time = renderTime(item.create_time);
			});
			tableData.value = res.data;
		} else {
			total.value = 0;
			tableData.value = res.data;
		}
	});
};
</script>
