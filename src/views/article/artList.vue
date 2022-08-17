<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="obj in cateList"
                :key="obj.id"
                :label="obj.cate_name"
                :value="obj.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <!-- 因为整个表单要发给后台，去提前看眼vue代码里绑定的值需要什么，发现接口文档里要的是分类id -->
            <el-option
              v-for="obj in cateList"
              :key="obj.id"
              :label="obj.cate_name"
              :value="obj.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="pubForm.content"
            @blur="contentChangeFn"
          ></quill-editor>
        </el-form-item>
        <!-- 封面标签 -->
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
            @click="chooseImgFn"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="changeCoverFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI } from "@/api";
import defaultImg from "@/assets/images/cover.jpg";
export default {
  name: "ArtList",
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: "",
      },
      pubDialogVisible: false, // 控制发布文章对话框出现/隐藏(true/false)
      pubForm: {
        // 表单的数据对象
        title: "", // 文章分类标题
        cate_id: "", // 文章分类id
        content: "", // 文章内容
        cover_img: "", // 用户选择的封面图片
        state: "", // 发布状态(值：已发布，草稿)
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "文章标题的长度为1-30个字符",
            trigger: "blur",
          },
        ],
        cate_id: [
          { required: true, message: "请选择文章标题", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        cover_img: [
          { required: true, message: "请选择文章封面", trigger: "change" },
        ],
      },
      cateList: [], // 保存文章分类列表
    };
  },
  created() {
    // 请求分类数据
    this.getCateListFn();
  },
  methods: {
    // 发表文章按钮的点击事件
    showPubDialogFn() {
      this.pubDialogVisible = true;
    },
    // 发布文章-对话框-关闭前的回调
    async handleClose(done) {
      // done的作用：调用就会关闭对话框
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        "此操作将导致文章信息丢失，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //   取消了关闭-阻止住，什么都不干
      if (confirmResult === "cancel") return;
      // 确认关闭
      done();
    },
    // 请求分类数据
    async getCateListFn() {
      const { data: res } = await getArtCateListAPI();
      this.cateList = res.data;
    },
    // 选择封面的回调
    chooseImgFn() {
      this.$refs.iptFileRef.click();
    },
    // 用户选择了封面文件
    changeCoverFn(e) {
      // 获取用户选择的文件列表
      const files = e.target.files;
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null;
        // js代码中不能写路径，webpack打包时会把路径当作字符串
        this.$refs.imgRef.setAttribute("src", defaultImg);
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0];
        // 把图片文件，要显示到img标签里
        const url = URL.createObjectURL(files[0]);
        this.$refs.imgRef.setAttribute("src", url);
      }
      // 让表单单独校验封面的值
      this.$refs.pubFormRef.validateField("cover_img");
    },
    // 表单里（点击发布/存为草稿）按钮点击事件->准备调用后端接口
    pubArticleFn(str) {
      // str的值“已发布”，或者“草稿”（后端要求的参数值）
      this.pubForm.state = str; // 保存到统一表单对象上

      // 兜底校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (valid) {
          // 都通过
          const fd = new FormData(); // 准备一个表单数据对象的容器，FormData类是HTML5新出的专门为了装文件内容和其他参数的一个容器
          // fd.append('参数名',值)
          fd.append("title", this.pubForm.title);
          fd.append("cate_id", this.pubForm.cate_id);
          fd.append("content", this.pubForm.content);
          fd.append("cover_img", this.pubForm.cover_img);
          fd.append("state", this.pubForm.state);

          const { data: res } = await uploadArticleAPI(fd);
          if (res.code !== 0) return this.$message.error("发布文章失败！");
          this.$message.success("发布文章成功！");

          // 关闭对话框
          this.pubDialogVisible = false;
        } else {
          return false; // 阻止默认行为(因为按钮有默认提交行为)
        }
      });
    },
    // 富文本编辑器内容改变触发此事件方法
    contentChangeFn() {
      // 如何让el-form只校验content这个规则
      this.$refs.pubFormRef.validateField("content");
    },
    // 新增文章对话框关闭时清空表单
    dialogCloseFn() {
      this.$refs.pubFormRef.resetFields();
      // 我们需要手动给封面标签img重新设置一个值，因为它没有受到v-model影响
      this.$refs.imgRef.setAttribute("src", defaultImg);
    },
  },
};
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>
