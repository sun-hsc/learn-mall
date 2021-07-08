<template>
  <div class="params">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--:closable="false" 关闭文字提示按钮 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
        @click="addDialogVisible = true"
      ></el-alert>

      <!-- 级联选着器 -->
      <el-row>
        <el-col>
          <span>商品分类：</span>
          <!--v-model 选中的值    :options 列表值（树形结构） :props配置触发选项 -->
          <el-cascader
            clearable
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeTabsName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!--动态参数表格-->
          <el-table :data="manyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>

                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加动态参数面板 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!--静态参数表格-->
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>

                <!-- 输入Tag文本框 -->
                <!-- @keyup.enter.native 获得焦点-->
                <!-- @blur 失去焦点-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>

                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + getTitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFromRef" :model="addFrom" :rules="addFromRules" label-width="80px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + getTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFromRef" :model="editFrom" :rules="editFromRules" label-width="80px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 *            功能实现的主要逻辑
 * 1.业务逻辑，通过联级选着器获取到需要操作对象的数据
 * 2.利用计算属性对联级选着器的数据进行判断并返回需要的 id 和 参数
 * 3.根据计算属性返回的 id 和 参数 做页面渲染和数据请求   以此来减少重复的代码编辑
 * 4.在具体的功能 根据 id 和 参数 做判断进行网络请求
 */
/**
 *            具体参数的添加和修改以及删除
 * 按钮和文本以的交替
 * 1.利用v-if
 * 2.编辑文本获取焦点和失去焦点的事件
 * 3.利用$nextTick()做回调用于实现文本渲染后获取焦点
 * 4.通过遍历标签时拿到当前数据以及id，根据计算属性获取删除的是动态还是静态的参数发送网络请求
 */
export default {
  data() {
    return {
      cateList: [],
      // 级联选择框选中的对象
      selectedCateKeys: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   激活页签名称
      activeTabsName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      //   控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      addFrom: {
        attr_name: ''
      },
      addFromRules: {
        attr_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      // 修改对话框显示和隐藏
      editDialogVisible: false,
      editFrom: {},
      editFromRules: {
        attr_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  mounted() {},
  computed: {
    // 当前选中的三级分类Id
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    //   按钮需要被禁用返回true, 否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 静态和动态切换时改变对话框的参数
    getTitleText() {
      if (this.activeTabsName === 'many') {
        return '动态属性'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取所有商品参数列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！')
      }
      this.cateList = res.data
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 没有选中三级标题id就重置表格,选中就发送网络请求获取参数
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //  根据所选分类的Id,和当前面板的参数, 获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, {
        params: { sel: this.activeTabsName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      res.data.forEach(item => {
        //  通过三元表达式判断item.attr_vals的true或者false  决定是否为空
        //  避免截取到空字符到数组中进行渲染
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        /**
         * stringObject.split(separator,howmany)
         * separator参数：必需填。字符串或正则表达式，从该参数指定的地方分割 stringObject。
         * howmany参数：可选。该参数可指定返回的数组的最大长度。
         */
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''
      })
      if (this.activeTabsName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      // console.log(res.data)
    },
    // 联级选择框 选中变化 触发
    handleChange() {
      this.getParamsData()
    },
    // 动态和静态参数切换时更新数据
    handleClick() {
      this.getParamsData()
    },
    // 添加动态属性和静态属性
    addParams() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.getCateId}/attributes`, {
          attr_name: this.addFrom.attr_name,
          attr_sel: this.activeTabsName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 显示编辑对话框
    async showEditDialog(attrId) {
      //  获取当前对象的id进行查询改对象的参数
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeTabsName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
      // console.log(res.data)
    },
    // 重置修改表单
    addDialogClosed() {
      this.$refs.addFromRef.resetFields()
    },
    // 修改参数
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeTabsName
          }
        )
        // console.log(res.data)
        if (res.meta.status !== 200) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 重置修改表单
    editDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    removeParams(attrId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            let res = this.$http.delete(`categories/${this.getCateId}/attributes/${attrId}`)
            resolve(res)
          })
        })
        .then(res => {
          let { data: res2 } = res
          this.$message.success(res2.meta.msg)
          this.getParamsData()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击按钮显示输入框
    showInput(row) {
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        // 获取文本空的焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm(row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)

      // trim() 方法用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等
      // trim() 方法不会改变原始字符串
      // trim() 方法不适用于 null, undefined, Number 类型
    },
    // 文本框失去焦点时保存添加的数据
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
          // join() 方法用于把数组中的所有元素放入一个字符串。
          //  join(' ') 以''分隔开
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 10px;
}

.el-tag {
  margin: 8px;
}

.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 120px;
}
</style>
