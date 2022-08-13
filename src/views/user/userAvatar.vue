<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" :src="avatar" alt="" v-if="avatar" />
      <img class="the_img" src="../../assets/images/avatar.jpg" alt="" v-else />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFn"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from "@/api";
export default {
  name: "UserAvatar",
  data() {
    return {
      avatar: "", // 保存图片
    };
  },
  methods: {
    // 选择图片->点击事件->让选择框出现
    chooseImg() {
      // 模拟点击行为
      this.$refs.iptRef.click();
    },
    // 在选择框中选择图片后触发的改变事件
    onFileChange(e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files;
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = "";
      } else {
        // 选择了图片
        // 方法1
        // this.avatar = URL.createObjectURL(files[0]);
        // 方法2
        // 1. 创建 FileReader 对象
        const fr = new FileReader();
        // 2. 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0]);
        // 3. 监听 fr 的 onload 事件
        fr.onload = async (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result;
          //   const res = await updateUserAvatarAPI(this.avatar);
          //   console.log(res);
        };
      }
    },
    // 上传头像的回调
    async uploadFn() {
      const res = await updateUserAvatarAPI(this.avatar);
      console.log(res);
      if (res.data.code !== 0) return this.$message.error(res.data.message);
      this.$message.success(res.data.message);
      this.$store.dispatch("getUserInfoActions");
    },
  },
};
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
