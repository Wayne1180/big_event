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
            <el-button type="primary" size="small" @click="chooseFn"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetFn"
              >重置</el-button
            >
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
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span> {{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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

    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img
        v-if="artDetail.cover_img"
        :src="baseURL + artDetail.cover_img"
        alt=""
      />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { baseURL } from "@/utils/request";
import {
  getArtCateListAPI,
  uploadArticleAPI,
  getArtListAPI,
  getArtDetailAPI,
  delArticleAPI,
} from "@/api";
import defaultImg from "@/assets/images/cover.jpg";
export default {
  name: "ArtList",
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 默认当前页需要几条数据(传递给后台，后台就返回几个数据)
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
      artList: [], // 保存文章列表
      total: 0, // 保存现有文章的总数
      detailVisible: false, // 用于查看文章详情的对话框(显示/隐藏)
      artDetail: {}, // 文章详情
      baseURL,
    };
  },
  created() {
    // 请求分类数据
    this.getCateListFn();
    // 请求文章列表
    this.getArticleListFn();
  },
  methods: {
    // 获取所有文章列表
    async getArticleListFn() {
      const { data: res } = await getArtListAPI(this.q);
      this.artList = res.data; // 保存当前获取的文章列表（注意：有分页不是所有数据）
      this.total = res.total; // 保存总数
    },
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
          // 刷新列表 再次请求文章列表数据
          this.getArticleListFn();
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
    // 根据选择的页码/条数，影响q对象对应属性的值，再重新发一次请求让后台重新返回数据
    // 分页-每页条数改变触发
    handleSizeChangeFn(sizes) {
      // sizes：当前需要每页显示的条数
      // 因为Pagination的标签上已经加了.sync，子组件内会双向绑定到右侧vue变量上(q对象里pagesize已经改变了)
      // 如果不放心，可以再写一遍
      this.q.pagesize = sizes;
      this.q.pagenum = 1;
      this.getArticleListFn();
    },
    // 当前页码改变时触发
    handleCurrentChangeFn(nowPage) {
      // nowPage:当前要看的第几页，页数
      this.q.pagenum = nowPage;
      this.getArticleListFn();
    },
    // 筛选按钮的点击事件
    chooseFn() {
      // 当有了筛选的条件，想让页码回归1，每页的条数回归2
      this.q.pagenum = 1;
      this.q.pagesize = 2;
      this.getArticleListFn();
    },
    // 重置按钮的点击事件
    resetFn() {
      this.q.pagenum = 1;
      this.q.pagesize = 2;
      this.q.cate_id = "";
      this.q.state = "";
    },
    // 文章标题点击事件 为了查看详情
    async showDetailFn(artId) {
      this.detailVisible = true;
      // artId: 文章id值
      const res = await getArtDetailAPI(artId);
      this.artDetail = res.data.data;
    },
    // 删除文章按钮的点击事件
    async removeFn(id) {
      // 1.询问用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文章，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 2.取消了删除
      if (confirmResult === "cancel") return;
      // 执行删除的操作
      const { data: res } = await delArticleAPI(id);
      if (res.code !== 0) return this.$message.error("删除失败！");
      this.$message.success("删除成功！");

      // 数组里面只保存当前页的数据，别的页的需要传参q给后台获取覆盖
      // 1的原因：虽然你调用删除接口但是那是后端删除，前端数组里你没有代码去修改它
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--;
        }
      }

      // 把分页和筛选条件重置，让表格的数据重新请求一次
      this.resetFn();
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

// ::v-deep .ql-editor {
//   min-height: 300px;
// }

:deep(.ql-editor) {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
:deep(.detail-box) {
  img {
    width: 500px;
  }
}
</style>
