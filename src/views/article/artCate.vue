<template>
  <div>
    <!-- 预览文章分类 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn"
          >添加分类</el-button
        >
      </div>
      <!-- 分类数据的表格 -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值 -->
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope"
            ><el-button type="primary" size="mini" @click="editFn(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="deleteFn(scope.row)"
              >删除</el-button
            ></template
          >
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加文章分类的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="onAddClosedFn"
    >
      <span>
        <!-- 添加的表单 -->
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cate_name">
            <el-input
              v-model="addForm.cate_name"
              minlength="1"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input
              v-model="addForm.cate_alias"
              minlength="1"
              maxlength="15"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 经验：如果用同一个按钮，想要做状态区分
// 1.定义一个标记变量isEdit(true编辑，false新增)，还要定义本次要编辑的数据唯一id值，editId
// 2.在点击修改的时候，isEdit改为true，editId保存要修改的数据id
// 3.在点击新增按钮的时候，isEdit改为false，editId置空
// 4.在点击保存按钮时（确定按钮时），就可以用isEdit变量做区分了
import {
  getArtCateListAPI,
  addArtCateListAPI,
  updateArtCateAPI,
  deleteArtCateAPI,
} from "@/api";
export default {
  name: "ArtCate",
  data() {
    return {
      cateList: [], // 文章分类数组
      dialogVisible: false, // 增加文章分类对话框显示与隐藏
      addForm: {
        // 添加表单的数据对象
        cate_name: "",
        cate_alias: "",
      },
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            pattern: /^\S{1,10}$/,
            message: "分类名必须是1-10位的非空字符",
            trigger: "blur",
          },
        ],
        cate_alias: [
          { required: true, message: "请输入分类别名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: "分类别名必须是1-15位的字母数字",
            trigger: "blur",
          },
        ],
      },
      isEdit: false, // true为编辑状态，false新增状态
      editId: "", // 保存正在要编辑的数据id值
    };
  },
  created() {
    // 获取文章分类列表
    this.getArtCateFn();
  },
  methods: {
    // 获取文章分类列表
    async getArtCateFn() {
      const res = await getArtCateListAPI();
      this.cateList = res.data.data;
    },
    // 添加分类按钮点击事件
    addCateShowDialogFn() {
      this.isEdit = false; // 变回新增状态标记
      this.editId = "";
      this.dialogVisible = true;
    },
    // 对话框确定按钮点击事件
    confirmFn() {
      // 兜底校验
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          // 通过校验
          if (this.isEdit) {
            // 要修改
            // 再往对象上面添加一个属性

            // 添加方式一
            // this.addForm.id = this.editId; // 把要编辑的文章分类id添加到对象上
            // const { data: res } = await updateArtCateAPI(this.addForm);

            // 添加方式二
            const { data: res } = await updateArtCateAPI({
              id: this.editId,
              ...this.addForm,
            });
            if (res.code !== 0) return this.$message.error(res.message);
            this.$message.success(res.message);
            this.getArtCateFn();
            this.dialogVisible = false;
          } else {
            // 要新增
            const { data: res } = await addArtCateListAPI(this.addForm);
            if (res.code == 0) {
              this.$message.success(res.message);
            } else {
              return this.$message.error(res.message);
            }

            // 再重新请求一次文章列表，拿到最新数据，让表格更新
            // 生命周期的方法比如created，不会挂载到this身上，无法this.created
            this.getArtCateFn();
            this.dialogVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    // 对话框取消按钮
    cancelFn() {
      this.dialogVisible = false;
    },
    onAddClosedFn() {
      this.$refs.addRef.resetFields();
    },
    // 修改文章列表
    editFn(obj) {
      // obj的值：{id：文章分类id，cate_name:文章分类名字，cata_alias:文章分类别名}
      this.isEdit = true;
      this.editId = obj.id;
      this.dialogVisible = true;

      // 让el-dialog第一次挂在el-form时，先用addForm空字符串初始值绑定到内部，后续用作resetFields重置
      // 所以让真实DOM先创建并在内部绑定好复制好初始值

      // 接着我们真实DOM更新后绑定好了，咱们再给数据回显
      this.$nextTick(() => {
        // 数据回显（回填）
        this.addForm.cate_name = obj.cate_name;
        this.addForm.cate_alias = obj.cate_alias;
      });
    },
    // 删除文章分类
    async deleteFn(obj) {
      this.$confirm("确定删除该文章分类吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await deleteArtCateAPI(obj.id);
          if (res.code !== 0) return this.$message.error("删除分类失败！");
          // this.$message.success("删除分类成功！");
          // 重新请求列表数据
          this.getArtCateFn();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>