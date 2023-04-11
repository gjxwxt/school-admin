export const options = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow"
		},
		formatter: function (params) {
			let tar = params[1];
			return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
		}
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		splitLine: { show: false },
		data: ["大厅", "Zebra", "Hippo", "Giraffe"]
	},
	yAxis: {
		type: "value",
		axisLabel: {
			formatter: function (value) {
				let value1 = `${value}`;
				let text = [];
				text.push(value1.length == 3 ? `${value1.slice(0, 1)}:${value1.slice(-2)}` : `${value1.slice(0, 2)}:${value1.slice(-2)}`);
				return text;
			}
		}
	},
	series: [
		{
			name: "Placeholder",
			type: "bar",
			stack: "Total",
			itemStyle: {
				borderColor: "transparent",
				color: "transparent"
			},
			emphasis: {
				itemStyle: {
					borderColor: "transparent",
					color: "transparent"
				}
			},
			data: [840, 840, 940, 1040]
		},
		{
			name: "Life Cost",
			type: "bar",
			stack: "Total",
			label: {
				show: true,
				position: "inside"
			},
			data: [920, 940, 1100, 1140]
		},
		{
			name: "Placeholder2",
			type: "bar",
			stack: "Total",
			itemStyle: {
				borderColor: "transparent",
				color: "transparent"
			},
			emphasis: {
				itemStyle: {
					borderColor: "transparent",
					color: "transparent"
				}
			},
			data: [1000, 1100, 1100, 1340]
		},
		{
			name: "Life Cost",
			type: "bar",
			stack: "Total",
			label: {
				show: true,
				position: "inside"
			},
			data: [1100, 1200, 1100, 1520]
		}
	]
};
