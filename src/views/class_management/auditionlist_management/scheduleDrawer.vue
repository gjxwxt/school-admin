<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}试听人员`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="campus" prop="campus">
				<el-select v-model="drawerProps.rowData.campus" placeholder="所属校区">
					<el-option
						v-for="item in drawerProps.rowData.campusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="试听日期">
				<el-date-picker
					v-model="drawerProps.rowData.startTime"
					type="date"
					placeholder="选择日期"
					format="YYYY 年 MM 月 DD 日"
					value-format="x"
					@change="pickSchedule"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="Class No.">
				<el-select v-model="drawerProps.rowData.schedule_id" @change="pickClass">
					<el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="姓名">
				<el-input v-model="drawerProps.rowData.audition_name" clearable></el-input>
			</el-form-item>
			<el-form-item label="年龄">
				<el-input v-model="drawerProps.rowData.audition_age" clearable></el-input>
			</el-form-item>
			<el-form-item label="有无基础">
				<el-input v-model="drawerProps.rowData.audition_basics" clearable></el-input>
			</el-form-item>
			<el-form-item label="试听人员其他备注">
				<el-input v-model="drawerProps.rowData.audition_info_others" clearable></el-input>
			</el-form-item>
			<el-form-item label="对接人员">
				<el-input v-model="drawerProps.rowData.communicate_person" clearable></el-input>
			</el-form-item>
			<el-form-item label="对接人员联系方式">
				<el-input v-model="drawerProps.rowData.communicate_person_contact" clearable></el-input>
			</el-form-item>
			<el-form-item label="信息来源">
				<el-input v-model="drawerProps.rowData.info_source" clearable></el-input>
			</el-form-item>
			<el-form-item label="其他补充">
				<el-input v-model="drawerProps.rowData.info_others" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否到访">
				<el-select v-model="drawerProps.rowData.visited_or_not" clearable placeholder="请选择">
					<el-option
						v-for="item in [{ value: '已到访' }, { value: '未到访' }]"
						:key="item.value"
						:label="item.value"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<!--			<el-form-item label="访问次数">-->
			<!--				<el-input v-model="drawerProps.rowData.visited_count" clearable></el-input>-->
			<!--			</el-form-item>-->
			<el-form-item label="是否签单">
				<el-select v-model="drawerProps.rowData.signed_or_not" clearable placeholder="请选择" @change="searchAllClass">
					<el-option
						v-for="item in [{ value: '已签单' }, { value: '未签单' }]"
						:key="item.value"
						:label="item.value"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="签单班级" v-if="showClass">
				<el-select v-model="drawerProps.rowData.sign_class">
					<el-option v-for="item in classAllOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="是否当签" v-show="showClass">
				<el-select v-model="drawerProps.rowData.after_schedule_signed">
					<el-option
						v-for="item in [{ value: '当签' }, { value: '否' }]"
						:key="item.value"
						:label="item.value"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getOneDaySchedule, searchClassName } from "@/api/modules/schedule";

const rules = reactive({
	campus: [{ required: true, message: "请上传校区名称" }],
	address: [{ required: true, message: "请上传校区地址" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	week: number;
	assemblyTime: Date[];
	rowData?: any;
	api?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}
// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false,
	title: ""
});

// 选择日期后发送请求寻找课表信息
// 班级列表
let classOptions = ref([]);
const pickSchedule = e => {
	// 根据时间得到当天时间戳startTime和endTime
	getOneDaySchedule({ startTime: e, endTime: e + 86400000, campus: drawerProps.value.rowData.campus }).then(res => {
		classOptions.value = [];
		res.data.forEach(item => {
			classOptions.value.push({
				label: item.classes,
				value: item.id
			});
		});
		drawerProps.value.rowData.schedule_id = res.data[0] ? res.data[0].id : "";
	});
};
// 所有班级的列表,选择完签单班级后，直接将这个人加到班级成员列表中。修改的话只能去班级成员列表中删除，
let classAllOptions = ref([]);
let showClass = ref(false);
const searchAllClass = e => {
	if (e === "已签单") {
		showClass.value = true;
		classAllOptions.value = [];
		searchClassName({ campus: drawerProps.value.rowData.campus }).then(res => {
			res.data.forEach(item => {
				classAllOptions.value.push({
					label: item.class_name,
					value: item.class_name
				});
			});
		});
	} else {
		showClass.value = false;
	}
};

const pickClass = e => {
	drawerProps.value.rowData.schedule_id = e;
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
	if (params.rowData.startTime) {
		let start = new Date(params.rowData.startTime);
		pickSchedule(new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime());
	} else {
		classOptions.value = [];
		classAllOptions.value = [];
	}
	// 只有当已签单的时候才显示
	if (params.rowData.signed_or_not == "已签单") {
		showClass.value = true;
		searchAllClass("已签单");
	} else {
		showClass.value = false;
	}
};
const emit = defineEmits(["submit"]); //注册
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerProps.value.api!(drawerProps.value.rowData);
			// console.log(drawerProps.value.rowData);
			ElMessage.success({ message: `success！` });
			emit("submit");
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

defineExpose({
	acceptParams
});
</script>
