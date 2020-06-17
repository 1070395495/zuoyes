<template>
  <div class="form_box">
    <el-form
      label-position="right"
      label-width="60px"
      class="login_Form"
      :model="ruleForm"
      :rules="rules"
      ref="login_Form"
      @submit.native.prevent
    >
      <div class="form-title">
        <h2>用户登录</h2>
      </div>
      <el-form-item label="帐号" prop="username">
        <el-input v-model="ruleForm.username" type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>

      <div class="form-btn">
        <el-button type="primary" @click.prevent="goLogin">登录</el-button>
        <el-button type="info">重置</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import axios from "axios"
import {login} from "@/http/api"
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 25, message: "长度在 6到 25 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 25, message: "长度在 6 到 25 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    goLogin() {
      this.$refs["login_Form"].validate(valid => {
        //表单通过validate方法实现整体表单难，其中valid为true代表所有验证规则通过,否则报错
        if (valid) {
          //向后台提交用户信息  axios
          login(this.ruleForm).then(result => {
              console.log("登录成功返回的数据：", result);
              //解构赋值
              const {
                data: res,
                meta: { msg, status }
              } = result.data;
              const { token } = res;
              if (status === 200) {
                //1.存token  cookie,localStorage,sessionStorage
                localStorage.setItem("token", token); //二次封装 set() get(),remove()
                //2.跳转到后台首页
                this.$router.push("/");
                //3.登录成功提示
                this.$message({
                  message: "登录成功",
                  type: "success"
                });
              } else if(status===400) {
                  console.log(222222)
                //登录失败提示
                this.$message({
                  message: msg,
                  type: "error"
                });
              }
            })
            .catch(error => {
              console.log("error:", error);
             //登录失败提示
                this.$message({
                  message: "登录失败",
                  type: "error"
                });
            });
        } else {
          //登录失败，给出失败的提示
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login_Form {
  width: 40%;
  height: 40%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  text-align: center;
  background: #fff;
  padding: 30px 20px 10px 20px;
  border-radius: 10px;
}
.form-title {
  line-height: 40px;
}
// @media screen and (max-width: 850px) {
//   .login_Form {
//     width: 400px;
//   }
// }
.form_box {
  background: deepskyblue;
  height: 100%;
  font-size: 12px;
}
</style>