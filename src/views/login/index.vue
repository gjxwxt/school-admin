<template>
	<div class="login-container flx-center">
		<div class="login-box">
			<SwitchDark class="dark" />
			<div class="login-left">
				<img src="@/assets/images/login_left6.png" alt="login" />
			</div>
			<div class="login-form">
				<div class="login-logo">
					<img class="login-icon" src="@/assets/images/logo.png" alt="" />
					<h2 class="logo-text">GloryLand-Admin</h2>
				</div>
				<LoginForm />
			</div>
			<!--	添加备案号		-->
			<div class="login-footer">
				<a class="el-link" href="https://beian.miit.gov.cn" target="_blank">鲁ICP备2023014363号</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
