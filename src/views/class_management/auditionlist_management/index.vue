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
			<el-date-picker
				v-model="pickWeek"
				type="week"
				@change="pickChange"
				:format="weekStart + ' 至 ' + weekEnd"
				value-format="x"
				placeholder="选择周"
				size="large"
			>
			</el-date-picker>
			<el-select
				v-model="ChoiceStatus"
				class="m-2"
				placeholder="人员状态"
				size="large"
				style="width: 130px; margin: 0 15px"
				@change="campusChange"
			>
				<el-option
					v-for="item in [
						{ value: '全部' },
						{ value: '未到访' },
						{ value: '已到访' },
						{ value: '未签单' },
						{ value: '已签单' },
						{ value: '当签' }
					]"
					:key="item.value"
					:label="item.value"
					:value="item.value"
				/>
			</el-select>
			<el-input size="large" v-model="name" placeholder="输入人名进行过滤" clearable style="width: 150px" />
			<el-button size="large" :icon="Search" color="#409eff" plain @click="searchList()" style="margin: 0 15px">搜索</el-button>
			<el-button
				size="large"
				:icon="Plus"
				color="#409eff"
				v-if="BUTTONS.add"
				plain
				@click="openDrawer('新增', { assemblyTime, weeks: DayOfWeek, campus })"
				>add</el-button
			>
			<input type="file" @change="change" />
			<el-button size="large" :icon="Plus" color="#409eff" plain>查看本周数据</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%" refs="schedule">
			<el-table-column prop="showTime" fixed="left" label="试听时间" width="170" align="center" />
			<el-table-column prop="classes" fixed="left" label="试听班级" width="150" align="center" />
			<el-table-column prop="audition_name" fixed="left" label="名字" width="70" align="center" />
			<el-table-column prop="audition_age" fixed="left" label="年龄" width="70" align="center" />
			<el-table-column prop="audition_basics" fixed="left" label="有无基础" width="120" align="center" />
			<el-table-column prop="audition_info_others" label="试听学员备注" width="120" align="center" />
			<el-table-column prop="teacher1" label="中教" width="150" align="center" />
			<el-table-column prop="teacher2" label="外教" width="150" align="center" />
			<el-table-column prop="communicate_person" label="对接人员" width="150" align="center" />
			<el-table-column prop="communicate_person_contact" label="对接人员联系方式" width="150" align="center" />
			<el-table-column prop="info_source" label="信息来源及其他补充信息" width="150" align="center" />
			<el-table-column prop="create_time" label="登记日期" width="150" align="center" />
			<el-table-column fixed="right" prop="status" label="状态" width="150" align="center" />
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template #default="scope">
					<el-button
						link
						type="primary"
						v-if="BUTTONS.edit"
						:icon="EditPen"
						size="small"
						@click="openDrawer('编辑', { assemblyTime, weeks: DayOfWeek, campus, ...scope.row })"
						>Edit</el-button
					>
					<el-button
						link
						type="primary"
						v-if="BUTTONS.edit"
						:icon="EditPen"
						size="small"
						@click="openDrawer('新增', { assemblyTime, weeks: DayOfWeek, campus, ...scope.row })"
						>再次访问</el-button
					>
					<el-button type="primary" link :icon="Delete" v-if="BUTTONS.delete" @click="deleteAccount(scope.row)">remove</el-button>
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
	</div>
</template>

<script setup lang="ts" name="accountManage">
import { ref, onMounted } from "vue";
import { Delete, EditPen, Plus, Search } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import UserDrawer from "./scheduleDrawer.vue";
import {
	addAuditiontable,
	countRatio,
	deleteAuditiontable,
	editAuditiontable,
	searchAuditiontable,
	searchCampus
} from "@/api/modules/schedule";
import { GlobalStore } from "@/stores";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { read, utils } from "xlsx";

const change = e => {
	let _file = e.target.files[0];
	_file.arrayBuffer().then(res => {
		const wb = read(res);
		const sheet1 = wb.Sheets.Sheet1;
		const _data = utils.sheet_to_json(sheet1);
		console.log(_data);
	});
};

const { BUTTONS } = useAuthButtons();

const globalStore = GlobalStore();
// 页数和当前页
let total = ref(0);
let page = ref(1);

// 如果增加的话，选好哪一天之后，根据课表选择班级，之后其他选项默认填上。
const getTableList = async () => {
	timeInMonAndSun(new Date().getTime());
	getCampus();
	pickWeek.value = new Date().getTime();
	// status是是否访问+访问次数，或者说是否签单
};
onMounted(() => {
	// 发送请求,然后对数据时间格式进行处理,默认按照当前周进行搜索先
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
		campus.value = campusOptions.value[0].value;
		searchList();
	});
};
// 处理时间戳,1. time传送给编辑页面，2. showTime是time列，3. DayOfWeek代表当前是周几
let DayOfWeek = ref(1);
const tableDataFormat = () => {
	total.value = tableData.value[0].total;
	tableData.value.forEach(item => {
		let startTimeTurn = new Date(item.startTime);
		let endTimeTurn = new Date(item.endTime);
		let createTime = new Date(item.create_time);
		let startTime =
			startTimeTurn.getHours() +
			":" +
			(startTimeTurn.getMinutes() < 10 ? `0${startTimeTurn.getMinutes()}` : startTimeTurn.getMinutes());
		let endTime =
			endTimeTurn.getHours() + ":" + (endTimeTurn.getMinutes() < 10 ? `0${endTimeTurn.getMinutes()}` : endTimeTurn.getMinutes());
		item.showTime = `${startTimeTurn.getFullYear()}-${startTimeTurn.getMonth() + 1}-${
			startTimeTurn.getDate() < 10 ? "0" + startTimeTurn.getDate() : startTimeTurn.getDate()
		} ${"" + startTime}  ~  ${endTime}`;
		item.status = item.signed_or_not == "已签单" ? "已签单" : item.visited_or_not == "未到访" ? "未到访" : `已到访`;
		// item.signed_or_not == "已签单" ? "已签单" : item.visited_or_not == "未到访" ? "未到访" : `已到访：${item.visited_count}次`;
		item.create_time = `${createTime.getFullYear()}-${createTime.getMonth() + 1}-${createTime.getDate()}`;
	});
	DayOfWeek.value = new Date(tableData.value[0].startTime).getDay();
};

// 时间选择器选择的时间,默认是当前周的周一☞周五
let pickWeek = ref();
let weekStart = ref("");
let weekEnd = ref("");
// 发起搜索时候的时间戳
let startDay = ref(0);
let endDay = ref(0);
// 新增时候的年月日,搭配具体时间实现时间戳
let assemblyTime = ref([]);
// 根据时间戳，找出当前周的周一monday和周天sunday的日期,然后转换成时间戳
const pickChange = e => {
	timeInMonAndSun(e);
	searchList();
};
// 传入时间戳,返回该时间戳所在周的周一和周天日期
const timeInMonAndSun = e => {
	if (e) {
		const date = new Date(e);
		const dayOfWeek = date.getDay() == 0 ? 6 : date.getDay() - 1;
		const dayOfWeekEnd = date.getDay() == 0 ? 0 : 7 - date.getDay();
		const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek, 0, 0);
		const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayOfWeekEnd, 23, 59);
		weekStart.value = `${monday.getMonth() + 1} 月 ${monday.getDate()} 号`;
		weekEnd.value = `${sunday.getMonth() + 1} 月 ${sunday.getDate()} 号`;
		startDay.value = monday.getTime(); // 搜索要发送的开始时间
		endDay.value = sunday.getTime(); // 搜索要发送的结束时间
		assemblyTime.value = [monday, sunday]; // 传入周一和周天的时间
	} else {
		startDay.value = "";
		endDay.value = "";
		assemblyTime.value = [];
	}
};
let tableData = ref([]);
// [{ weekDay: 1 schedule:[]}, {}, {}];// 首先发送的时候把当前课表的星期发过去，0是周天，1~6，数字类型

// 选择器,选择
let campus = ref("");
let campusOptions = ref([]);
const campusChange = () => {
	searchList();
};

// 拿着人名进行搜索
let name = ref("");

// 根据状态进行搜索
let ChoiceStatus = ref("");

// 搜索按钮,拿着校区和startDay和endDay返回相应时间的课表，返回数据格式是7个对象，每个对象就是每一天的具体课表，
// 然后根据DayOfWeek进行筛选数据，实现分天显示
const searchList = () => {
	searchAuditiontable({
		startDay: startDay.value,
		endDay: endDay.value,
		campus: campus.value,
		page: page.value,
		name: name.value,
		ChoiceStatus: ChoiceStatus.value
	}).then(res => {
		tableData.value = res.data;
		if (tableData.value.length) {
			tableDataFormat();
		} else {
			total.value = 0;
		}
	});
	// 查看当签周的当签率和到访率和签单率
	countRatio({ startDay: startDay.value, endDay: endDay.value, campus: campus.value }).then(res => {
		// 首先分为中教和外教，
		console.log(res);
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
		api: title === "新增" ? addAuditiontable : title === "编辑" ? editAuditiontable : ""
	};
	drawerRef.value.acceptParams(params);
};

// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteAuditiontable, { audition_id: [params.audition_id] }, `删除当前课程`);
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
