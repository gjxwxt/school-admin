<template>
	<div class="card content-box">
		<div style="padding: 5vh 2vw">
			<el-select v-model="campus" class="m-2" placeholder="所属校区" size="large" style="margin-right: 15px">
				<el-option v-for="item in campusOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-select v-model="role" class="m-2" placeholder="人员角色" size="large" style="margin-right: 15px">
				<el-option v-for="item in campusOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-select v-model="className" class="m-2" placeholder="所属班级" size="large" style="margin-right: 15px">
				<el-option v-for="item in campusOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-button size="large" :icon="Search" color="#409eff" round plain @click="searchList()">Search</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column fixed prop="name" label="姓名" width="150" align="center" />
			<el-table-column prop="phoneNumber" label="手机号" width="150" align="center" />
			<el-table-column prop="date" label="注册时间" width="150" align="center" />
			<el-table-column prop="campus" label="所属校区" width="150" align="center" />
			<el-table-column prop="class" label="所属班级" width="150" align="center" />
			<el-table-column prop="role" label="角色" width="150" align="center" />
			<el-table-column prop="state" label="账号状态" width="150" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.tag === '正常使用' ? 'success' : ''" disable-transitions>{{ scope.row.tag }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template #default>
					<el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
					<el-button link type="primary" size="small">Edit</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 关键在page-size，一页多少条数据；total：一共多少数据 -->
		<el-pagination
			class=""
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:small="small"
			:disabled="disabled"
			:background="background"
			layout="prev, pager, next, jumper"
			:total="50"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script setup lang="ts" name="accountManage">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
// 分页情况
const currentPage = ref(1);
const pageSize = ref(11);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
	console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
	console.log(`current page: ${val}`);
};
const handleClick = () => {
	console.log("click");
};

// 表格数据
const tableData = [
	{
		date: "2016-05-03",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	},
	{
		date: "2016-05-02",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	},
	{
		date: "2016-05-04",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	},
	{
		date: "2016-05-01",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	},
	{
		date: "2016-05-08",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	},
	{
		date: "2016-05-06",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	},
	{
		date: "2016-05-07",
		name: "sherman",
		state: "正常",
		phoneNumber: "19216823561",
		campus: "No. 189, Grove St, Los Angeles",
		class: "CA 90036",
		role: "admin",
		tag: "正常使用"
	}
];

// 选择器,选择
let campus = ref("");
let role = ref("");
let className = ref("");
const campusOptions = [
	{
		value: "Option1",
		label: "Option1"
	},
	{
		value: "Option2",
		label: "Option2"
	},
	{
		value: "Option3",
		label: "Option3"
	}
];

// 搜索按钮
const searchList = () => {};
</script>
