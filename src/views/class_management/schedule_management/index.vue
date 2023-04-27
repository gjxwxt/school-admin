<template>
	<div class="card content-box">
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
			<el-button
				size="large"
				:icon="Plus"
				color="#409eff"
				v-if="BUTTONS.add"
				plain
				@click="openDrawer('新增', { assemblyTime, weeks: DayOfWeek, campus })"
				style="margin-left: 23px"
				>add</el-button
			>
			<el-button size="large" v-if="BUTTONS.batchAdd" :icon="Plus" color="#409eff" plain @click="useLastWeekSchedule()"
				>导入上周课表</el-button
			>
			<el-button size="large" :icon="Download" plain @click="upload">批量导入课表</el-button>
			<el-button size="large" :icon="Download" plain @click="downloadFile">导出本周课表</el-button>
		</div>
		<el-table
			:data="tableData"
			style="width: 100%"
			refs="schedule"
			class="table_box"
			border
			:header-cell-style="{ background: '#F5F7FA', color: '#000' }"
		>
			<el-table-column prop="showTime" label="Class Time" width="150" align="center"> </el-table-column>
			<el-table-column prop="classes" label="Class No." width="150" align="center">
				<template #default="scope">
					<el-button type="primary" link @click="detail(scope.row)">{{ scope.row.classes }}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="teacher1" label="中教" width="150" align="center" />
			<el-table-column prop="teacher2" label="外教" width="150" align="center" />
			<el-table-column prop="content" label="Content" width="150" align="center" />
			<el-table-column prop="classroom" label="Classroom" width="150" align="center" />
			<el-table-column prop="updatePRPackage" label="更新点读包" width="150" align="center" />
			<el-table-column prop="remarks" label="Remarks" width="150" align="center" />
			<el-table-column prop="auditions_num" label="试听班额" width="120" align="center" />
			<el-table-column prop="age_range" label="试听年龄段" width="120" align="center" />
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
					<el-button type="primary" link :icon="View" v-if="BUTTONS.operate" @click="classHour(scope.row)">扣课时</el-button>
					<el-button type="primary" link :icon="Delete" v-if="BUTTONS.delete" @click="deleteAccount(scope.row)">remove</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="bottom_box">
			<ul>
				<li><el-button @click="changDay(1)" type="primary" :plain="DayOfWeek !== 1" size="large">Mon.</el-button></li>
				<li><el-button @click="changDay(2)" type="primary" :plain="DayOfWeek !== 2" size="large">Tue.</el-button></li>
				<li><el-button @click="changDay(3)" type="primary" :plain="DayOfWeek !== 3" size="large">Wed.</el-button></li>
				<li><el-button @click="changDay(4)" type="primary" :plain="DayOfWeek !== 4" size="large">Thur.</el-button></li>
				<li><el-button @click="changDay(5)" type="primary" :plain="DayOfWeek !== 5" size="large">Fri.</el-button></li>
				<li><el-button @click="changDay(6)" type="primary" :plain="DayOfWeek !== 6" size="large">Sat.</el-button></li>
				<li><el-button @click="changDay(0)" type="primary" :plain="DayOfWeek !== 0" size="large">Sun.</el-button></li>
			</ul>
		</div>
		<UserDrawer ref="drawerRef" @submit="searchList()" />
		<ImportExcel ref="dialogRef" />
		<OperateClassHour ref="classHourRef" />
	</div>
</template>

<script setup lang="ts" name="accountManage">
import { ref, onMounted } from "vue";
import { Delete, EditPen, Plus, Download, View } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import UserDrawer from "./scheduleDrawer.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import OperateClassHour from "@/components/DeductClassHour/index.vue";
import {
	addSchedule,
	deleteSchedule,
	editSchedule,
	getExcelTemplate,
	getOneWeekSchedule,
	getSchedule,
	searchCampus,
	useLastSchedule
} from "@/api/modules/schedule";
import { GlobalStore } from "@/stores";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
import { uploadExcel } from "@/api/modules/upload";
import { useRouter } from "vue-router";
import { classHourOperate, getStudentListByClassId } from "@/api/modules/student";
const { BUTTONS } = useAuthButtons();

const globalStore = GlobalStore();
// 获取表格数据,就是拿着选择周周一开始时间戳和结束时间戳发送请求即可
const getTableList = async () => {
	timeInMonAndSun(new Date().getTime());
	getCampus();
	pickWeek.value = new Date().getTime();
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
	tableData.value.forEach(item => {
		let startTimeTurn = new Date(item.startTime);
		let endTimeTurn = new Date(item.endTime);
		let startTime =
			startTimeTurn.getHours() +
			":" +
			(startTimeTurn.getMinutes() < 10 ? `0${startTimeTurn.getMinutes()}` : startTimeTurn.getMinutes());
		let endTime =
			endTimeTurn.getHours() + ":" + (endTimeTurn.getMinutes() < 10 ? `0${endTimeTurn.getMinutes()}` : endTimeTurn.getMinutes());
		item.showTime = `${startTime}  ~  ${endTime}`;
		item.time = [startTimeTurn, endTimeTurn];
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
	const date = new Date(e);
	const dayOfWeek = date.getDay() == 0 ? 6 : date.getDay() - 1;
	const dayOfWeekEnd = date.getDay() == 0 ? 0 : 7 - date.getDay();
	const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek, 0, 0);
	const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayOfWeekEnd, 23, 59);
	weekStart.value = `${monday.getMonth() + 1} 月 ${monday.getDate()} 号`;
	weekEnd.value = `${sunday.getMonth() + 1} 月 ${sunday.getDate()} 号`;
	startDay.value = monday.getTime(); // 搜索要发送的开始时间
	endDay.value = sunday.getTime(); // 搜索要发送的结束时间
	assemblyTime.value = [monday.getTime(), sunday.getTime()]; // 传入周一和周天的时间
};
let tableData = ref([]);
// [{ weekDay: 1 schedule:[]}, {}, {}];// 首先发送的时候把当前课表的星期发过去，0是周天，1~6，数字类型

// 选择器,选择
let campus = ref("");
let campusOptions = ref([]);
const campusChange = () => {
	searchList();
};

// 搜索按钮,拿着校区和startDay和endDay返回相应时间的课表，返回数据格式是7个对象，每个对象就是每一天的具体课表，
// 然后根据DayOfWeek进行筛选数据，实现分天显示
const searchList = () => {
	getSchedule({ startDay: startDay.value, endDay: endDay.value, weeks: DayOfWeek.value, campus: campus.value }).then(res => {
		tableData.value = res.data;
		if (tableData.value.length) {
			tableDataFormat();
		}
	});
};
// 导入上周课表
const useLastWeekSchedule = async () => {
	await useLastSchedule({ startDay: startDay.value, endDay: endDay.value, campus: campus.value });
	searchList();
};

// 上传excel文件
// 批量添加用户
const dialogRef = ref();
// tempApi下载模板的api，importApi 导入excel的Api
const upload = () => {
	let params = {
		title: "课表",
		tempApi: getExcelTemplate,
		importApi: uploadExcel,
		getTableList: searchList
	};
	dialogRef.value.acceptParams(params);
};

// 点击底部按钮,去搜索当天的课表
const changDay = e => {
	DayOfWeek.value = e;
	searchList();
};
// 编辑行信息，编辑完成后，拿着数据发送请求。
// 新增行信息, 传过去的除了基本数据为空外,要拿到开始和结束的具体时间,首先time是[8:30,9:20]类型,然后传入年月日,在编辑页发送的时候将数据拼成完整的时间戳
// 以startTime,endTime格式发送过去,除此之外,还有week作为附加的参数传入
const drawerRef = ref();
const openDrawer = (title: string, rowData: any = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		api: title === "新增" ? addSchedule : title === "编辑" ? editSchedule : ""
	};
	drawerRef.value.acceptParams(params);
};

// 扣课时
const classHourRef = ref();
const classHour = async data => {
	let param = {
		title: "扣课时",
		params: data.class_id, // 父组件传过来的参数
		searchApi: getStudentListByClassId, // 查询数据的api
		submitApi: classHourOperate // 点击确定上传的api
	};
	classHourRef.value.acceptParams(param);
};

// 删除某一行
const deleteAccount = async params => {
	await useHandleData(deleteSchedule, { id: [params.id] }, `删除当前课程`);
	searchList();
};

// 下载当前周课表为execl
const downloadFile = async () => {
	ElMessageBox.confirm("确认导出当前周课表?", "温馨提示", { type: "warning" }).then(() =>
		useDownload(getOneWeekSchedule, `${campus.value}:${weekStart.value}-${weekEnd.value}课表`, true, {
			startDay: startDay.value,
			endDay: endDay.value,
			weeks: DayOfWeek.value,
			campus: campus.value
		})
	);
};

// 点击详情，跳转路由进入班级详情页，传入参数class_name
const router = useRouter();
const detail = params => {
	let str = params.classes + "&" + params.campus;
	router.push(`/class_management/student_management/${str}`);
};
</script>

<style lang="scss">
.table_box {
	margin-bottom: 60px;
}
.bottom_box {
	// margin-top: 50px;
	position: absolute;
	bottom: 50px;
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
