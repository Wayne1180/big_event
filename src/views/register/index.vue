<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="form" :model="form" class="regForm" :rules="rulesObj">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            placeholder="请再次确认密码"
            v-model="form.repassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerFn" class="btn-reg"
            >注册</el-button
          >
          <el-link type="info" @click="goLoginFn">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 经验：前端绑定数据对象属性名，可以直接跟要调用的功能接口的参数名一致
// 好处：可以直接把前端对象(带着同名的属性和前端的值)发给后台
import { registerAPI } from "@/api";
export default {
  name: "my-register",
  data() {
    // 定义校验函数
    // 注意：必须在data函数里定义此箭头函数，才能确保this.form使用
    const samePwdFn = (rule, value, callback) => {
      if (value !== this.form.password) {
        // 如果验证失败，则调用回调函数时，指定一个Error对象
        callback(new Error("两次输入的密码不一致！"));
      } else {
        // 如果验证成功，则直接调用callback回调函数即可
        callback();
      }
    };
    return {
      // 表单数据对象
      form: {
        username: "", // 用户名
        password: "", // 密码
        repassword: "", // 确认密码
      },
      // 表单规则对象
      rulesObj: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10位的大小写字母数字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15位的非空字符",
            trigger: "blur",
          },
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15位的非空字符",
            trigger: "blur",
          },
          { validator: samePwdFn, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 注册的点击事件
    registerFn() {
      // JS兜底校验
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 通过校验，拿到绑定的数据
          // const res = await registerAPI(this.form);
          // console.log(res);
          // 1.调用注册接口 这里又是一个解构赋值，把axios返回的数据对象里data字段对应的值保存在res上
          const { data: res } = await registerAPI(this.form);
          // 2.注册失败，提示用户
          // return必须：阻止代码往下执行
          if (res.code !== 0) return this.$message.error(res.message);
          // 3.注册成功，提示用户
          this.$message.success(res.message);
          // 4.跳转到登录页面
          this.$router.push("/login");
        } else {
          return false; // 阻止默认提交行为(表单下面红色提示会自动出现)
        }
      });
    },
    goLoginFn() {
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.reg-container {
  background: url("../../assets/images/img32.jpg");
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .reg-box {
    width: 400px;
    height: 350px;
    // background-color: #fff;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      background: url("../../assets/images/login_title.png") center no-repeat;
    }
    .btn-reg {
      width: 100%;
    }
    .regForm {
      padding: 0 20px;
    }
  }
}
</style>
