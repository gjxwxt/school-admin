<template>
	<div class="card content-box">
		<div style="padding: 1vh 2vw">
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
		</div>
		<div ref="echartsRef" class="card" style="width: 100%; height: 380px"></div>
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
	</div>
</template>

<script setup lang="ts" name="accountManage">
import { deepClone, TimeStampTurn } from "@/utils/util";

let myChart, option;
import { ref, onMounted } from "vue";
import { getSchedule, searchCampus } from "@/api/modules/schedule";
import { GlobalStore } from "@/stores";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { options } from "./options";
const echartsRef = ref<HTMLElement>();
3;
const globalStore = GlobalStore();
// 获取表格数据,就是拿着选择周周一开始时间戳和结束时间戳发送请求即可
const getTableList = async () => {
	timeInMonAndSun(new Date().getTime());
	getCampus();
	pickWeek.value = new Date().getTime();
};
onMounted(() => {
	myChart = echarts.init(echartsRef.value as HTMLElement);
	option = deepClone(options);
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
let classList = [];
let optionsData = ref({});
const tableDataFormat = () => {
	option = deepClone(options);
	classList = [];
	optionsData.value = {};
	// 首先拿到classroom的列表
	tableData.value.forEach(item => {
		if (!classList.includes(item.classroom)) {
			classList.push(item.classroom);
			optionsData.value[item.classroom] = [];
		}
	});
	let timeStr = "";
	// 之后{教室a：[时间正序]，教室b：[时间正序]}
	tableData.value.forEach(item => {
		optionsData.value[item.classroom].push(item.endTime);
		optionsData.value[item.classroom].push(item.startTime);
		timeStr = TimeStampTurn(optionsData.value[item.classroom][0]).slice(0, 11);
	});
	// {教室a：[时间倒叙]，教室b：[时间倒叙]}
	let maxNumber = 0; // 首先要知道循环多少次，找出最多的项长度是多少
	for (let i in optionsData.value) {
		optionsData.value[i] = optionsData.value[i].sort((a, b) => {
			return b - a;
		});
		optionsData.value[i].length >= maxNumber ? (maxNumber = optionsData.value[i].length) : "";
	}
	option.yAxis.data = classList;
	option.xAxis = {
		type: "time",
		boundaryGap: false,
		min: timeStr + "08:00:00",
		max: timeStr + "23:00:00",
		axisLine: { onZero: true, show: true }
	};
	// 之后for循环形成最终的options,首先知道要形成多少个对象，之后对数据进行填充
	let target = [];
	for (let i = 0; i < maxNumber; i++) {
		let data = [];
		for (let j in optionsData.value) {
			data.push(TimeStampTurn(optionsData.value[j][i] || 0) || timeStr + "08:00:00");
		}
		target.push({
			name: i % 2 == 0 ? "结束时间" : "开始时间",
			type: "bar",
			stack: "a",
			itemStyle:
				i % 2 == 0
					? {}
					: {
							borderColor: "white",
							color: "white"
					  },
			data: data
		});
	}
	console.log(target);
	option.series = target;
	// myChart.setOption(option, true);
	useEcharts(myChart, option);
};

// 时间选择器选择的时间,默认是当前周的周一☞周五
let pickWeek = ref();
let weekStart = ref("");
let weekEnd = ref("");
// 发起搜索时候的时间戳
let startDay = ref(0);
let endDay = ref(0);
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
		} else {
			classList = [];
			optionsData.value = {};
			option = {};
			// myChart.setOption(options, true);
			useEcharts(myChart, options);
		}
	});
};

// 点击底部按钮,去搜索当天的课表
const changDay = e => {
	DayOfWeek.value = e;
	searchList();
};
</script>

<style lang="scss">
.bottom_box {
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
