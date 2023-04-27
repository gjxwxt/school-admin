<template>
	<div class="card content-box">
		<div style="padding: 2vh 2vw">
			<el-select
				v-model="campus"
				@change="campusChange"
				class="m-2"
				placeholder="所属校区"
				size="large"
				style="width: 100px; margin-right: 15px"
			>
				<el-option v-for="item in campusOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-autocomplete
				size="large"
				class="inline-input"
				v-model="class_name"
				:fetch-suggestions="querySearch"
				placeholder="请输入班级名称"
				style="width: 150px; margin-right: 15px"
			></el-autocomplete>
			<el-input size="large" v-model="student_name" placeholder="输入人名进行过滤" clearable style="width: 150px" />
			<el-button size="large" :icon="Search" color="#409eff" plain @click="searchList('第一页')" style="margin: 0 15px"
				>搜索</el-button
			>
			<el-button size="large" :icon="Delete" color="#409eff" plain @click="clear()" style="margin: 0 15px">清空</el-button>
			<el-button size="large" :icon="Plus" color="#409eff" v-if="BUTTONS.add" plain @click="openDrawer('新增', { campus })"
				>添加</el-button
			>
		</div>
		<el-table
			border
			:data="tableData"
			style="width: 100%"
			refs="schedule"
			:header-cell-style="{ background: '#F5F7FA', color: '#000' }"
		>
			<el-table-column prop="student_name" fixed="left" label="名字" width="70" align="center" />
			<el-table-column prop="student_age" fixed="left" label="年龄" width="70" align="center" />
			<el-table-column prop="student_contact" label="联系方式" width="120" align="center" />
			<el-table-column prop="class_name" label="所属班级" width="150" align="center" />
			<el-table-column prop="student_source" label="学生来源" width="150" align="center" />
			<el-table-column prop="class_hour" label="剩余课时" width="150" align="center" />
			<el-table-column prop="init_class_hour" label="总课时" width="150" align="center" />
			<el-table-column prop="classes" label="Class No." width="150" align="center">
				<template #default="scope">
					<el-button type="primary" :icon="View" link @click="class_hour_detail(scope.row.student_id)">课时操作记录</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="remarks" label="备注" width="150" align="center" />
			<el-table-column prop="create_time" label="登记日期" width="150" align="center" />
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template #default="scope">
					<el-button link type="primary" :icon="EditPen" size="small" @click="openDrawer('编辑', { campus, ...scope.row })"
						>Edit</el-button
					>
					<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">remove</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="position: absolute; bottom: 50px; z-index: 1000">
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
		<ClassHourDetail ref="classHourDetailRef" />
	</div>
</template>

<script setup lang="ts" name="accountManage">
import { ref, onMounted } from "vue";
import { Delete, EditPen, Plus, Search, View } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import UserDrawer from "./studentDrawer.vue";
import ClassHourDetail from "./class_hour_detail.vue";
import { searchCampus, searchClassMangage } from "@/api/modules/schedule";
import { GlobalStore } from "@/stores";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { addStudent, classHourSearch, deleteStudent, editStudent, getStudentList } from "@/api/modules/student";
import { useRoute } from "vue-router";
import { renderTime } from "@/utils/util";

const { BUTTONS } = useAuthButtons();

const globalStore = GlobalStore();
// 页数和当前页
let total = ref(0);
let page = ref(1);

// 如果增加的话，选好哪一天之后，根据课表选择班级，之后其他选项默认填上。
const getTableList = async () => {
	getCampus();
};
// 接受跳转页面传来的参数
const route = useRoute();
const { name } = route.params;

onMounted(() => {
	// 发送请求,然后对数据时间格式进行处理,默认按照当前周进行搜索先
	// 如果是班级列表页面跳转过来的，接受参数，然后进行搜索
	if (name.includes("&")) {
		// 对name按照&进行分割
		const nameArr = name.split("&");
		class_name.value = nameArr[0] as string;
		campus.value = nameArr[1] as string;
	}
	getTableList();
});
// 处理校区
const getCampus = () => {
	// 首先拿到当前账号的role，当作参数发送过去
	searchCampus({ role: globalStore.userInfo.roles[0] }).then(res => {
		res.data.forEach(item => {
			campusOptions.value.push({ value: item.campus, label: item.campus });
		});
		// 设置默认选项
		campus.value ? "" : (campus.value = campusOptions.value[0].value);
		getClassList();
		searchList();
	});
};

// 传入时间戳,返回该时间戳所在周的周一和周天日期
let tableData = ref([]);
// [{ weekDay: 1 schedule:[]}, {}, {}];// 首先发送的时候把当前课表的星期发过去，0是周天，1~6，数字类型

// 选择器,选择
let campus = ref("");
let campusOptions = ref([]);
const campusChange = () => {
	page.value = 1;
	searchList();
};

// 拿着人名、班级进行搜索
let student_name = ref("");
let class_name = ref("");
let class_list = ref([]);
// 对班级进行加工，首先请求返回数据，之后对
const getClassList = () => {
	searchClassMangage({ campus: campus.value, class_name: class_name.value }).then(res => {
		// 对返回的数据进行处理
		let list = [];
		for (let i = 0; i < res.data.length; i++) {
			list.push({ value: res.data[i].class_name, id: res.data[i].class_id });
		}
		class_list.value = list;
	});
};
const querySearch = (queryString, cb) => {
	let results = queryString ? class_list.value.filter(createFilter(queryString)) : class_list.value;
	// 调用 callback 返回建议列表的数据
	cb(results);
};
const createFilter = queryString => {
	return class_list => {
		return class_list.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
	};
};

// 搜索按钮,拿着校区和startDay和endDay返回相应时间的课表，返回数据格式是7个对象，每个对象就是每一天的具体课表，
// 然后根据DayOfWeek进行筛选数据，实现分天显示
const searchList = (params = "") => {
	params === "第一页" ? (page.value = 1) : "";
	getStudentList({
		campus: campus.value,
		page: page.value,
		student_name: student_name.value,
		class_name: class_name.value
	}).then(res => {
		let data = res.data;
		data.forEach(item => {
			item.create_time = renderTime(item.create_time);
		});
		tableData.value = data;
		if (tableData.value.length) {
			total.value = tableData.value[0].total;
		} else {
			total.value = 0;
		}
	});
};
// 编辑行信息，编辑完成后，拿着数据发送请求。
// 新增行信息, 传过去的除了基本数据为空外,要拿到开始和结束的具体时间,首先time是[8:30,9:20]类型,然后传入年月日,在编辑页发送的时候将数据拼成完整的时间戳
// 以startTime,endTime格式发送过去,除此之外,还有week作为附加的参数传入
const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { campus: campus.value, ...rowData, campusOptions: campusOptions.value },
		isView: title === "查看",
		api: title === "新增" ? addStudent : title === "编辑" ? editStudent : ""
	};
	drawerRef.value.acceptParams(params);
};

// 首先拿到student_id之后根据student_id获取到该学员的课时详情,然后将数据传入到详情页
const classHourDetailRef = ref();
const class_hour_detail = student_id => {
	let params = {
		params: student_id,
		searchApi: classHourSearch
	};
	classHourDetailRef.value.acceptParams(params);
};

// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteStudent, { student_id: [params.student_id] }, `删除当前学员`);
	searchList();
};

// 清空搜索框
const clear = () => {
	student_name.value = "";
	class_name.value = "";
	page.value = 1;
	searchList();
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
