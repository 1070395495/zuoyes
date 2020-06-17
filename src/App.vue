<template>
  <div class="app">
    <div class="content">
		<!-- 内容区域开始 -->
		
			<keep-alive> 
				<router-view v-if="this.$route.meta.keepAlive"></router-view> 
			</keep-alive> 
			
			<router-view v-if="!this.$route.meta.keepAlive"></router-view>
			
		<!-- 内容区域结束 -->
	
    </div>
  </div>
</template>

<script>

export default {
	
}
</script>

<style lang="scss">
// *{
// 	margin: 0;
// 	padding: 0;
// 	list-style: none;
// 	box-sizing: border-box;
// }
// html,body,.app{
// 	font-size: 16px;
// 	width: 100%;
// 	height: 100%;
// 	display: flex;
// 	flex-direction: column;
// }
// .content{
// 	//height: 100%;
// 	flex-grow: 1;
// 	//overflow: hidden;
// 	//margin-bottom: 0.6rem;
// }
.app,.content{
	height: 100%;
}
</style>