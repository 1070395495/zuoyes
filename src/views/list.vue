<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="el_card_box">
      <!-- 1.搜索框，添加用户按钮 -->
      <el-input
        placeholder="请输入内容"
        @input="searchUser"
        v-model.trim="pageinfo.query"
        class="searchInput"
        clearable
      >
        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
      <el-button type="primary" class="adduser" @click="addUser">添加用户</el-button>

      <!-- 2.添加用户表格 -->
      <el-table :data="tableData" class="user_table" border style="width: 100%">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="注册时间">
          <!-- {{ create_time | date }} -->
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.create_time | date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setUserStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showUserDialog(scope.row)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
              <el-button type="warning" icon="el-icon-star-off" circle size="mini"></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 3.添加分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageinfo.pagenum"
        :page-sizes="[2,3,4,5]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleUser">
        <el-form
          :model="userForm"
          ref="adduser"
          :rules="userRules"
          label-position="left"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleUser = false">取 消</el-button>
          <el-button type="primary" @click="addUserData">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleUserDel">
        <el-form
          :model="userForm"
          ref="adduser"
          :rules="userRules"
          label-position="left"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" disabled autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleUserDel = false">取 消</el-button>
          <el-button type="primary" @click.prevent="editUserOk">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getUser,modifyUserStaus,editUserInfo,postUser} from '@/http/api'
import _ from "lodash";
export default {
  name: "userlist",
  data() {
    return {
      //编辑用户的显示状态
      dialogFormVisibleUserDel: false,
      flag: true,
      //添加用户验证规则
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      },
      pageinfo: {
        query: "",
        pagenum: 1, //当前页码 第1页，第二页
        pagesize: 2 //显示每页条数
      },
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      total: 0,
      tableData: [],
      //添加用户的显示状态
      dialogFormVisibleUser: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    /**
     * 编辑用户，真正将修改的用户信息写入后台数据库
     */
    async editUserOk() {
      let {id,email,mobile} =this.userForm;
    
        editUserInfo(id,{email,mobile})
      this.dialogFormVisibleUserDel=false;
    },
    /**
     * 编辑用户信息,打开编辑用户对话框
     */
    showUserDialog(user) {
      //1.先显示弹框
      this.dialogFormVisibleUserDel = true;
      //2.显示要编辑的内容
      this.userForm = user;
    },
    /**
     * 通过switch改变用户的状态
     */
    async setUserStatus(user) {
      // `users/${user.id}/state/${user.mg_state}`
      const result=modifyUserStaus(user)
      console.log('修改用户状态：',result)
    },
    /**
     * 向后台确认添加新用户
     */
    addUserData() {
      /**
       * 添验证规则步骤：
       * 1.给el-for绑定 :rules属性，规则
       */
      //console.log(this.userForm)
      this.$refs.adduser.validate(valid => {
        if (valid) {
          //向后台添加用户数据
          //1.添加到数据到后台
          postUser(this.userForm).then(res => {
            console.log(res);
            //解构获取添加用户的信息
            const {
              meta: { msg, status }
            } = res.data;
            //添加成功给出成功提示
            if (status === 201) {
              this.$message({
                message: msg,
                type: "success"
              });
            } else {
              this.$message({
                message: msg,
                type: "error"
              });
            }
          });
          //2.刷新页面展示已添加的用户
          this.getUserList();
          this.userForm = {
            username: "",
            password: "",
            email: "",
            mobile: ""
          };
        } else {
          //验证失败
          console.log("error submit!!");
          return false;
        }
        this.dialogFormVisibleUser = false;
      });
    },
    /**
     * 添加用户，显示弹框
     */
    addUser() {
      this.userForm = {
            username: "",
            password: "",
            email: "",
            mobile: ""
          };
      this.dialogFormVisibleUser = true;
    },
    /**
     * 搜索用户
     */
    searchUser: _.throttle(
      function() {
        //获取去除空格后的输入内容
        // this.pageinfo.query=this.pageinfo.query.trim()
        //query.length===0代表搜索全部用户列表，否则搜索包含有关键字的用户列表
        // let _this=this;
        this.getUserList();
      },
      3000,
      { leading: false }
    ),
    /**
     * query:查询参数可以为空
     * pagenum:当前页码不能为空
     * pagesize:每页显示条数不能为空
     */
    //获取用户列表
   getUserList() {
    getUser(this.pageinfo).then((result)=>{
        console.log(result)
         this.tableData = result.data.data.users;
          this.pageinfo.pagenum = result.data.data.pagenum;
          this.total = result.data.data.total;
    })
         
    },
    //分页相关的方法
    //每页条数不同时触发的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageinfo.pagesize = val;
      this.getUserList();
    },
    //当前页码方法
    handleCurrentChange(val) {
      console.log('当前页: '+val);
      this.pageinfo.pagenum = val;
      this.getUserList();
    }
  }
};
</script>

<style lang="scss" scoped>
.el_card_box {
  margin-top: 20px;
}
.searchInput {
  width: 300px;
}
.adduser {
  margin-left: 20px;
}
.user_table {
  margin-top: 20px;
}
</style>