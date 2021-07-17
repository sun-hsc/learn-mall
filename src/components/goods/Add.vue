<template>
  <div class="add">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :active="activeIndex - 0"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <!-- Tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--v-model 选中的值    :options 列表值（树形结构） :props配置触发选项 -->
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- on-preview  点击文件列表中已上传的文件时的钩子 -->
            <!-- on-remove  文件列表移除文件时的钩子 -->
            <!-- headers 设置上传的请求头部 -->
            <!-- on-success 文件上传成功时的钩子 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="picPreviewPath" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
//      业务逻辑
/**
 * 利用步骤条和tabs组件通过绑定同一个数值做绑定。一个类型为string一个为number，所以使用字符'0'，通关'0'-0做数值转换
 * 用表单包裹包裹tabs做表单验证和数据提交
 * 通过v-for渲染静态属性和动态参数
 * 利用upload组件完成图片上传
 * 利用富文本编辑图片的信息
 * 利用深拷贝的方法解决提交服务器的数据和组件渲染数据的类型问题
 */
/**   图片上传组件需要注意的地方
 * 上传使用的是组件内部封装好的网络请求，需要给组件配置上传路径
 * 上传后在数据库中图片名字重新命名了，需要用调用组件上传成功的回调函数拿到图片名字存放到上传的表单数据中
 * 实现图片预览需要获取上传成功后，后端返回的路径访问地址
 */
/**
 *    富文本插件的使用
 */
//    局部注册富文本插件
/**
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 */

import _ from 'lodash'
/**  Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。
 *   Lodash 的模块化方法 非常适用于：
 *  遍历 array、object 和 string,对值进行操作和检测,创建符合功能的函数
 */
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条和tabs导航绑定，步骤条通过减0来隐式转化为number类型
      // tabs绑定接收的是字符串
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 图片上传路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的请求对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      picPreviewPath: '',
      // 图片预览对话框
      previewDialogVisible: false
    }
  },
  component: {
    // quillEditor
  },
  created() {
    this.getCateList()
  },
  computed: {
    getCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      this.cateList = res.data
    },
    // 联级选择器
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tabs 切换的回调，用来确定分类选着后可进行下一步操作
    beforeTabLeave(activeName, oldActiveName) {
      // 未选中商品分类阻止Tab标签跳转
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // Tab标签被选中时触发
    async tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        this.onlyTableData = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      this.picPreviewPath = file.response.data.url
      this.previewDialogVisible = true
      // console.log(file)
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用splice方法，移除图片信息
      this.addForm.splice(i, 1)

      // ES6为Array增加了find()，findIndex函数。find()函数用来查找目标元素(查找符合条件的第一个元素)，
      // 找到就返回该元素，找不到返回undefined，而findIndex()函数也是查找目标元素(查找符合条件的第一个元素)，
      // 找到就返回元素的位置，找不到就返回-1。
    },

    // 监听图片上传成功事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 表单提交
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        // 发送请求前：需对提交的表单进行处理goods_cat attrs
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 以上写法不对：级联选择器绑定的对象goods_cat要求是数组对象
        // 解决办法: 包：lodash 方法（深拷贝）：cloneDeep(boj)

        // 将this.addForm进行深拷贝  安装第三方库实现
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 通过js的内置对象JSON来进行数组对象的深拷贝
        // JSON.parse() 方法用于将一个 JSON 字符串转换为对象。
        // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
        // let form = JSON.parse(JSON.stringify(this.addForm))
        // form.goods_cat = form.goods_cat.join(',')

        //  数组转化为对象
        // 处理动态参数
        this.manyTableData.forEach(item => {
          let newMany = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join('')
          }
          this.addForm.attr_vals.push(newMany)
        })

        // 处理静态属性
        this.onlyTableData.forEach(item => {
          let nweOnly = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attr_vals.push(nweOnly)
        })

        // 逻辑问题，避免深拷贝的数据和渲染到页面的数据造成冲突，导致页面渲染依赖的数据出问题
        form.attr_vals = this.addForm.attr_vals

        // 发起请求添加商品
        // 商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 15px 0 0 !important;
}

.btnAdd {
  margin-top: 15px;
}
</style>
