<template>
	<div class="table-box">
		<ProTable
			ref="proTable"
			title="用户列表"
			:columns="columns"
			:requestApi="getTableList"
			:initParam="initParam"
			:dataCallback="dataCallback"
		>
			<!-- 表格 header 按钮 -->
			<template #tableHeader="scope">
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-auth="'add'">新增学员</el-button>
				<el-button type="primary" :icon="Upload" plain @click="batchAdd" v-auth="'batchAdd'">批量添加学员</el-button>
				<el-button type="primary" :icon="Download" plain @click="downloadFile" v-auth="'export'">导出班级数据</el-button>
				<el-button type="primary" plain @click="toDetail">To 子集详情页面</el-button>
				<el-button type="danger" :icon="Delete" plain @click="batchDelete(scope.selectedListIds)" :disabled="!scope.isSelected">
					批量删除用户
				</el-button>
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
			</template>
			<template #contract="scope">
				<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">预览</el-button>
			</template>
			<!--						&lt;!&ndash; createTime &ndash;&gt;-->
			<!--						<template #createTime="scope">-->
			<!--							{{ scope.row.createTime }}-->
			<!--						</template>-->
			<!-- 表格操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
				<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
			</template>
		</ProTable>
		<UserDrawer ref="drawerRef" />
		<ImportExcel ref="dialogRef" />
	</div>
</template>

<script setup lang="tsx" name="student_management">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import { getUserList, deleteUser, editUser, addUser, changeUserStatus, exportUserInfo, BatchAddUser } from "@/api/modules/user";

const router = useRouter();

// 跳转详情页
const toDetail = () => {
	router.push(`/proTable/useProTable/detail/${Math.random()}?params=detail-page`);
};

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
	type: 1
});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
	return {
		list: data.list,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
	let newParams = JSON.parse(JSON.stringify(params));
	newParams.username && (newParams.username = "custom-" + newParams.username);
	return getUserList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项，search:用于是否显示在搜索框，input是输入，select就是下拉，
const columns: ColumnProps[] = [
	{ type: "selection", fixed: "left", width: 80 },
	{ type: "index", label: "#", width: 40 },
	// { type: "expand", label: "Expand", width: 100 },
	{
		prop: "username",
		label: "名字/英文名",
		search: { el: "input" },
		render: scope => {
			return (
				<el-button type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
					{scope.row.username}
				</el-button>
			);
		}
	},
	// 年龄这块用出生年月存储，返回数据之后进行计算
	{ prop: "age", label: "年龄" },
	{
		prop: "campus",
		label: "校区",
		// 直接放字典数据
		enum: [
			{ label: "1校区", value: 1 },
			{ label: "2校区", value: 2 }
		], //enum是个数组[{label:xxx,value:xxx},{}]
		search: { el: "select", props: { filterable: true } },
		fieldNames: { label: "label", value: "value" }
	},
	{
		prop: "status",
		label: "用户状态",
		// enum: getUserStatus,
		// search: { el: "tree-select", props: { filterable: true } },
		fieldNames: { label: "userLabel", value: "userStatus" },
		render: (scope: { row: User.ResUserList }) => {
			return (
				<>
					{BUTTONS.value.status ? (
						<el-switch
							model-value={scope.row.status}
							active-text={scope.row.status ? "正常" : "停课"}
							active-value={1}
							inactive-value={0}
							onClick={() => changeStatus(scope.row)}
						/>
					) : (
						<el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "正常" : "停课"}</el-tag>
					)}
				</>
			);
		}
	},
	// 多级 prop
	{ prop: "classHour", label: "课时" },
	{
		prop: "className",
		label: "班级",
		enum: [
			{ label: "101", value: "101" },
			{ label: "102", value: "102" }
		],
		search: { el: "select", props: { filterable: true } },
		fieldNames: { label: "label", value: "value" }
	},
	{ prop: "address", label: "班级负责人", width: 120 },
	{ prop: "address", label: "来源" },
	{ prop: "address", label: "联系电话" },
	{ prop: "address", label: "备用电话" },
	{ prop: "contract", label: "签订合同" },
	{
		prop: "createTime",
		label: "创建时间",
		width: 180,
		search: {
			el: "date-picker",
			span: 2,
			props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
			defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
		}
	},
	{ type: "expand", label: "Expand", width: 100 },
	{ prop: "operation", label: "操作", fixed: "right", width: 120 }
];

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
	await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
	proTable.value.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
	await useHandleData(deleteUser, { id }, "删除所选用户信息");
	proTable.value.clearSelection();
	proTable.value.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
	await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
	proTable.value.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
	ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
		useDownload(exportUserInfo, "用户列表", proTable.value.searchParam)
	);
};

// 批量添加用户
const dialogRef = ref();
const batchAdd = () => {
	let params = {
		title: "用户",
		tempApi: exportUserInfo,
		importApi: BatchAddUser,
		getTableList: proTable.value.getTableList
	};
	dialogRef.value.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref();
const openDrawer = (title: string, rowData: Partial<User.ResUserList> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		api: title === "新增" ? addUser : title === "编辑" ? editUser : "",
		getTableList: proTable.value.getTableList
	};
	drawerRef.value.acceptParams(params);
};
</script>
