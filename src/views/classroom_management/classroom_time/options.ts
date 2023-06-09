export const options = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow"
		}
		// formatter: function (params) {
		// 	console.log(params);
		// 	let tar = params[1];
		// 	return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
		// }
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true
	},
	xAxis: {
		// type: "category",
		// splitLine: { show: false },
		// data: ["大厅", "Zebra", "Hippo", "Giraffe"],
		type: "time",
		boundaryGap: false
		// min: "2021-01-04 08:00:00",
		// max: "2021-01-04 23:00:00"
	},
	yAxis: {
		// type: "value",
		// axisLabel: {
		// 	formatter: function (value) {
		// 		let value1 = `${value}`;
		// 		let text = [];
		// 		text.push(value1.length == 3 ? `${value1.slice(0, 1)}:${value1.slice(-2)}` : `${value1.slice(0, 2)}:${value1.slice(-2)}`);
		// 		return text;
		// 	}
		// }
		type: "category",
		data: []
	},
	series: [
		// {
		// 	name: "结束时间", // banji
		// 	type: "bar",
		// 	stack: "a",
		// 	label: {
		// 		show: true,
		// 		position: "inside"
		// 	},
		// 	itemStyle: {
		// 		borderColor: "transparent"
		// 	},
		// 	data: ["2021-01-04 22:14:36", "2021-01-04 09:14:46", "2021-01-04 10:20:46"]
		// },
		// {
		// 	name: "开始时间",
		// 	type: "bar",
		// 	stack: "a",
		// 	itemStyle: {
		// 		borderColor: "white",
		// 		// color: 'transparent'
		// 		color: "white"
		// 	},
		// 	data: ["2021-01-04 21:14:36", "2021-01-04 09:14:46", "2021-01-04 10:20:46"]
		// },
		// {
		// 	name: "结束时间",
		// 	type: "bar",
		// 	stack: "a",
		// 	label: {
		// 		show: true,
		// 		position: "inside"
		// 	},
		// 	itemStyle: {
		// 		borderColor: "transparent"
		// 	},
		// 	data: ["2021-01-04 9:14:36", "2021-01-04 09:14:46", "2021-01-04 10:20:46"]
		// },
		// {
		// 	name: "开始时间",
		// 	type: "bar",
		// 	stack: "a",
		// 	itemStyle: {
		// 		borderColor: "white",
		// 		// color: 'transparent'
		// 		color: "white"
		// 	},
		// 	data: ["2021-01-04 8:14:36", "2021-01-04 09:14:46", "2021-01-04 10:20:46"]
		// }
	]
};
