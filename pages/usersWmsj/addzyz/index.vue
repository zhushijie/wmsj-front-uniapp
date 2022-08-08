<template>
	<view :data-theme="theme">
		<view class='personal-data pad30'  v-show="!orgselect">
			<view class='list borRadius14'>		
				<u--form  :rules="rules" :model="editUserInfo" ref="form1"  labelPosition="left" >
				
					<view class="item acea-row row-between-wrapper" style="padding: 20rpx 20rpx;">
						<view>头像</view>
						<view class="pictrue" @click.stop='uploadpic'>
							<image :src='newAvatar ? newAvatar : editUserInfo.avatar'></image>
							<image :src='editPng' class="alter"></image>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="真实姓名" prop="realName" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input inputAlign="right" v-model="editUserInfo.realName" border="none" maxlength=20 placeholder="真实姓名" ></u--input>
						</u-form-item>
				
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="身份证号" prop="cardId" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input inputAlign="right" v-model="editUserInfo.cardId" border="none" maxlength=18 placeholder="请输入身份证号" ></u--input>
						</u-form-item>
					</view>
					<view class='item acea-row row-between-wrapper' style="display: none;">
						<u-form-item label="介绍人" prop="pacount" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input inputAlign="right" v-model="editUserInfo.pacount" border="none" maxlength=18 placeholder="请输入介绍人手机号(没有留空)" ></u--input>
						</u-form-item>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="手机号码" prop="phone" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.phone" border="none" maxlength=11 placeholder="请输入" ></u--input>
						</u-form-item>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showZzmm = !showZzmm" label="整治面貌" prop="zzmm" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.zzmm"  placeholder="请选择整治面貌" />
						</u-form-item>
						<u-picker @confirm="selectZzmm" @close="showZzmm=false" @cancel="showZzmm=false" :show="showZzmm"
						:columns="[['群众','共青团员','中国党员']]" :closeOnClickOverlay = "true"/>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showWhcd = !showWhcd" label="文化程度" prop="whcd" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly  inputAlign="right" v-model="editUserInfo.whcd"  placeholder="请选择文化程度" />
						</u-form-item>
						<u-picker @confirm="selectWhcd" @close="showWhcd=false" @cancel="showWhcd=false" :show="showWhcd"
						:columns="[['博士','研究生','本科','专科','高中','初中','小学']]" :closeOnClickOverlay = "true"/>
				
				
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showZhiye = !showZhiye" label="职业" prop="zhiye" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.zhiye"  placeholder="请选择整职业" />
						</u-form-item>
						<u-picker @confirm="selectZhiye" @close="showZhiye=false" @cancel="showZhiye=false" :show="showZhiye"
						:columns="[['学生','机关/事业单位','企业职工','城乡居民','退休人员','自由职业者']]" :closeOnClickOverlay = "true"/>
					</view>
				
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showMinzu = !showMinzu" label="民族" prop="minzu" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.minzu"  placeholder="请选择民族" />
						</u-form-item>
						<u-picker @confirm="selectMinzu" @close="showMinzu=false" @cancel="showMinzu=false" :show="showMinzu" visibleItemCount=5
						:columns="[['汉族','满族','回族','蒙古族','藏族','苗族','维吾尔族','彝族','壮族','布依族','白族','朝鲜族','侗族','哈尼族','哈萨克族','土家族','瑶族','达斡尔族','东乡族','高山族','景颇族','柯尔克孜族','拉祜族','纳西族','畲族','傣族','黎族','傈僳族','仫佬族','羌族','水族','土族','佤族','阿昌族','布朗族','毛难族','普米族','撒拉族','塔吉克族','锡伯族','仡佬族','保安族','崩龙族','俄罗斯族','鄂温克族','京族','怒族','乌孜别克族','裕固族','独龙族','鄂伦春族','赫哲族','基诺族','珞巴族','门巴族','塔塔尔族']]" 
						:closeOnClickOverlay = "true"/>
					
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showSex = !showSex" label="性别" prop="sexLabel" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.sexLabel"  placeholder="请选择性别" />
							<u--input style="display: none;" inputAlign="right" v-model="editUserInfo.sex"  placeholder="请选择性别" />
						</u-form-item>
						<u-picker @confirm="selectSex" @close="showSex=false" @cancel="showSex=false" :show="showSex" keyName="label"
						:columns="[[{'label':'男','value':1},{'label':'女','value':2}]]" 
						:closeOnClickOverlay = "true"/>
						
					</view>
					<view class='item acea-row row-between-wrapper' style="display: none;">
						<u-form-item label="年龄" prop="nianling" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.nianling"  placeholder="请输入年龄" />
						</u-form-item>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
				
						<u-form-item @tap="showOrgselect" label="选择阵地" prop="orgName" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.orgName"  placeholder="请选择阵地" />
							<u--input style="display: none;" inputAlign="right" v-model="editUserInfo.orgId" />
						</u-form-item>
						
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="详细地址" prop="addres" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input inputAlign="right" v-model="editUserInfo.addres"  placeholder="请输入详细地址" />
						</u-form-item>
					</view>
					<view class='item acea-row row-between-wrapper'>
						
						<u-form-item  @tap="showGrjn = !showGrjn" label="个人技能" prop="grjn" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly  inputAlign="right" v-model="editUserInfo.grjn"  placeholder="请选择个人技能" />
						</u-form-item>
						<u-picker @confirm="selectGrjn" @close="showGrjn=false" @cancel="showGrjn=false" :show="showGrjn"
						:columns="[['外语','书法','绘画','电脑维修','文化辅导','编辑写作','话剧演出','节目主持','电脑编程','摄影','漫画','唱歌','推拿按摩','创意策划','处理应变','社交外联','人事管理','平面设计']]" 
						:closeOnClickOverlay = "true"/>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showLingyu = !showLingyu" label="实践分类" prop="wmsjType" labelWidth="180rpx" labelPosition="left" ref="editUserInfo">
							<u--input readonly inputAlign="right" v-model="editUserInfo.wmsjType" 
							 placeholder="请选择实践分类" />
						</u-form-item>
						<u-picker @confirm="selectLingyu" @close="showLingyu=false" @cancel="showLingyu=false" :show="showLingyu"
						:columns="[dict.type.wmsj_lingyu]" keyName="label" :closeOnClickOverlay = "true"/>
						
					</view>
					<view class='item acea-row row-between-wrapper' style="display: none;">
						<view>服务时间</view>
						<view class='input'>
							<input type='text' name='wmsjFuwj' :value='editUserInfo.wmsjFuwj' maxlength="20"></input>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>自我介绍</view>
                        <u--textarea  v-model='editUserInfo.zwjs' placeholder="请输入内容"  confirmType="done" maxlength="200" 
							 style="border: 2px #eeeeee solid;width: 460rpx;height: 180rpx;margin-left: 20rpx;"/>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>入会宣言</view>
						<u--textarea  v-model='editUserInfo.wmsjSay' placeholder="请输入内容"  confirmType="done" maxlength="200"
							 style="border: 2px #eeeeee solid;width: 460rpx;height: 180rpx;margin-left: 20rpx;"/>
					</view>
				</u--form>
			</view>
		
			<button class='modifyBnt bg_color' @click="showSubmit=true">提交申请</button>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		
		<!-- 基础用法 -->
		<view style="margin-top: 0;" v-show="orgselect">
			<luyj-tree v-slot:default="{item}" @sendValue="seletOrg" @cancle="orgselect=false" :trees="orgTrees" :isCheck="true">
				<!-- 内容插槽 -->
				<view>
					<view class="content-item">
						<view class="word">{{item.name}}</view>
					</view>
				</view>
			</luyj-tree>
		</view>
		
		<u-modal title="提交提示" content="您确认提交信息吗？提交信息后您账号的信息由您选择的阵地进行管理,后期不可修改,请谨慎选择." 
		:show="showSubmit" @confirm="confirm" showCancelButton @cancel="showSubmit=false" cancelText="取消" ref="uModal"
		 :asyncClose="true"></u-modal>
	</view>
</template>

<script>
	import {userWmsjEdit,getLogout} from '@/api/user.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	import {Debounce} from '@/utils/validate.js'
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	let app = getApp();
	export default {
		dicts: ['sys_normal_disable','wmsj_lingyu'],
		components: {
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				max:3,
				orgTrees:[],
				orgselect:false,
				showLingyu:false,
				showZzmm:false,
				showZhiye:false,
				showMinzu:false,
				showSex:false,
				showGrjn:false,
				showWhcd:false,
				showSubmit:false,
				loginType: 'h5', //app.globalData.loginType
				userIndex: 0,
				newAvatar: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				wechat:false,
				theme:app.globalData.theme,
				editPng:'../../../static/images/alert1.png',
				editUserInfo:{
					realName:'',
					cardId:'',
					orgName:'',
					orgId:'',
				},
				rules:{
					'realName': {
						type: 'string',
						required: true,
						message: '请输入真实姓名',
					},
					'orgName': {
						type: 'string',
						required: true,
						message: '请选择文明实践阵地',
					},
					'cardId': {
						type: 'string',
						required: true,
						message: '请输入身份证号码',
					},
				},
			};
		},
		computed: mapGetters(['isLogin', 'uid', 'userInfo']),
		
		mounted(){
			this.$store.dispatch('USERINFO').then(data => {
				this.editUserInfo=data;
				if(data.sex==1) this.editUserInfo.sexLabel='男';
				if(data.sex==2) this.editUserInfo.sexLabel='女';
			});
		},
		onLoad() {
			if (!this.isLogin) {
				toLogin();
			}
			this.orgTree()
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.$set(this,'wechat',false);
			}else{
				this.$set(this,'wechat',true);
			}
			// #endif
			switch (this.theme){
				case 'theme2':
					this.editPng = '../../../static/images/alert2.png'
					break;
				case 'theme3':
					this.editPng = '../../../static/images/alert3.png'
					break;
				case 'theme4':
					this.editPng = '../../../static/images/alert4.png'
					break;
				case 'theme5':
					this.editPng = '../../../static/images/alert5.png'
					break;
				default:
				this.editPng = '../../../static/images/alert1.png'
					break;
			}
		},
		methods: {
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			seletOrg: function(e){
				this.orgselect=false;
				this.editUserInfo.orgName=e[0].name;
				this.editUserInfo.orgId=e[0].id;
			},
			selectLingyu: function(e){
				this.showLingyu=false;
				this.editUserInfo.wmsjType=e.value[0].value;
			},
			selectZzmm: function(e){
				this.showZzmm=false;
				this.editUserInfo.zzmm=e.value[0];
			},
			selectZhiye: function(e){
				this.showZhiye=false;
				this.editUserInfo.zhiye=e.value[0];
			},
			selectMinzu: function(e){
				this.showMinzu=false;
				this.editUserInfo.minzu=e.value[0];
			},
			selectSex: function(e){
				this.showSex=false;
				this.editUserInfo.sexLabel=e.value[0].label;
				this.editUserInfo.sex=e.value[0].value;
			},
			selectGrjn: function(e){
				this.showGrjn=false;
				this.editUserInfo.grjn=e.value[0];
			},
			selectWhcd: function(e){
				this.showWhcd=false;
				this.editUserInfo.whcd=e.value[0];
			},
			showOrgselect(){
				if(this.editUserInfo.orgId){
					
					return
				}
				this.orgselect=true;
			},
			/**
			 * 小程序设置
			 */
			Setting: function() {
				uni.openSetting({
					success: function(res) {
						console.log(res.authSetting)
					}
				});
			},
			orgTree: function() {
				let that = this;
				let orgtree=[];
				getOrgTree().then(res => {
					orgtree=that.$util.handleTree(res.data, "id");
					that.$set(that, 'orgTrees', orgtree);
				});
			},
			/**
			 * 上传文件
			 * 
			 */
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne({
					url: 'user/upload/image',
					name: 'multipart',
					model: "user",
					pid: 7
				}, function(res) {
					that.newAvatar = res.data.url;
				});
			},
			confirm(){
				this.showSubmit=false
				this.formSubmit();
			},
			/**
			 * 提交修改
			 */
			formSubmit: Debounce(function(e) {
				let that = this
				that.editUserInfo.avatar = that.newAvatar?that.newAvatar:that.editUserInfo.avatar;
				
				
				that.$refs.form1.validate().then(res => {
					userWmsjEdit(that.editUserInfo).then(res => {
						that.$store.commit("changInfo", {
							amount1: 'avatar',
							amount2: that.newAvatar
						});
						that.editUserInfo.groupId=2
						that.$store.dispatch('USERINFO').then(data => { });
						return that.$util.Tips({
							title: '文明实践系统信息已修改',
							icon: 'success'
						}, {
							tab: 3,
							url: 1
						});
					
					}).catch(msg => {
						uni.showToast({
							title: msg|| '保存失败，您并没有修改',
							duration: 6000,
							icon:'none'
						})
					});
				}).catch(errors => {
					
				})
							
				
			})
		}
	}
</script>

<style scoped lang="scss">
	.disabled{
		background-color: #eeeeee;
	}

	.personal-data .list {
		margin-top: 30rpx;
		background-color: #fff;
	}

	.personal-data .list .item {
		border-bottom: 1rpx solid #f2f2f2;
		padding:  0rpx 24rpx;
		font-size: 32rpx;
		color: #282828;
		width: 690rpx;
	}
	.u-form-item{
		width: 640rpx;
	}

	.personal-data .list .item .phone {
		width: 160rpx;
		height: 56rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 56rpx;
		border-radius: 32rpx
	}

	.personal-data .list .item .pictrue {
		width: 88rpx;
		height: 88rpx;
		position: relative;
	}

	.personal-data .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.personal-data .list .item .pictrue .alter {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 0;
		right: 0;
	}


	.personal-data .list .item .input .id {
		width: 365rpx;
	}

	.personal-data .list .item .input .iconfont {
		font-size: 35rpx;
	}

	.personal-data .modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 76rpx auto 0 auto;
	}
	.bg_color{
		@include main_bg_color(theme);
	}
	.personal-data .logOut {
		font-size: 32rpx;
		text-align: center;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 30rpx auto 0 auto;
	}
</style>
